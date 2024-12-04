<script setup lang="ts">
import { h, ref } from 'vue';
import { type ColumnActionsProps, type ColumnActionsSlots } from './types';
import { useDataListStoreWithKey } from '../stores/datalist_store';
import { Menu } from 'primevue';
import AppBtn from '../components/AppBtn.vue';
const { datalistKey, data } = defineProps<ColumnActionsProps<unknown>>()
const dataListStore = useDataListStoreWithKey(datalistKey)
const slots = defineSlots<ColumnActionsSlots<unknown>>()
const actionsMenuElementRef = ref()
const actions = [
  h(AppBtn, { ...dataListStore.currentTableActions.create, onClick: dataListStore.createNewRecord }),
  h(AppBtn, { ...dataListStore.currentTableActions.update, onClick: dataListStore.updateRecord }),
  h(AppBtn, { ...dataListStore.currentTableActions.delete, onClick: dataListStore.deleteRecords }),
  h(AppBtn, { ...dataListStore.currentTableActions.deleteRestore, onClick: dataListStore.deleteRestoreRecords })
]

const renderColumnActions = () => {
  //const dropdownComponent = h(Menu, {
  //  ref: (el) => {
  //    if (el && !actionsMenuElementRef.value) {
  //      actionsMenuElementRef.value = el
  //    }
  //  },
  //  id: 'actions-menu',
  //  class: "import-menu",
  //  popup: true
  //})
  //const listComponent = h('div' , {class: ''})
  //const component = isDropdownMenu ? dropdownComponent : listComponent


  return h('div', {
    class: 'actions-btns__wrapper'
  }, [
    h(AppBtn, {
      icon: "view_visibility",
      class: "warning",
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
      class: "import-menu",
      popup: true
    },
      {
        start: () => h('div', slots.actions ? slots.actions({ data }) : [
          slots.prependActions ? slots.prependActions({ data }) : null,
          ...actions,
          slots.appendActions ? slots.appendActions({ data }) : null,
        ]),
      }
    )
  ])
}
</script>
<template>

  <component :is="renderColumnActions" />
</template>
