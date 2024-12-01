import { useDataListStoreWithKey } from "@/pkg/stores/datalist_store"
import { Column, Menu } from "primevue"
import { ref, defineComponent, h, type VNode } from "vue"
import { UpdateBtn, ViewBtn } from "./BtnsRenderer"
import AppBtn from "@/pkg/components/AppBtn.vue"
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
    if (slots.actions) {
      return slots.actions({ data })
    }
    console.log("data is ", dataListKey)
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
    const variant = store.deleteRestoreVaraints
    const deleteRestoreBtn = deleteRestoreHandler ? h(AppBtn, {
      ...variant,
      disabled: false,
      onClick: () => {
        store.modelSelectionRef.push(data)
        store.deleteRestoreRecords()
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

