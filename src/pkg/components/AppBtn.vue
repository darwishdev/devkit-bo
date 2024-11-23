<script setup lang="ts">
import { h } from 'vue';
import { Button, type ButtonProps } from 'primevue';
import AppIcon from './AppIcon.vue';
const props = defineProps<{ ctx: ButtonProps }>()
const renderIcon = () => {
  return h(
    Button, props.ctx,
    {
      icon: () =>
        props.ctx.icon ? h(AppIcon, {
          icon: props.ctx.icon,
          size: props.ctx.size,
        }) : undefined,
    }
  );
}
</script>
<template>
  <component :is="renderIcon" />
</template>
