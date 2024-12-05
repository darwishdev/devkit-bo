<script setup lang="ts">
import { h } from 'vue';
import type { DataListEmits, DataListProps, DataListSlots } from './types';
import DataTable from 'primevue/datatable';
import { useDataListStoreWithKey } from '../stores/datalist_store';
import { Column } from 'primevue';
import { renderSelectAllColumn } from './columns/ColumnsRenderer';
import ColumnActions from './ColumnActions.vue';
import DataListHeader from './DataListHeader.vue';
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
        isDropdownMenu: props.context.isActionsDropdown,
        datalistKey: props.context.key
      }, slots)
    }
  )
}
const currentDataColumns = dataListStore.currentTableColumns.map((item) => h(Column, {
  ...item.props, pt: {
    headerCell: 'transparent',
  }
}, item.slots))
const renderDataList = () => {
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
      header: () => slots.header ? slots.header(dataListStore) : [h(DataListHeader, { datalistKey: props.context.key, exportable: props.context.exportable }, slots)],
    }
  );
}
</script>
<template>
  <component :is="renderDataList" />
</template>
