<script setup lang="ts">
import { h, type VNode } from 'vue';
import type { DataListEmits, DataListProps, DataListSlots } from './types';
import { useDebounceFn } from '@vueuse/core'
import DataTable from 'primevue/datatable';
import { useDataListStoreWithKey } from '../stores/datalist_store';
import { Column, ToggleSwitch } from 'primevue';
import { CreateBtn, ExportBtn } from './columns/BtnsRenderer';
import AppBtn from '../components/AppBtn.vue';
import { RenderActionsColumn, renderSelectAllColumn } from './columns/ColumnsRenderer';
import ColumnActions from './ColumnActions.vue';
const props = defineProps<DataListProps<unknown, unknown>>()
const slots = defineSlots<DataListSlots<unknown>>()
const emit = defineEmits<DataListEmits<unknown>>();
const dataListStore = useDataListStoreWithKey(props.context.key)
await dataListStore.init(props, slots)
const renderColumnActions = () => {
  return h(Column,
    {
      header: 'actions',
      pt: {
        headerCell: 'transparent'
      },
      class: 'actions-btns',
      headerStyle: {
        width: "1rem"
      },

    },
    {
      body: slots.actions ? slots.actions : (context: { data: any }) => h(ColumnActions, {
        data: context.data,
        isDropdownMenu: true,
        datalistKey: props.context.key
      })
    }
  )
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
const currentDataColumns = dataListStore.currentTableColumns.map((item) => h(Column, {
  ...item.props, pt: {
    headerCell: 'transparent',
  }
}, item.slots))
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
      pt: {
        root: 'glass rounded-md p-md',
        header: 'transparent',
        bodyRow: 'transparent',
      },
      calss: 'data-list',
      selection: dataListStore.modelSelectionRef,
      "onUpdate:selection": (e: any) => {
        emit('update:selection', e)
        dataListStore.modelSelectionRef = e
      },
      paginatorTemplate:
        "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown",
    },
    {
      default: () => [renderSelectAllColumn, ...currentDataColumns, renderColumnActions()],

      header: () => [renderHeader()],
    }
  );
}
</script>
<template>
  <component :is="renderDataList" />
</template>
