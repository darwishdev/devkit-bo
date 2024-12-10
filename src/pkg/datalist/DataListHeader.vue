<script setup lang="ts">
import { h, type VNode } from 'vue';
import type { DataListHeaderSlots, DataListHeaderProps } from './types';
import { useDataListStoreWithKey } from '../stores/datalist_store';
import AppBtn from '../components/AppBtn.vue';
import { ToggleSwitch } from 'primevue';
import { useDebounceFn } from '@vueuse/core';
const { datalistKey, exportable } = defineProps<DataListHeaderProps>()
const slots = defineSlots<DataListHeaderSlots>()
const dataListStore = useDataListStoreWithKey(datalistKey)
const ExportBtn = h(AppBtn, {
  icon: "file_upload",
  class: "info",
  label: "export"
})

const actions = [
  slots.headerActionsStartPrepend ? slots.headerActionsStartPrepend(dataListStore) : undefined,
  dataListStore.currentTableActions.create ? h(AppBtn, { ...dataListStore.currentTableActions.create, onClick: dataListStore.createNewRecord, severity: 'success', class: '' }) : undefined,
  slots.headerActionsStartAppend ? slots.headerActionsStartAppend(dataListStore) : undefined,
]
const renderHeader = (): VNode => {
  const deleteRestoreBtn = dataListStore.currentTableActions.delete ? h(AppBtn, {
    ...dataListStore.currentTableActions.delete,
    disabled: dataListStore.deleteRestoreVaraints.disabled,
    severity: 'danger',
    onClick: dataListStore.deleteRecords
  }) : undefined
  const deleteBtn = dataListStore.currentTableActions.deleteRestore ? h(AppBtn, {
    ...dataListStore.currentTableActions.deleteRestore,
    disabled: dataListStore.deleteRestoreVaraints.disabled,
    severity: 'danger',
    class: 'text-white',
    onClick: dataListStore.deleteRestoreRecords
  }) : undefined
  const variant = dataListStore.deleteRestoreVaraints
  return h('div', {
    class: "table-actions"
  }, [
    h('div', {
      class: 'start'
    }, [...actions, deleteRestoreBtn, deleteBtn]),
    h('div', {
      class: 'end'
    }, [
      variant.hasDeletedRecords ? h(ToggleSwitch, {
        type: 'toggle',
        modelValue: dataListStore.isShowDeletedRef,
        onValueChange: dataListStore.setIsShowDeletedRef,
      }) : undefined,
      exportable ? h(ExportBtn) : undefined,
    ])
  ])
}
</script>
<template>
  <component :is="renderHeader" />
</template>
