import type { FormKitSchemaNode } from '@formkit/core'
import type { VNode } from "vue"
import type { ColumnProps } from 'primevue/column'
import type { CallOptions } from '@connectrpc/connect'

type CreateHandler = {
  title: string
  redirectRoute: string
  routeName: string
  endpoint: string
}


export type DataListWrapperProps = {
  records: Array<any>; // Adjust this type based on your data structure
  selection: any; // Adjust type if you have a specific selection type
  onSelectionUpdate: (selection: any) => void; // Callback type
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

export type TableRouter<TRecord> = {
  name: string,
  paramName: string,
  paramColumnName: keyof TRecord
}
export type ApiListOptions = {
  title: string
  description: string
  createHandler?: CreateHandler
  updateHandler?: UpdateHandler
  deleteRestoreHandler?: DeleteRestoreHandler
  importHandler?: ImportHandler
}

export interface ITableHeaderProps<TRecord> {
  sortable: boolean,
  editInput?: FormKitNodeInput
  isGlobalFilter?: boolean
  filter?: AppTableFilter
  router?: TableRouter<TRecord>
}
export type ApiResponseList<TRecord> = {
  records: TRecord[]
  deletedRecords?: TRecord[]
  options?: ApiListOptions
}
export type tableFetchFn<TReq, TRecord> = (req: TReq, options?: CallOptions) => Promise<ApiResponseList<TRecord>>


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
export interface ITableHeader<TRecord> {
  columnProps?: ColumnProps
  filter?: AppTableFilter
  tableRouter?: TableRouter<TRecord>
  editInput?: FormKitNodeInput
  isGlobalFilter?: boolean
  renderHtml?: (value: TRecord) => VNode
}

export type AppFormSection = {
  inputs: FormKitSchemaNode[]
  isTitleHidden?: boolean
  isTransparent?: boolean
}
export interface DataListProps<TReq, TRecord> {
  context: {
    title: string
    dataKey: keyof TRecord
    exportable?: boolean
    initiallySelectedItems?: any[],
    fetchFn?: tableFetchFn<TReq, TRecord> | string
    records: TRecord[]
    deletedRecords?: TRecord[]
    viewRouter?: TableRouter<TRecord>
    options: ApiListOptions
    displayType?: 'card' | 'table'
    formSections?: Record<string, (AppFormSection | FormKitSchemaNode[])>
    headers: Record<string, ITableHeader<TRecord>>
  }

}
