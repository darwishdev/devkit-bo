<script lang="ts" setup>
import AppHeader from './AppHeader.vue';
import { db } from '../db/Db';
import { apiClient } from '../api/ApiClient';
import type { IconListResponse } from '@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/public_icon_pb';
import type { AuthAuthorizeResponse } from '@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/accounts_auth_pb';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue';
import { useI18n } from 'vue-i18n';
import { translationList, type SUPPORTE_LOCALES_TYPE } from '../plugins/i18n.config';
import AppBtn from './AppBtn.vue';
import { useUiStore } from '../stores/ui_store';
import AppNavigation from './AppNavigation.vue';
const i18n = useI18n()
const { push } = useRouter()
const toast = useToast()
const uiStore = useUiStore()
const authorize = () => {
  return new Promise<void>((resolve) => {
    apiClient.authAuthorize({}).then((response: AuthAuthorizeResponse) => {
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user))
      }
      resolve()
    }).catch(() => {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Please login to be able to view this page', life: 3000 });
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('sidebar')
      localStorage.removeItem('roles')
      push('/login')
    })
  })
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

const loadLocale = () => {
  return new Promise<void>((resolve) => {
    const locale = i18n.locale.value as SUPPORTE_LOCALES_TYPE
    console.log("localse s", locale)
    translationList(locale).then(response => {
      i18n.setLocaleMessage(locale, response)
      resolve()
    }).catch(() => resolve())
  })
}
const loadIcons = () => {
  return new Promise<void>((resolve) => {
    db.icon.count().then(count => {
      count == 0 ? apiClient.iconList({}).then((response: IconListResponse) => {
        db.icon.clear()
        db.icon.bulkAdd(response.icons)
        resolve()
      }).catch((err: Error) => {
        console.log('cannot load icons', err)
      }) : resolve()
    })
  })
}

await loadLocale()
await authorize()
await loadIcons()
uiStore.init()

</script>
<template>
  <Suspense>
    <template #default>
      <div :class="uiStore.sidebarStateValues.className">
        <aside class="sidebar">
          <div class="sidebar__header">
            <strong class='logo'>APP LOGO</strong>
            <AppBtn @click="uiStore.toggleSidebar" :key="uiStore.sidebarStateValues.iconName"
              :icon="uiStore.sidebarStateValues.iconName" />
          </div>
          <AppNavigation />
        </aside>
        <AppHeader />
        <div class="page-content">
          <RouterView />
        </div>
      </div>
    </template>
    <template #fallback>
      <div>Loading from layoututttsss...</div>
    </template>
  </Suspense>
</template>
