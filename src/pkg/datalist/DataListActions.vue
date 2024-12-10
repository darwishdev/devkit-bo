<script setup lang="ts">
import { h, shallowRef, type VNode } from 'vue';
import { type DataListProps } from './types';
import { useDataListStoreWithKey } from '../stores/datalist_store';
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

const currentDataColumns = renderColumns()
const renderDataList = () => {

}
</script>
<template>
  <component :is="renderDataList" />
</template>
