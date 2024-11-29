<script setup lang="ts">
import { h, ref, resolveComponent } from 'vue';
import { type FormKitSchemaNode, type FormKitNode } from '@formkit/core'
import type { AppFormProps, AppFormSection } from './types';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue';
import { useRouter } from 'vue-router';
import type { ApiFormError } from '../types/types';
const formkitSchemaComp = resolveComponent('FormKitSchema')
const formkitComp = resolveComponent('FormKit')
const { t } = useI18n()
const toast = useToast()
const props = defineProps<AppFormProps<any, any>>()
const isAppFormSection = (input: any): input is AppFormSection => {
  return (
    typeof input === 'object' &&
    Array.isArray(input.inputs) && !Array.isArray(input)
  );
}
const generateFormSchema = () => {
  const schema: FormKitSchemaNode[] = []
  const { sections } = props.context
  for (let sectionKey in sections) {
    const currentSection = sections[sectionKey]
    let className = `form-section`
    const isCurrentSectionArray = !isAppFormSection(currentSection)
    const sectionToBePushed: FormKitSchemaNode = {
      $el: 'div',
      attrs: {
        class: isCurrentSectionArray ? className : `${className} ${currentSection.isTransparent ? ' glass' : ''}`
      },
      children: isCurrentSectionArray ? currentSection : currentSection.inputs


    }
    schema.push(sectionToBePushed)
  }
  return schema
}
const isBulkCreateRef = ref(false)
const { push } = useRouter()

const handleError = (node: FormKitNode, error: any) => {
  console.log("error is", error.message)
  try {
    const errorObject: ApiFormError = JSON.parse(error.rawMessage)
    node.setErrors(
      errorObject.globalErrors,
      errorObject.fieldErrors
    )
    console.log(errorObject)
  } catch (_err: any) {
    node.setErrors(
      [error.message],
    )
  }
}

const formSubmitHandler = (req: any, formNode: FormKitNode) => {
  const handler = props.context.submitHandler
  if (handler.mapFunction) {
    req = handler.mapFunction(req)
  }
  return new Promise((resolve) => {
    console.log("reqis ", req)
    handler.endpoint(req).then(async (response: unknown) => {
      formNode.clearErrors()
      formNode.reset()
      if (handler.callback) {
        await handler.callback(response)
      }
      const options = props.context.options
      const defaultSummary = 'api_success_summary'
      const defaultContent = 'api_success_detail'
      if (options) {
        if (!options.isSuccessNotificationHidden) {
          const summary = options.successMessageSummary ?? defaultSummary
          const detail = options.successMessageDetail ?? defaultContent
          toast.add({ severity: 'success', summary, detail, life: 3000 });
        }
      }
      if (!options) {
        toast.add({ severity: 'success', summary: defaultSummary, detail: defaultContent, life: 3000 });
      }
      if (!isBulkCreateRef.value) {
        if (handler.redirectRoute) {
          push({ name: handler.redirectRoute })
        }
      }
      resolve(null)
    }).catch((e: Error) => {
      handleError(formNode, e)
      resolve(null)
    })
  })

}
const renderAppForm = () => {
  return h(formkitComp, {
    type: "form",
    onSubmit: formSubmitHandler
  }, {
    default: () => h(formkitSchemaComp, {
      schema: {
        $el: "div",
        attrs: {
          class: "schema-wrapper",
        },
        children: generateFormSchema()
      }
    })
  })
}
</script>
<template>
  <component :is="renderAppForm()" />
</template>
