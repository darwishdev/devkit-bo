<script setup lang="ts">
import { Breadcrumb } from 'primevue';
import type { MenuItem } from 'primevue/menuitem'
import { computed, ref } from 'vue';

import { translationList, type SUPPORTE_LOCALES_TYPE } from '../plugins/i18n.config';
import { useRoute, useRouter } from 'vue-router';
import Menu from 'primevue/menu';
import { useI18n } from 'vue-i18n';
import AppBtn from './AppBtn.vue';
import { apiClient } from '../api/ApiClient';

const menu = ref();
const items = ref([
  {
    label: 'Options',
    items: [
      {
        label: 'profile',
        icon: 'pi pi-refresh',
        command: () => {
          router.push("/profile")
        }
      },
      {
        label: 'Logout',
        icon: 'pi pi-upload',
        command: () => {
          localStorage.removeItem('user')
          localStorage.removeItem('token')
          localStorage.removeItem('sidebar')
          localStorage.removeItem('roles')
          router.push("/login")
        }
      }
    ]
  }
]);

const toggle = (event: Event) => {
  menu.value.toggle(event);
};
const route = useRoute()
const i18n = useI18n()
const router = useRouter()
const breadcrumbHome = {
  icon: 'house',
  to: { name: "home_view" },
}
const toggleTheme = () => {
  document.documentElement.classList.toggle('my-app-dark');
  console.log("toggling theme")
}
const toggleLanguage = () => {
  const currentLocale = i18n.locale.value as SUPPORTE_LOCALES_TYPE
  const newLocale = currentLocale == 'ar' ? 'en' : 'ar'
  const newLocalMessagesLength = Object.keys(i18n.getLocaleMessage(newLocale)).length

  if (newLocalMessagesLength > 0) {
    i18n.locale.value = newLocale
    return
  }
  translationList(newLocale).then(response => {
    i18n.setLocaleMessage(newLocale, response)
    i18n.locale.value = newLocale
  })
}
const breadcrumbs = computed<MenuItem[]>(() => {

  if (!route) return []
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
      <AppBtn @click="toggleLanguage" icon="globe" />
      <AppBtn @click="toggleTheme" icon="moon" />
      <AppBtn icon="single_user" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" />
      <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
    </div>
  </header>
</template>
