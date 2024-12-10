<script setup lang="ts" generic="TReq,TRecord extends Record<string, unknown>">
import { h } from 'vue';
import type { DataListEmits, DataListProps, DataListSlots } from './types';
import DataTable from 'primevue/datatable';
import { useDataListStoreWithKey } from '../stores/datalist_store';
import { Column } from 'primevue';
import ColumnActions from './ColumnActions.vue';
import DataListHeader from './DataListHeader.vue';
import { FormKitSchema } from '@formkit/vue';
import DataListFilters from './DataListFilters.vue';
const props = defineProps<DataListProps<TReq, TRecord>>()
const slots = defineSlots<DataListSlots<TRecord>>()
const emit = defineEmits<DataListEmits<TRecord>>();
const dataListStore = useDataListStoreWithKey<TReq, TRecord>(props.context.key)
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
const selectAllColumn = h(Column, {
  selectionMode: 'multiple',
  pt: {
    headerCell: 'transparent',
  }

})
const renderDataList = () => {
  console.log("rendere whole")
  console.log(dataListStore.filtersFormSchema)
  return h(
    DataTable,
    {
      value: dataListStore.currentData,
      rows: 10,
      ref: 'tableEmelentRef',
      maxHeight: 200,
      filters: dataListStore.modelFiltersRef,
      "onUpdate:filters": (e: Event) => {
        console.log('upadat filters', e)
      },
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
      default: () => [selectAllColumn, ...currentDataColumns, renderColumnActions()],
      header: () => slots.header ?
        slots.header(dataListStore) :
        [
          h(DataListHeader, { datalistKey: props.context.key, exportable: props.context.exportable }, slots),
          h(DataListFilters, { datalistKey: props.context.key, isPresistFilters: props.context.isPresistFilters, useLazyFilters: props.context.useLazyFilters }, slots)
        ],
    }
  );
  //h('div' , {} , {})
}
</script>
<template>
  <component :is="renderDataList" />
</template>
