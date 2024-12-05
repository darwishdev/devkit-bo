<script setup lang="ts">
import { h, ref } from 'vue';
import { type ColumnActionsProps, type ColumnActionsSlots } from './types';
import { useDataListStoreWithKey } from '../stores/datalist_store';
import { Menu } from 'primevue';
import AppBtn from '../components/AppBtn.vue';
const { datalistKey, data, isDropdownMenu } = defineProps<ColumnActionsProps<unknown>>()
const dataListStore = useDataListStoreWithKey(datalistKey)
const slots = defineSlots<ColumnActionsSlots<unknown>>()
const actionsMenuElementRef = ref()
const actions = [
  slots.prependActions ? slots.prependActions({ data }) : undefined,
  dataListStore.currentViewRouter ? h(AppBtn, { ...dataListStore.currentTableActions.view, onClick: dataListStore.viewRecord }) : undefined,
  dataListStore.currentTableActions.update ? h(AppBtn, { ...dataListStore.currentTableActions.update, onClick: dataListStore.updateRecord, label: !isDropdownMenu ? '' : dataListStore.currentTableActions.update.label }) : undefined,
]
const renderActions = () => {
  if (slots.actions) return h('div', { class: 'actions-btns__wrapper' }, slots.actions({ data }))
  const deleteRestoreBtn = dataListStore.currentTableActions.deleteRestore ? h(AppBtn, { ...dataListStore.currentTableActions.deleteRestore, onClick: dataListStore.deleteRestoreRecords, label: !isDropdownMenu ? '' : dataListStore.currentTableActions.deleteRestore.label }) : undefined
  const deleteBtn = dataListStore.isShowDeletedRef && dataListStore.currentTableActions.delete ? h(AppBtn, { ...dataListStore.currentTableActions.delete, onClick: dataListStore.deleteRecords }) : undefined
  const appendActions = slots.appendActions ? slots.appendActions({ data }) : undefined
  if (!isDropdownMenu) return h('div', { class: 'actions-btns__wrapper flex gap-2' }, [...actions, deleteRestoreBtn, deleteBtn, appendActions])
  return h('div', {
    class: 'actions-btns__wrapper'
  }, [
    h(AppBtn, {
      icon: "menu",
      class: "glass",
      ariaHaspopup: true,
      ariaControls: "actions-menu",
      onClick: (e: Event) => {
        actionsMenuElementRef.value.toggle(e)
      }
    }),
    h(Menu, {
      ref: (el) => {
        if (el && !actionsMenuElementRef.value) {
          actionsMenuElementRef.value = el
        }
      },
      id: 'actions-menu',
      class: 'actions-menu',
      popup: true
    },
      {
        start: () => h('div', [actions, deleteRestoreBtn, deleteBtn, appendActions]),
      }
    )
  ])
}

</script>
<template>
  <component :is="renderActions" />
</template>
