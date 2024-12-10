<script setup lang="ts">
import { h, useAttrs } from 'vue';
import DeferredContent from 'primevue/deferredcontent';
import { Image, type ImageProps } from 'primevue';
const props = defineProps<ImageProps>()
const attrs = useAttrs();
const renderImage = () => {
  if (typeof attrs.src != 'string') return
  const baseImage = !attrs.src.includes("https://") ? import.meta.env.VITE_BASE_IMAGE_URL : ''
  return h(DeferredContent,
    {
      key: attrs.src,
      onLoad: () => console.log("iumage lazy loading")
    },
    {
      default: () => h(
        Image, {
        ...attrs,
        ...props,
        src: `${baseImage}${attrs.src}`,
      }
      )
    });
}
</script>
<template>
  <component :is="renderImage" />
</template>
