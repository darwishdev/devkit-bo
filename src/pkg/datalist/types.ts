import type { FormKitSchemaNode } from '@formkit/core'
import type { VNode } from "vue"
import type { ColumnProps } from 'primevue/column'

type CreateHandler = {
  title: string
  redirectRoute: string
  routeName: string
  endpoint: string
}



type UpdateHandler = {
  title: string
  redirectRoute: string
  routeName: string
  endpoint: string
  findEndpoint: string
  findRequestProperty: string
}

type DeleteRestoreHandler = {
  endpoint: string
  requestProperty: string
}

type ImportHandler = {
  endpoint: string
  importTemplateLink: string
}

export type TableRouter = {
  name: string,
  paramName: string,
  paramColumnName: string
}
export type ApiListOptions = {
  title: string
  description: string
  createHandler?: CreateHandler
  updateHandler?: UpdateHandler
  deleteRestoreHandler?: DeleteRestoreHandler
  importHandler?: ImportHandler
}

export interface ITableHeaderProps {
  sortable: boolean,
  editInput?: FormKitNodeInput
  isGlobalFilter?: boolean
  filter?: AppTableFilter
  router?: TableRouter
}
export type ApiResponseList<TRecord> = {
  records: TRecord[]
  deletedRecords?: TRecord[]
  options?: ApiListOptions
}
export type tableFetchFn<TResp, TRecord> =
  (req: any, options?: any) => Promise<
    TResp extends ApiResponseList<TRecord>
    ? TResp
    : undefined>


export type AppTableFilterInputs = Record<string, FormKitSchemaNode>

export type FilterMatchModeValues = 'startsWith' | 'contains' | 'notContains' | 'endsWith' | 'equals' | 'notEquals' | 'in' | 'lt' | 'lte' | 'gt' | 'gte' | 'between' | 'dateIs' | 'dateIsNot' | 'dateBefore' | 'dateAfter' | string | undefined
export type AppTableFilter = {
  matchMode: FilterMatchModeValues,
  input: FormKitSchemaNode
}
export type FormKitNodeInput = {
  type: string
  prefixIcon?: string
  outerClass?: string
  props?: any
  name?: string
  placeholder?: string
}
export interface ITableHeader {
  columnProps?: ColumnProps
  filter?: AppTableFilter
  tableRouter?: TableRouter
  editInput?: FormKitNodeInput
  isGlobalFilter?: boolean
  renderHtml?: (value: any) => VNode
}

export type AppFormSection = {
  inputs: FormKitSchemaNode[]
  isTitleHidden?: boolean
  isTransparent?: boolean
}
export interface DataListProps<TResp, TRecord> {
  context: {
    title: string
    dataKey: keyof TRecord
    exportable?: boolean
    initiallySelectedItems?: any[],
    fetchFn?: tableFetchFn<TResp, TRecord>
    records: TRecord[]
    deletedRecords?: TRecord[]
    viewRouter?: TableRouter
    options: ApiListOptions
    displayType?: 'card' | 'table'
    formSections?: Record<string, (AppFormSection | FormKitSchemaNode[])>
    headers: Record<string, ITableHeader>
  }

}
