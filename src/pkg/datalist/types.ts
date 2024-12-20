import type { FormKitSchemaNode } from '@formkit/core'
import type { VNode } from "vue"
import type { ColumnProps } from 'primevue/column'
import type { CallOptions } from '@connectrpc/connect'
import type { Store } from 'pinia'

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

type DeleteHandler = {
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
  deleteRestoreHandler?: DeleteHandler
  deleteHandler?: DeleteHandler
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
export type ColumnActionsProps<TRecord> = {
  datalistKey: string
  data: TRecord
  isDropdownMenu?: boolean
}
export type DataListHeaderProps = {
  datalistKey: string
  exportable?: boolean
}
export type DataListFiltersProps = {
  datalistKey: string
  isPresistFilters?: boolean
  useLazyFilters?: boolean
  isServerSidePagination?: boolean
}

export type DataListFiltersSlots = {
  filtersForm(store: Store): VNode
  filtersFormAppend(store: Store): VNode
  filtersFormPrepend(store: Store): VNode
  header(store: Store): VNode
}
export type DataListHeaderSlots = {
  headerActionsStartPrepend(store: Store): VNode
  headerActionsStartAppend(store: Store): VNode
  headerActionsEndPrepend(store: Store): VNode
  headerActionsEndAppend(store: Store): VNode
}

export type ColumnActionsSlots<TRecord> = {
  prependActions?: (props: { data: TRecord }) => VNode,
  dropdownActions(props: { data: TRecord }): VNode
  actions?: (props: { data: TRecord }) => VNode
  appendActions?: (props: { data: TRecord }) => VNode
}
export interface DataListProps<TReq, TRecord> {
  context: {
    key: string
    title: string
    dataKey: keyof TRecord
    exportable?: boolean
    initiallySelectedItems?: any[]
    debounceInMilliSeconds?: number
    fetchFn?: tableFetchFn<TReq, TRecord> | string
    records: TRecord[]
    useColumnFilters?: boolean
    useLazyFilters?: boolean
    isServerSidePagination?: boolean
    isActionsDropdown?: boolean
    isPresistFilters?: boolean
    deletedRecords?: TRecord[]
    viewRouter?: TableRouter<TRecord>
    options: ApiListOptions
    displayType?: 'card' | 'table'
    formSections?: Record<string, (AppFormSection | FormKitSchemaNode[])>
    headers: Record<string, ITableHeader<TRecord>>
  }
}
export type DataListSlots<TRecord> = {
  default(): VNode
  start(props: { data: TRecord }): VNode
  end(props: { data: TRecord }): VNode
  expansion(props: { data: TRecord }): VNode
  headerActionsStartPrepend(store: Store): VNode
  headerActionsStartAppend(store: Store): VNode
  headerActionsEndPrepend(store: Store): VNode
  headerActionsEndAppend(store: Store): VNode
  filtersPanel(store: Store): VNode
  filtersForm(store: Store): VNode
  filtersFormAppend(store: Store): VNode
  filtersFormPrepend(store: Store): VNode
  header(store: Store): VNode
  dropdownActions(props: { data: TRecord }): VNode
  actions(props: { data: TRecord }): VNode
  prependActions(props: { data: TRecord }): VNode
  appendActions(props: { data: TRecord }): VNode
} & {
  [K in keyof TRecord as K extends string ? `column.${K}` : never]: (props: { data: TRecord }) => VNode;
};
export type DataListEmits<TRecord> = {
  (e: 'update:selection', value: TRecord[]): void
}
