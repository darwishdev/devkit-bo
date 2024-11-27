<script setup lang="ts">
import { h, ref, renderList, type VNode } from 'vue';
import { type DataListProps } from './types';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { Menu } from 'primevue';
import AppBtn from '../components/AppBtn.vue';
import { useRouter } from 'vue-router';
const modelSelectionRef = ref([])
const tableEmelentRef = ref()
const props = defineProps<DataListProps<any, any>>()
const emit = defineEmits<{
  (e: 'update:selection', value: any[]): void
}>();
const ObjectKeys = <T extends {}>(obj: T) => {
  return Object.keys(obj) as (keyof T)[];
}
const slots = defineSlots<{
  default(): any
  start(props: { data: any }): any
  end(props: { data: any }): any
  expansion(props: { data: any }): any
  actions(props: { data: any }): any
  prependActions(props: { data: any }): any
  appendActions(props: { data: any }): any
} & any>()
const renderSelectAllColumn = () => {
  return h(Column, {
    selectionMode: 'multiple',
    headerStyle: {
      width: "3rem"
    }
  })

}

const renderExpander = () => {
  if (!slots.expansion) return
  return h(Column, {
    expander: true,
    style: "width: 3rem",

  })
}
const actionsMenuRef = ref<any>()
const router = useRouter()
const renderActionsColumn = () => {
  if (!props.context.options.updateHandler && !props.context.options.deleteRestoreHandler && !props.context.viewRouter) return

  const rowActionsProps: TableRowActionsProps = {
    viewRouter: props.context.viewRouter,
    dataKey: props.context.dataKey as string,
    options: props.context.options

  }

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
type ColumnSlots = { body: (ctx: { data: any }) => VNode[], editor?: (props: any) => any }
const renderColumns = () => {
  const selectAllColumn = renderSelectAllColumn()
  const expanderColumn = renderExpander()
  const columns: VNode[] = [
    selectAllColumn,
  ]
  for (let dataHeaderKey in props.context.headers) {
    const dataHeader = props.context.headers[dataHeaderKey]
    const isSlotPassed = ObjectKeys(slots).includes(`items.${dataHeaderKey}`)
    let columnSlots: ColumnSlots | null = null
    if (typeof dataHeader.renderHtml == 'function') {
      const renderFunc = dataHeader.renderHtml as (row: any) => VNode
      columnSlots = {
        body: (slotProps) => [renderFunc(slotProps.data)],
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
  const actionsColumn = renderActionsColumn()
  if (actionsColumn) columns.push(actionsColumn)
  if (expanderColumn) columns.push(expanderColumn)
  return columns
}

const renderDataList = () => {
  console.log("props", props)
  const columns = renderColumns()
  console.log("colo", columns)
  return !props.context.records ? h('loadomng') : h(
    DataTable, {
    value: props.context.records,
    rows: 10,
    maxHeight: 200,
    paginator: true,
    headers: ['roleName'],
    selection: modelSelectionRef,
    ref: "tableEmelentRef",
    "onUpdate:selection": (e: any) => {
      modelSelectionRef.value = e
      emit('update:selection', e)
    },
    paginatorTemplate: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown",
  }, {
    expansion: slots.expansion,
    default: () => renderColumns(),
    empty: () => h('div', {
      class: "empty-table"
    }, [
      h("h3", 'empty'),
      //h("p", t(`breif_${route.name as string}`)),
    ]),
  }
  );
}
</script>
<template>
  <component :is="renderDataList()" />
</template>
