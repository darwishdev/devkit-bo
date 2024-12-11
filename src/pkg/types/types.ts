// form types
import type { FormKitSchemaNode } from '@formkit/core'
import type { AppFormSection , SubmitHandler , FindHandler } from '@/pkg/forms/types';

export type ApiFormError = {
  globalErrors: string[]
  fieldErrors: Record<string, string>
}
export type AppFormDialogProps = {
  title : string
  sections: Record<string, (AppFormSection | FormKitSchemaNode[])>
  handlers: {
    submitHandler: SubmitHandler<any, any>
    findHandler?: FindHandler<any, any>
  }
}











// table types
