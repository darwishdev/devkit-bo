import type { TableRouter, ITableHeaderProps, AppTableFilter, FormKitNodeInput, ITableHeader } from '@/pkg/datalist/types'
import type { FormKitNode } from '@formkit/core'
import { h, resolveComponent } from 'vue'
import Tag from 'primevue/tag';
import { type ColumnProps } from 'primevue/column';
//import { convertDateRedable } from '@/utils/date/date';




export class TableHeaderBase {
  columnProps: ColumnProps = {}
  columnName: string
  tableRouter?: TableRouter<unknown>

  editInput?: FormKitNodeInput
  isGlobalFilter: boolean
  filter?: AppTableFilter
  constructor(name: string, params: ITableHeaderProps) {
    this.columnName = name
    this.filter = params.filter
    this.editInput = params.editInput
    this.columnProps.sortable = params.sortable
    this.isGlobalFilter = typeof params.isGlobalFilter == 'undefined' ? false : params.isGlobalFilter
    if (params.filter) {
      this.filter = params.filter
    }
    if (params.router) {
      this.tableRouter = params.router
    }
  }
}

export class TableHeaderText extends TableHeaderBase implements ITableHeader {

}

export class TableHeaderLink extends TableHeaderText implements ITableHeader {
  renderHtml = (value: any) => {
    if (!this.tableRouter || !this.tableRouter) {
    }
    const ruterLink = resolveComponent('router-link')
    const params = {} as any
    params[this.tableRouter!.paramName] = value[this.tableRouter!.paramColumnName]
    return h(ruterLink, { to: { name: this.tableRouter!.name, params } }, () => [h('span', value[this.columnName])])
  }
}

