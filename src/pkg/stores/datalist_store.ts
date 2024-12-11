import { ref, computed, h, inject, type VNode } from 'vue'
import type { FormKitSchemaNode } from '@formkit/core'
import { defineStore } from 'pinia'
import type { ApiListOptions, AppFormSection, DataListProps, DataListSlots, ITableHeader, tableFetchFn, TableRouter } from '../datalist/types'
import { useRouter } from 'vue-router'
import { useDialog, type DataTableMethods } from 'primevue'
import AppDialog from '../components/AppDialog.vue'
import type { DataTableFilterMetaData } from 'primevue/datatable';
import { ObjectKeys, subtractRecords } from '../objectutils/ObjectUtils'
import type { ColumnNode, ColumnProps, ColumnSlots } from 'primevue'
import type { AppBtnProps } from '../components/AppBtn.vue'
import { useDebounceFn } from '@vueuse/core'
import { RouteQueryAppend } from '../queryutils/QueryUtils'
import AppFormDialog from '../components/AppFormDialog.vue'
import type { AppFormDialogProps } from '../types/types'
export const useDataListStore = <TReq, TRecord extends Record<string, unknown>>(dataLisKey: string) => defineStore(`datalist-${dataLisKey}`, () => {
  let currentTableOptions = ref<ApiListOptions>({ title: dataLisKey, description: "" })
  let currentTableFormSchema: Record<string, AppFormSection | FormKitSchemaNode[]> | undefined
  let currentTableDataKey: keyof TRecord = `${dataLisKey}Id` as keyof TRecord
  let currentViewRouter: TableRouter<TRecord> | undefined
  let filtersFormSchema: FormKitSchemaNode[] = []
  let currentIsPresistFilters: boolean | undefined
  let currentTableActions: {
    create?: AppBtnProps,
    update?: AppBtnProps,
    deleteRestore?: AppBtnProps,
    delete?: AppBtnProps,
    view?: AppBtnProps,
    export?: AppBtnProps,
  } = {}
  let currentTableFetchFn: tableFetchFn<TReq, TRecord> | undefined
  let currentTableColumns: { props: ColumnProps, slots: Partial<ColumnSlots> }[] = []
  let currentDebounceInMilliSeconds = 1000
  const filtersFormKey = `${dataLisKey}-filters`
  const recordsRef = ref<TRecord[]>([])
  const isLoadingRef = ref(false)
  const tableElementRef = ref<DataTableMethods>()
  const deletedRecordsRef = ref<TRecord[]>([])
  const isShowDeletedRef = ref(false)
  const apiClient = inject('apiClient') as Record<string, Function>
  const modelSelectionRef = ref<TRecord[]>([])
  const modelFiltersRef = ref<Record<string, DataTableFilterMetaData>>({})
  const { push } = useRouter()
  const dialog = useDialog()
  const deleteRestoreVaraints = computed(() => {
    const hasDeletedRecords = deletedRecordsRef.value.length > 0
    const hasSelectedData = modelSelectionRef.value.length > 0
    if (isShowDeletedRef.value) return { disabled: !hasSelectedData, hasSelectedData, hasDeletedRecords, icon: 'replay', label: 'restore', empty: "empty_records_deleted" }
    return { disabled: !hasSelectedData, hasDeletedRecords, icon: 'trash', label: 'delete', empty: "empty_records" }
  })
  const activeFilters = computed<{ input: string, value: string }[]>(() => {
    const activeFiltersArr = []
    const filtersFormKeys = ObjectKeys(modelFiltersRef.value)
    for (const dataHeaderKey of filtersFormKeys) {
      const currentInputValue = modelFiltersRef.value[dataHeaderKey]
      if (currentInputValue.value) activeFiltersArr.push({ input: dataHeaderKey, value: currentInputValue.value })
    }
    return activeFiltersArr
  })

  const currentData = computed(() => {
    if (isShowDeletedRef.value) return deletedRecordsRef.value
    return recordsRef.value
  })
  const removeFilter = (filterKey: string) => {
    if (!modelFiltersRef.value[filterKey]) return
    modelFiltersRef.value[filterKey].value = null
  }
  const applyFilters = (filtersFormValue: Record<string, any>) => {
    const filtersFormKeys = ObjectKeys(filtersFormValue)
    const urlQuery: Record<string, string> = {}
    const newModelValue: Record<string, DataTableFilterMetaData> = {}
    for (const dataHeaderKey of filtersFormKeys) {
      const currentInputValue = filtersFormValue[dataHeaderKey]
      newModelValue[dataHeaderKey] = { value: currentInputValue, matchMode: modelFiltersRef.value[dataHeaderKey].matchMode }
      if (currentInputValue) {
        urlQuery[dataHeaderKey] = currentInputValue
      }
    }
    modelFiltersRef.value = newModelValue
    const filtersFormValueString = JSON.stringify(urlQuery)
    RouteQueryAppend(filtersFormKey, filtersFormValueString)
    if (currentIsPresistFilters) {
      localStorage.setItem(filtersFormKey, filtersFormValueString)
    }
  }
  const extractTableColumns = (headers: Record<keyof TRecord & string, ITableHeader<TRecord>>, slots: DataListSlots<TRecord>) => {
    let index = 0
    for (let dataHeaderKey of ObjectKeys(headers)) {
      const currentDataHeader = headers[dataHeaderKey]
      const isSlotPassed = ObjectKeys(slots).includes(`column.${dataHeaderKey}`)
      let columnSlots: Partial<ColumnSlots> | null = null
      if (typeof currentDataHeader.renderHtml == 'function') {
        const renderFunc = currentDataHeader.renderHtml
        columnSlots = {
          body: ({ data }) => [renderFunc(data)],
        }
      }

      const bodySlot = isSlotPassed
        ? (slots[`column.${dataHeaderKey}`] as ((scope: { data: any; node: any; column: ColumnNode; field: string; index: number; frozenRow: boolean; editorInitCallback: (event: Event) => void; rowTogglerCallback: (event: Event) => void }) => VNode[]))
        : columnSlots
          ? columnSlots.body
          : undefined;
      const currentColumnProps = {
        field: dataHeaderKey,
        header: dataHeaderKey,
      }
      currentTableColumns[index] = {
        slots: { body: bodySlot },
        props: currentColumnProps
      }
      if (currentDataHeader.filter) {
        filtersFormSchema[index] = currentDataHeader.filter.input
        modelFiltersRef.value[dataHeaderKey] = { matchMode: currentDataHeader.filter.matchMode, value: null }
      }
      index++
    }
  }
  const extractTableActions = (options: ApiListOptions) => {
    if (currentViewRouter) {
      currentTableActions.view = {
        icon: "view_visibility",
        class: 'glass',
        label: "view"
      }
    }
    if (options.createHandler) {
      currentTableActions.create = {
        icon: "plus",
        class: 'glass',
        label: "create"
      }
    }
    if (options.updateHandler) {
      currentTableActions.update = {
        icon: "edit",
        class: 'glass',
        label: "update"
      }
    }
    if (options.deleteRestoreHandler) {
      currentTableActions.deleteRestore = {
        icon: deleteRestoreVaraints.value.icon,
        class: 'glass',
        label: deleteRestoreVaraints.value.label,
      }
    }
    if (options.deleteHandler) {
      currentTableActions.delete = {
        icon: "trash",
        class: 'glass',
        label: "delete"
      }
    }

  }
  const init = (props: DataListProps<TReq, TRecord>, slots: DataListSlots<TRecord>) => {
    return new Promise<void>((resolve) => {
      const { options, records, viewRouter, debounceInMilliSeconds, isPresistFilters, headers, deletedRecords, dataKey, formSections, fetchFn, initiallySelectedItems } = props.context
      recordsRef.value = records
      deletedRecordsRef.value = deletedRecords || []
      if (initiallySelectedItems) modelSelectionRef.value = initiallySelectedItems
      currentTableOptions.value = options
      currentTableFormSchema = formSections
      currentTableDataKey = dataKey
      currentIsPresistFilters = isPresistFilters
      if (debounceInMilliSeconds) currentDebounceInMilliSeconds = debounceInMilliSeconds
      currentViewRouter = viewRouter
      if (typeof fetchFn == 'string') {
        currentTableFetchFn = apiClient[fetchFn] as tableFetchFn<TReq, TRecord>
      }
      if (typeof fetchFn != 'string') {
        currentTableFetchFn = fetchFn
      }

      extractTableColumns(headers, slots)
      extractTableActions(options)
      resolve()
    })
  }
  const updateRecord = (id: unknown) => {
    if (!currentTableOptions.value.updateHandler) {
      console.log("this should not be called")
      return
    }
    if (currentTableFormSchema) {
      openUpdateFormDialog(id)
      return
    }
    const params = { id: id as string }
    push({ name: currentTableOptions.value.updateHandler.routeName, params: params })
  }
  const viewRecord = (data: TRecord) => {
    if (!currentViewRouter || !currentTableDataKey) {
      console.log("this should not be called")
      return
    }
    const params: Record<string, string> = {}
    params[currentViewRouter.paramName] = data[currentViewRouter.paramColumnName] as string
    push({ name: currentViewRouter.name, params: params })
  }

  const openUpdateFormDialog = (id : unknown) => {
    const appFormDialogProps: AppFormDialogProps = {
      title : currentTableOptions.value!.updateHandler!.title,
      sections: currentTableFormSchema!,
      handlers : {
        submitHandler : {
         endpoint : apiClient[currentTableOptions.value.updateHandler!.endpoint] as any,
        },
        findHandler : {
          endpoint : apiClient[currentTableOptions.value.updateHandler!.findEndpoint] as any,
          requestPropertyName : currentTableOptions.value.updateHandler!.findRequestProperty,
        }
      }
    }
    dialog.open(h(AppFormDialog, appFormDialogProps), {
      props: {
        modal: true,
        dismissableMask: true,
        header: currentTableOptions.value.updateHandler!.title,
        style: {
          width: '45vw'
        }
      },
      onClose : (options) => {
        if(options && options.data && options.data.success){
          currentTableFetchFn!({} as TReq).then((response) => {
            recordsRef.value = response.records
          })
        }
      }
  })
  }

  const openCreateFormDialog = () => {
    const appFormDialogProps: AppFormDialogProps = {
      title : currentTableOptions.value!.createHandler!.title,
      sections: currentTableFormSchema!,
      handlers : {
        submitHandler : {
         endpoint : apiClient[currentTableOptions.value.createHandler!.endpoint] as any,
        }
      }
    }
    dialog.open(h(AppFormDialog, appFormDialogProps), {
      props: {
        modal: true,
        dismissableMask: true,
        header: currentTableOptions.value.createHandler!.title,
        style: {
          width: '45vw'
        }
      },
      onClose : (options) => {
        if(options && options.data && options.data.success){
          currentTableFetchFn!({} as TReq).then((response) => {
            recordsRef.value = response.records
          })
        }
      }
  })
  }

  const createNewRecord = () => {
    if (!currentTableOptions.value.createHandler) {
      console.log("this should not be called")
      return
    }
    if (currentTableFormSchema) {
      openCreateFormDialog()
      console.log("show the form dialog thing")
      return
    }
    push({ name: currentTableOptions.value.createHandler.routeName })
  }
  const setIsShowDeletedRef = (value: boolean) => {
    isLoadingRef.value = true
    useDebounceFn(() => {
      console.log("calling the dbooo")
      isShowDeletedRef.value = value
      isLoadingRef.value = false
    }, currentDebounceInMilliSeconds)()

  }

  const deleteRestoreRecordsConfirmed = (dialogRef: { close: Function }) => {
    const handler = currentTableOptions.value.deleteRestoreHandler
    if (!handler) {
      console.log("whis should not be called")
      return
    }
    const deleteRestoreRequest: Record<string, unknown> = {}
    const requestProperty = handler.requestProperty || "records"

    deleteRestoreRequest[requestProperty] = modelSelectionRef.value.map((row: any) => {
      return row[currentTableDataKey]
    })

    const deleteEndpointFn = apiClient[handler.endpoint]
    deleteEndpointFn(deleteRestoreRequest).then((response: unknown) => {
      const records = recordsRef.value as TRecord[]
      const deletedRecords = deletedRecordsRef.value as TRecord[]
      const selectedRecords = modelSelectionRef.value as TRecord[]
      if (isShowDeletedRef.value) {
        recordsRef.value = [...records, ...selectedRecords]
        deletedRecordsRef.value = subtractRecords<TRecord>(deletedRecords, selectedRecords, currentTableDataKey)
        if (deletedRecordsRef.value.length == 0) {
          isShowDeletedRef.value = false
        }
        modelSelectionRef.value = []
        dialogRef.close()
        return

      }
      recordsRef.value = subtractRecords<TRecord>(records, selectedRecords, currentTableDataKey)
      if (recordsRef.value.length == 0) {
        isShowDeletedRef.value = true
      }
      modelSelectionRef.value = []
      deletedRecordsRef.value = [...deletedRecords, ...selectedRecords]
      dialogRef.close()
    })
  }
  const deleteRestoreRecords = () => {
    const dialogProps = {
      onConfirmed: deleteRestoreRecordsConfirmed,
      modal: true
    }
    dialog.open(h(AppDialog, dialogProps, {
      default: () => h("h2", "are you sure")
    }), {
      props: {
        modal: true,
        dismissableMask: true
      }
    })
  }
  const deleteRecords = () => {
    const dialogProps = {
      onConfirmed: deleteRestoreRecordsConfirmed
    }
    dialog.open(h(AppDialog, dialogProps, {
      default: () => h("h2", "are you sure")
    }))
  }


  const exportRecords = () => {
    if (!tableElementRef.value) return
    tableElementRef.value.exportCSV()
  }

  return {
    createNewRecord,
    deleteRestoreRecords,
    deleteRestoreVaraints,
    currentViewRouter,
    currentData,
    currentTableOptions,
    updateRecord,
    isShowDeletedRef,
    currentTableColumns,
    init,
    removeFilter,
    modelFiltersRef,
    filtersFormSchema,
    viewRecord,
    isLoadingRef,
    setIsShowDeletedRef,
    deleteRecords,
    modelSelectionRef,
    activeFilters,
    applyFilters,
    currentDebounceInMilliSeconds,
    exportRecords,
    currentTableActions
  }
})
export const useDataListStoreWithKey = <TReq, TRecord>(dataListKey: string) => useDataListStore<TReq, TRecord>(dataListKey)()
