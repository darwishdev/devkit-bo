<script setup lang="ts">
import { FormKit, FormKitSchema } from '@formkit/vue';
import { useDataListStoreWithKey } from '../stores/datalist_store';
import type { DataListFiltersProps, DataListFiltersSlots } from './types';
import { h, ref, resolveComponent } from 'vue';
import { ObjectKeys } from '../objectutils/ObjectUtils';
import { useDebounceFn } from '@vueuse/core';
import Accordion from 'primevue/accordion';
import Chip from 'primevue/chip';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import { Panel, type DataTableFilterMetaData } from 'primevue';
import AppIcon from '../components/AppIcon.vue';
import AppBtn from '../components/AppBtn.vue';
const formkitComp = resolveComponent('FormKit')
const { datalistKey, useLazyFilters } = defineProps<DataListFiltersProps>()
const slots = defineSlots<DataListFiltersSlots>()
const filterFormNodeRef = ref()
const dataListStore = useDataListStoreWithKey(datalistKey)
const modelFilterFormRef = ref<Record<string, any>>({})
const renderFiltersForm = () => {
  console.log("ussssee", useLazyFilters)
  return h(formkitComp, {
    id: `${datalistKey}filter-form`,
    type: 'form',
    actions: useLazyFilters,
    ref: (el) => {
      if (el && !filterFormNodeRef.value) filterFormNodeRef.value = el
    },
    onInput: useLazyFilters ? undefined : useDebounceFn(dataListStore.applyFilters, dataListStore.currentDebounceInMilliSeconds),
    onSubmit: useLazyFilters ? useDebounceFn(dataListStore.applyFilters, dataListStore.currentDebounceInMilliSeconds) : undefined
  }, { default: () => h(FormKitSchema, { schema: dataListStore.filtersFormSchema }) })
}
const removeFilter = (filter: string) => {
  if (!filterFormNodeRef.value) return
  const node = filterFormNodeRef.value.node
  console.log("node is", node)
  if (node?._value) {
    node._value[filter] = null
  }
  node.input(node?._value)
}
const renderActiveFilters = () => {
  return dataListStore.activeFilters.map(filter => h(Chip, {
    removable: true,
    class: 'z-10 cursor-pointer',
    onRemove: () => {
      dataListStore.removeFilter(filter.input)
    },
    onClick: () => {
      console.log("filtterr", filterFormNodeRef.value)
      removeFilter(filter.input)
      if (modelFilterFormRef.value[filter.input]) {
        dataListStore.removeFilter(filter.input)
      }
    }

  }, {
    default: () => [
      h(AppIcon, { icon: 'filter' }),
      h('div', [
        h('span', filter.input),
        h('span', ':'),
        h('span', filter.value)
      ])]
  }))
}
const renderFilters = () => {
  return h(Panel, {
    toggleable: true,
    pt: {
      root: 'transparent',
      header: 'relative glass',
      content: 'glass',
      headerActions: 'filters-toggler'
    }
  },
    {
      header: () => h('div', { class: 'filters-header flex' }, [
        h('strong', 'filters'),
        h('div', { class: 'flex' }, renderActiveFilters())
      ]),
      default: () => [
        renderFiltersForm()
        //h(AccordionContent, {}, { default: () => [renderFiltersForm()] })
      ]
    }
  )
}
</script>
<template>
  <component :is="renderFilters" />
</template>
