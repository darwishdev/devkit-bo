<script setup lang="ts">
import { h, useAttrs } from 'vue';
import { Image, type ImageProps } from 'primevue';
const props = defineProps<ImageProps>()
const attrs = useAttrs();
const renderImage = () => {
  if (typeof attrs.src != 'string') return
  const baseImage = !attrs.src.includes("https://") ? import.meta.env.VITE_BASE_IMAGE_URL : ''
  return h(
    Image, {
    ...attrs,
    ...props,
    src: `${baseImage}${attrs.src}`,
    key: attrs.src
  }
  );
}
</script>
<template>
  <component :is="renderImage" />
</template>
