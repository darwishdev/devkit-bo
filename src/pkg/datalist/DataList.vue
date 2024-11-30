<script setup lang="ts">
import { h, shallowRef, type VNode } from 'vue';
import { type DataListProps } from './types';
import { useDebounceFn } from '@vueuse/core'
import DataTable from 'primevue/datatable';
import { useDataListStoreWithKey } from '../stores/datalist_store';
import { ObjectKeys } from '../objectutils/ObjectUtils';
import { Column, ToggleSwitch, type ColumnSlots } from 'primevue';
import { RenderActionsColumn, renderSelectAllColumn } from './columns/ColumnsRenderer';
import { CreateBtn, ExportBtn } from './columns/BtnsRenderer';
import AppBtn from '../components/AppBtn.vue';
const props = defineProps<DataListProps<unknown, unknown>>()
const dataListStore = useDataListStoreWithKey(props.context.key)
await dataListStore.init(props)
const emit = defineEmits<{
  (e: 'update:selection', value: any[]): void
}>();
const slots = defineSlots<{
  default(): VNode
  start(props: { data: unknown }): VNode
  end(props: { data: unknown }): VNode
  expansion(props: { data: unknown }): VNode

  headerActionsStartPrepend(store: typeof dataListStore): VNode
  headerActionsStartAppend(store: typeof dataListStore): VNode
  headerActionsEndPrepend(store: typeof dataListStore): VNode
  headerActionsEndAppend(store: typeof dataListStore): VNode
  header(store: typeof dataListStore): VNode
  actions(props: { data: unknown }): VNode
  prependActions(props: { data: unknown }): VNode
  appendActions(props: { data: any }): VNode
} & any>()


const renderColumns = (): VNode[] => {
  const columns: VNode[] = []
  const { headers } = props.context
  for (let dataHeaderKey in headers) {
    const currentDataHeader = headers[dataHeaderKey]
    const isSlotPassed = ObjectKeys(slots).includes(`items.${dataHeaderKey}`)
    let columnSlots: Partial<ColumnSlots> | null = null
    if (typeof currentDataHeader.renderHtml == 'function') {
      const renderFunc = currentDataHeader.renderHtml
      columnSlots = {
        body: ({ data }) => [renderFunc(data)],
      }
    }
    const bodySlot = isSlotPassed ? slots[`items.${dataHeaderKey}`] : columnSlots ? columnSlots.body : undefined
    const columnNode = h(Column, {
      field: dataHeaderKey,
      header: dataHeaderKey,
      filterField: dataHeaderKey,
    }, { body: bodySlot })
    columns.push(columnNode)
  }

  const actionsColumn = RenderActionsColumn(props.context.key)
  if (actionsColumn) columns.push(actionsColumn)
  return columns
}
const renderHeader = (): VNode => {
  const startActions: VNode[] = []
  console.log("renderening header")
  const endActions: VNode[] = []
  const { exportable, options } = props.context
  const { createHandler, deleteRestoreHandler } = options
  if (slots.header) {
    return slots.header(dataListStore)
  }
  if (slots.headerActionsStartPrepend) {
    startActions[0] = slots.headerActionsStartAppend(dataListStore)
  }
  if (slots.headerActionsEndPrepend) {
    endActions[0] = slots.headerActionsStartAppend(dataListStore)
  }
  if (createHandler) {
    startActions.push(h(CreateBtn, { onClick: dataListStore.createNewRecord }))
  }
  const variant = dataListStore.deleteRestoreVaraints

  console.log("renderening header", variant, dataListStore.isShowDeletedRef)
  if (deleteRestoreHandler) {
    startActions.push(h(AppBtn, { ...variant, onClick: dataListStore.deleteRestoreRecords }))
  }


  if (variant.hasDeletedRecords) {
    const modelValue = dataListStore.isShowDeletedRef
    endActions.push(h(ToggleSwitch, {
      type: 'toggle',
      modelValue,
      onValueChange: (v: boolean) => {
        dataListStore.isLoadingRef = true
        useDebounceFn(() => {
          dataListStore.isShowDeletedRef = v
          dataListStore.isLoadingRef = false
        }, 1000)()
      }
    }))
  }
  if (exportable) {
    endActions.push(ExportBtn)
  }
  if (slots.headerActionsStartAppend) {
    startActions.push(slots.headerActionsStartAppend(dataListStore))
  }
  if (slots.headerActionsEndAppend) {
    endActions.push(slots.headerActionsStartAppend(dataListStore))
  }


  //if ()
  return h('div', {
    class: "table-actions"
  }, [
    h('div', {
      class: 'start'
    }, startActions),
    h('div', {
      class: 'end'
    }, endActions)
  ])
}
const currentDataColumns = renderColumns()
const renderDataList = () => {
  console.log("props", props)
  console.log("rendere whole")
  return h(
    DataTable,
    {
      value: dataListStore.currentData,
      rows: 10,
      ref: 'tableEmelentRef',
      maxHeight: 200,
      paginator: true,
      loading: dataListStore.isLoadingRef,
      selection: dataListStore.modelSelectionRef,
      "onUpdate:selection": (e: any) => {
        emit('update:selection', e)
        dataListStore.modelSelectionRef = e
      },
      paginatorTemplate:
        "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown",
    },
    {
      default: () => [renderSelectAllColumn, ...currentDataColumns], // Replace with your computed columns logic
      header: () => [renderHeader()], // Replace with your custom actions logic
    }
  );
}
</script>
<template>
  <component :is="renderDataList" />
</template>
