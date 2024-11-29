<script setup lang="ts">
import { computed, defineComponent, h, ref, renderList, shallowRef, type PropType, type VNode } from 'vue';
import { type DataListProps, type DataListWrapperProps } from './types';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { Menu, ToggleSwitch } from 'primevue';
import { useRouter } from 'vue-router';
import AppBtn from '../components/AppBtn.vue';
import { useDialog } from 'primevue';
import AppDialog from '../components/AppDialog.vue';
import { apiClient } from '../api/ApiClient';
import { useDataListStoreWithKey } from '../stores/datalist_store';
import { renderSelectAllColumn,  RenderActionsColumn, renderColumns } from './columns/ColumnsRenderer';
import { CreateBtn, ExportBtn } from './columns/BtnsRenderer';
const dialog = useDialog()
const modelSelectionRef = shallowRef([])
const tableEmelentRef = ref()
const props = defineProps<DataListProps<unknown, unknown>>()
const actionsMenuRef = ref<any>()
const router = useRouter()
const dataListStore = useDataListStoreWithKey(props.context.title)
const { options } = props.context
const isShowDeletedRef = ref(false)
await dataListStore.init(props)
const emit = defineEmits<{
  (e: 'update:selection', value: any[]): void
}>();
const ObjectKeys = <T extends {}>(obj: T) => {
  return Object.keys(obj) as (keyof T)[];
}
const slots = defineSlots<{
  default(): unknown
  start(props: { data: unknown }): unknown
  end(props: { data: unknown }): unknown
  expansion(props: { data: unknown }): unknown
  actions(props: { data: unknown }): unknown
  prependActions(props: { data: unknown }): unknown
  appendActions(props: { data: any }): unknown
} & any>()
const deleteRestoreVaraints = computed(() => {
  if (isShowDeletedRef.value) return { icon: 'replay', label: 'restore', empty: "empty_records_deleted" }
  return { icon: 'trash', lafile_upload: 'delete', empty: "empty_records" }
})

const data = computed(() => {
  if (isShowDeletedRef.value) return props.context.deletedRecords
  return props.context.records
})


