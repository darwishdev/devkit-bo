<script setup lang="ts">
import { h, resolveComponent } from 'vue';
import { type FormKitSchemaNode, type FormKitNode } from '@formkit/core'
import type { AppFormProps, AppFormSection } from './types';
import { useI18n } from 'vue-i18n';
const formkitSchemaComp = resolveComponent('FormKitSchema')
const formkitComp = resolveComponent('FormKit')
const { t } = useI18n()
const props = defineProps<AppFormProps<any, any>>()
const isAppFormSection = (input: any): input is AppFormSection => {
  return (
    typeof input === 'object' &&
    Array.isArray(input.inputs) && !Array.isArray(input)
  );
}
const loadElemetnsPromise = () => {
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
const renderAppForm = () => {
  return h(formkitComp, {
    type: "form",
    onsubmit: () => {
      console.log("submitted")
    }

  }, [
    h(formkitSchemaComp, {
      schema: {
        $el: "div",
        attrs: {
          class: "schema-wrapper",
        },
        children: loadElemetnsPromise()
      }
    })
  ])
}
</script>
<template>
  <component :is="renderAppForm()" />
</template>
