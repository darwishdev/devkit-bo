<script setup lang="ts">
import { h } from 'vue';

import type { HintedString } from '@primevue/core';
import { Button } from 'primevue';
import AppIcon from './AppIcon.vue';
export interface ButtonProps {
  style?: any;
  class?: any;
  label?: string | undefined;
  icon?: string | undefined;
  iconPos?: 'left' | 'right' | 'top' | 'bottom' | undefined;
  iconClass?: string | object | undefined;
  badge?: string | undefined;
  badgeClass?: string | object | undefined;
  badgeSeverity?: HintedString<'secondary' | 'info' | 'success' | 'warn' | 'danger' | 'contrast'> | null | undefined;
  iconType?: 'primevue' | 'svg',
  loading?: boolean | undefined;
  loadingIcon?: string | undefined;
  asChild?: boolean | undefined;
  link?: boolean | undefined;
  severity?: HintedString<'secondary' | 'success' | 'info' | 'warn' | 'help' | 'danger' | 'contrast'> | undefined;
  raised?: boolean | undefined;
  rounded?: boolean | undefined;
  text?: boolean | undefined;
  outlined?: boolean | undefined;
  size?: 'small' | 'large' | undefined;
  variant?: 'outlined' | 'text' | 'link' | undefined;
  plain?: boolean | undefined;
  fluid?: boolean | undefined;
  unstyled?: boolean;
}
const props = defineProps<ButtonProps>()
const renderIcon = () => {
  return h(
    Button, props,
    {
      icon: () =>
        props.icon ? h(AppIcon, {
          icon: props.icon,
          iconType: props.iconType,
          size: props.size,
        }) : undefined,
    }
  );
}
</script>
<template>
  <component :is="renderIcon" />
</template>
