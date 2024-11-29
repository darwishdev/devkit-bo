import { useDataListStoreWithKey } from "@/pkg/stores/datalist_store"
import { Column, Menu, type ColumnSlots, type MenuMethods } from "primevue"
import { ref, defineComponent, h, type VNode } from "vue"
import { UpdateBtn, ViewBtn } from "./BtnsRenderer"
import AppBtn from "@/pkg/components/AppBtn.vue"
import type { ITableHeader } from "../types"
import { ObjectKeys } from "@/pkg/objectutils/ObjectUtils"

export const renderSelectAllColumn = h(Column, {
  selectionMode: 'multiple',
  headerStyle: {
    width: "3rem"
  }
})
export const renderExpanderColumn = h(Column, {
  expander: true,
  style: "width: 3rem",

})
const actionsColumnBase = h(Column, {
  actions: 'actions',
  class: 'actions-btns',
  headerStyle: {
    width: "3rem"
  }
})
export interface ActionsColumnSlots<TRecord> {
  prependActions?: (props: { data: TRecord }) => VNode,
  actions?: (props: { data: TRecord }) => VNode
  appendActions?: (props: { data: TRecord }) => VNode
}
const actionsColumn = <TRecord>(dataListKey: string, data: TRecord) => defineComponent({
  setup(_: unknown, { slots }: { slots: ActionsColumnSlots<TRecord> }) {
    const store = useDataListStoreWithKey(dataListKey)
    const { updateHandler, deleteRestoreHandler } = store.currentTableOptions
    const actionsMenuElementRef = ref()
    console.log("store here and hdnler is", updateHandler)
    const viewBtn = store.currentViewRouter ? h(ViewBtn, {
      onClick: store.viewRecord
    }) : undefined
    const updateBtn = updateHandler ? h(UpdateBtn, {
      onClick: store.updateRecord
    }) : undefined
    const deleteRestoreBtn = deleteRestoreHandler ? h(AppBtn, {
      icon: 'trash',
      class: "w-full transparent",
      label: "delete",
      onClick: () => {
        console.log("delete me")
      }
    }) : undefined
    console.log("data", data, viewBtn, updateBtn, deleteRestoreBtn)
    return () => h('div', {
      class: 'actions-btns__wrapper'
    }, [
      h(AppBtn, {
        icon: "view_visibility",
        class: "warning",
        ariaHaspopup: true,
        ariaControls: "actions-menu",
        onClick: (e: Event) => {
          actionsMenuElementRef.value.toggle(e)
          console.log(ObjectKeys(actionsMenuElementRef.value))
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
          'start': () => h('div', slots.actions ? slots.actions({ data }) : [
            slots.prependActions ? slots.prependActions({ data }) : null,
            viewBtn,
            updateBtn,
            deleteRestoreBtn,
            slots.appendActions ? slots.appendActions({ data }) : null,
          ]),
        }
      )
    ])
  }
})

export const RenderActionsColumn = <TRecord>(dataListKey: string) => h(actionsColumnBase, {}, {
  body: (context: { data: TRecord }) => h(actionsColumn(dataListKey, context.data))
})


export const renderColumns = <TRecord>(dataListKey: string, headers: Record<string, ITableHeader<TRecord>>, slots: Record<string, VNode>) => {
  console.log("rendeing columns")
  //const selectAllColumn = renderSelectAllColumn()
  const columns: VNode[] = []
  for (let dataHeaderKey in headers) {
    const dataHeader = headers[dataHeaderKey]
    const isSlotPassed = ObjectKeys(slots).includes(`items.${dataHeaderKey}`)
    let columnSlots: Partial<ColumnSlots> | null = null
    if (typeof dataHeader.renderHtml == 'function') {
      const renderFunc = dataHeader.renderHtml
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
  const actionsColumn = RenderActionsColumn(dataListKey)
  if (actionsColumn) columns.push(actionsColumn)
  return columns
}
