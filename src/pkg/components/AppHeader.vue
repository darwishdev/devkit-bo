<script setup lang="ts">
import { Breadcrumb } from 'primevue';
import type { MenuItem } from 'primevue/menuitem'
import { computed } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
const route = useRoute()
const router = useRouter()
const breadcrumbHome = {
  icon: 'house',
  to: { name: "home_view" },
}
const breadcrumbs = computed<MenuItem[]>(() => {
  if (!route.meta) return []
  if (!route.meta.breadcrumbs) return []

  const breacrumbs = route.meta.breadcrumbs as MenuItem[]

  return breacrumbs
});
</script>
<template>
  <header>

    <div class="header-start">
      <Breadcrumb :home="breadcrumbHome" :model="breadcrumbs" v-if="breadcrumbs.length > 0">
        <template #item="{ item, props }">
          <a href="#" v-if="item.to" v-bind="props.action" @click.prevent="router.push(item.to)">
            <i :class="`pi pi-${item.icon}`" color="mr-3" v-if="item.icon" :icon="item.icon" />
            <span class="text-color ">{{ item.label }}</span>
          </a>
          <div v-else class="cursor-text" :href="item.to" :target="item.target" v-bind="props.action">
            <AppIcon color="text-primary mr-3" v-if="item.icon" :icon="item.icon" />
            <span class="text-primary">{{ item.label }}</span>
          </div>
        </template>
      </Breadcrumb>

    </div>
    <div class="header-end">
      icons goes here
    </div>
  </header>
</template>
