import AppBtn from "@/pkg/components/AppBtn.vue"
import { h } from "vue"
export const ExportBtn = h(AppBtn, {
  icon: "file_upload",
  class: "info",
  label: "export"
})
export const ViewBtn = h(AppBtn, {
  icon: "view_visibility",
  class: 'view',
  label: "view"
})
export const CreateBtn = h(AppBtn, {
  icon: "plus",
  class: "create",
  label: "create"
})
export const UpdateBtn = h(AppBtn, {
  icon: "pencil",
  class: "update",
  label: "update"
})

