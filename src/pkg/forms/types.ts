import type { FormKitSchemaNode } from '@formkit/core'
export type AppFormProps<TReq, TResp> = {
  context: {
    title: string
    options?: AppFormOptions
    submitHandler: SubmitHandler<TReq, TResp>,
    findHandler?: FindHandler<any, TReq>,
    sections: Record<string, (AppFormSection | FormKitSchemaNode[])>
  }
}

export type SubmitHandler<TReq, TResp> = {
  endpoint: (req: TReq) => any
  mapFunction?: (formReq: any) => TReq
  callback?: (formResp: TResp) => any
  redirectRoute?: string
}

export type FindHandler<TReq, TResp> = {
  endpoint: (req: TReq) => any
  mapFunction?: (formReq: any) => TReq
  requestPropertyName?: keyof TReq,
  paramName?: string | 'id',
  callback?: (formResp: TResp) => any
}

export type AppFormSection = {
  inputs: FormKitSchemaNode[]
  isTitleHidden?: boolean
  isTransparent?: boolean
}

export type AppFormOptions = {
  isBulkCreateHidden?: boolean
  isHeaderSubmitHidden?: boolean
  successMessageSummary?: string
  successMessageDetail?: string
  isSuccessNotificationHidden?: boolean
  isFormTransparent?: boolean
}