const renderExpander = () => {
  if (!slots.expansion) return
  return h(Column, {
    expander: true,
    style: "width: 3rem",

  })
}
const renderDeletedFilter = () => {
  if (!props.context.deletedRecords) return
  return h(ToggleSwitch, {
    type: "toggle",
    value: isShowDeletedRef.value,
    outerClass: "deleted-toggle",
    onValueChange: (v: boolean) => {
      console.log("updated", v)
      //RouteQueryAppend('showDeleted', v)
      isShowDeletedRef.value = v
      modelSelectionRef.value = []
    },
    label: "show_deleted_data",

  })
}
const renderCreateBtn = () => {
  if (!options) return
  if (!options.createHandler) return
  return h(CreateBtn, {
    onClick: (_e: Event) => {
      if (props.context.formSections) {
        console.log("show the form on popup")
        return
      }
      router.push({ name: options.createHandler!.routeName })
    },
  })
}
const renderDeleteRestoreBtn = () => {
  if (!options.deleteRestoreHandler) return
  const { icon, label } = deleteRestoreVaraints.value
  return h(AppBtn, {
    label,
    icon,
    class: "danger",
    disabled: modelSelectionRef.value.length == 0,
    onClick: (_e: Event) => {
      console.log("modelSelectionRef", modelSelectionRef.value)
      console.log(tableEmelentRef.value.selection)
      dialog.open(h(AppDialog, {
        onConfirmed: (ref: any) => {
          const handler = options.deleteRestoreHandler
          if (!handler) return
          const deleteRestoreRequest = {} as any
          const requestProperty = handler.requestProperty || "records"
          deleteRestoreRequest[requestProperty] = modelSelectionRef.value.map((row: any) => {
            return row[props.context.dataKey]
          })
          const endPointName = handler.endpoint as keyof typeof apiClient
          const func = apiClient[endPointName]
          //func(deleteRestoreRequest).then((response: any) => {
          //  console.log("deleted", response)
          //  modelSelectionRef.value = []
          //  props.context.records = []
          //  ref.close()
          //})
          console.log("deleting the data in the model section ref")
        }
      }, {
        default: () => h('h2', 'hello from slot')
      }))
      console.log("show delete dialog")
    },
  })
}
const renderExportBtn = () => {
  if (!props.context.exportable) return
  return h(ExportBtn, {
    onClick: () => {
      tableEmelentRef.value.exportCSV()
    },
  })
}
const renderTableActions = () => {
  return h('div', {
    class: "table-actions"
  }, [
    h('div', {
      class: 'start'
    }, [
      renderCreateBtn(),
      renderDeleteRestoreBtn()
    ]),
    h('div', {
      class: 'end'
    }, [

      renderExportBtn(),
      renderDeletedFilter()
    ])
  ])

}
const renderActionsColumn = () => {
  if (!props.context.options.updateHandler && !props.context.options.deleteRestoreHandler && !props.context.viewRouter) return

  const renderUpdateBtn = (data: any) => {
    if (!props.context.options.updateHandler) return
    const { routeName } = props.context.options.updateHandler
    const params = { id: data[props.context.dataKey] }
    return h(AppBtn, {
      class: "w-full transparent",
      icon: "pencil",
      label: "update",
      onClick: () => {
        router.push({ name: routeName, params })
      }
    })
  }
  const renderDeleteRestoreBtn = (data: any) => {
    if (!props.context.options.deleteRestoreHandler) return
    return h(AppBtn, {
      icon: 'trash',
      class: "w-full transparent",
      label: "delete",
      onClick: () => {
        console.log("delete me")
      }
    })
  }
  const renderViewBtn = (data: any) => {
    if (!props.context.viewRouter) return
    const { name, paramColumnName, paramName } = props.context.viewRouter
    const params: Record<string, any> = {}

    params[paramName] = data[paramColumnName]
    return h(AppBtn, {
      class: "w-full transparent",
      icon: "view_visibility",
      label: 'view',
      onClick: () => {
        router.push({ name, params })
      }
    })
  }
  const actionsColumn = h(Column, {
    header: 'actions',
    class: "actions-btns",
    headerStyle: {
      width: "3rem"
    },
  }, {
    body: (context: { data: any }) => h('div', {
      class: "actions-wrapperr "
    }, [
      h(AppBtn, {
        icon: "view_visibility",
        class: "warning",
        onClick: (e: Event) => console.log("clicked", e)
      }),
      h(Menu, {
        ref: (el) => {
          if (el && !actionsMenuRef.value) {
            actionsMenuRef.value = el
          }
        },
        class: "import-menu",
        popup: true
      },
        {
          'start': () => h('div', slots.actions ? slots.actions(context.data) : [
            slots.prependActions ? slots.prependActions(context.data) : null,
            renderViewBtn(context.data),
            renderUpdateBtn(context.data),
            renderDeleteRestoreBtn(context.data),
            slots.appendActions ? slots.appendActions(context.data) : null,
          ]),
        }
      )
      // renderViewBtn(data),
      // renderUpdateBtn(data),
      // renderDeleteRestoreBtn(data)
    ])
  })
  return actionsColumn
}
//const renderColumns = () => {
//  console.log("rendeing columns")
//  //const selectAllColumn = renderSelectAllColumn()
//  const expanderColumn = renderExpander()
//  const columns: VNode[] = [
//    //selectAllColumn,
//  ]
//  for (let dataHeaderKey in props.context.headers) {
//    const dataHeader = props.context.headers[dataHeaderKey]
//    const isSlotPassed = ObjectKeys(slots).includes(`items.${dataHeaderKey}`)
//    let columnSlots: ColumnSlots | null = null
//    if (typeof dataHeader.renderHtml == 'function') {
//      const renderFunc = dataHeader.renderHtml as (row: any) => VNode
//      columnSlots = {
//        body: (slotProps) => [renderFunc(slotProps.data)],
//      }
//    }
//    const bodySlot = isSlotPassed ? slots[`items.${dataHeaderKey}`] : columnSlots ? columnSlots.body : undefined
//    const columnNode = h(Column, {
//      field: dataHeaderKey,
//      header: dataHeaderKey,
//      filterField: dataHeaderKey,
//    }, { body: bodySlot })
//    columns.push(columnNode)
//  }
//  const actionsColumn = RenderActionsColumn(props.context.title)
//  if (actionsColumn) columns.push(actionsColumn)
//  if (expanderColumn) columns.push(expanderColumn)
//  return columns
//}
  const columnsCompouted = renderColumns(props.context.title , props.context.headers , slots)
const selectAllColumn = renderSelectAllColumn
const tableActions = renderTableActions()
type ColumnSlots = { body: (ctx: { data: any }) => VNode[], editor?: (props: any) => any }
const renderDataList = () => {
  console.log("props", props)
  console.log("rendere whole")
  return h(
    DataTable,
    {
      value: data.value,
      rows: 10,
      ref: 'tableEmelentRef',
      maxHeight: 200,
      vOnce: true, // Add this if you want to optimize static rendering
      paginator: true,
      selection: modelSelectionRef.value,
      "onUpdate:selection": (e: any) => {
        modelSelectionRef.value = e
      },
      paginatorTemplate:
        "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown",
    },
    {
      default: () => [selectAllColumn, ...columnsCompouted], // Replace with your computed columns logic
      header: () => [tableActions], // Replace with your custom actions logic
    }
  );
}
</script>
<template>
  <component :is="renderDataList" />
</template>
