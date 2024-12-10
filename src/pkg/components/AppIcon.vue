<script setup lang="ts">
import Skeleton from 'primevue/skeleton';
import { h, type VNode } from 'vue';
import { db } from '../db/Db';
import { useQuery } from '@tanstack/vue-query';
import type { Icon } from '@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/public_icon_pb';
export type AppIconProps = {
  icon: string
  size?: 'small' | 'medium' | 'large'
  iconType?: 'primevue' | 'svg'
  color?: string
}
export type AppIconSlots = {
  top(): VNode;
}
const props = withDefaults(defineProps<AppIconProps>(), {
  icon: "default",
  size: "small",
  iconType: "svg",
  color: "var(--p-primary-contrast-color)"
});
const slots = defineSlots<AppIconSlots>();
const loadIcon = async (): Promise<string> => {
  return new Promise((resolve) => {
    db.icon.get(props.icon).then((icon?: Icon) => {
      if (!icon) {
        resolve(`default`)
        return
      }
      resolve(icon.iconContent)
    }).catch((_) => {
      resolve('default')
    })
  })
}
const { data, isLoading } = useQuery({
  queryKey: ['icon-find-' + props.icon],
  queryFn: loadIcon
})
const sizes = {
  small: '1.5rem',
  medium: '2.25rem',
  large: '3rem',
}
const modifySvgAttributes = (svgString: string) => {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
  const svgElement = svgDoc.querySelector('svg');
  if (svgElement) {
    svgElement.setAttribute('width', sizes[props.size]);
    svgElement.setAttribute('height', sizes[props.size]);
    if (props.color) {
      svgElement.setAttribute('fill', props.color);
    }
    svgElement.setAttribute('stroke', props.color || 'currentColor');
  }
  return svgElement?.outerHTML || svgString;
};
const renderIcon = () => {
  const componentVariants = {
    'primevue': h('span', {
      key: data.value,
      class: `pi pi-${data.value}`,
      style: {
        fontSize: sizes[props.size],
        key: props.icon,
        color: props.color || 'currentColor'
      }
    }),
    'svg': h('span', {
      class: `app-icon ${props.size}`,
      attrs: props.color,
      key: props.icon,
      innerHTML: modifySvgAttributes(data.value!),
    })
  }
  return isLoading.value ? h(Skeleton, {
    class: "mb-2"
  }) : componentVariants[props.iconType]
}
</script>
<template>
  <component :is="renderIcon" />
</template>
