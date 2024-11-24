<script setup lang="ts">
import { h } from 'vue';
import { Button, type ButtonProps } from 'primevue';
import AppIcon from './AppIcon.vue';
const props = defineProps<ButtonProps>()
const renderIcon = () => {
  return h(
    Button, props,
    {
      icon: () =>
        props.icon ? h(AppIcon, {
          icon: props.icon,
          size: props.size,
        }) : undefined,
    }
  );
}
</script>
<template>
  <component :is="renderIcon" />
</template>
