<script lang="ts" setup>
import AppNavigation from './AppNavigation.vue';
import AppHeader from './AppHeader.vue';
import { db } from '../db/Db';
import { apiClient } from '../api/ApiClient';
import type { IconListResponse } from '@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/public_icon_pb';
import type { AuthAuthorizeResponse } from '@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/accounts_auth_pb';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue';
const { push } = useRouter()
const toast = useToast()
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
const loadIcons = () => {
  return new Promise<void>((resolve) => {
    db.icons.count().then(count => {
      count == 0 ? apiClient.iconList({}).then((response: IconListResponse) => {
        db.icons.clear()
        db.icons.bulkAdd(response.icons)
        resolve()
      }).catch((err: Error) => {
        console.log('cannot load icons', err)
      }) : resolve()
    })
  })
}
await authorize()
await loadIcons()
</script>
<template>
  <Suspense>
    <template #default>
      <div>
        <h2>app layout goes here</h2>
        <AppHeader />
        <AppNavigation />
        <RouterView />
      </div>
    </template>
    <template #fallback>
      <div>Loading from layoututttsss...</div>
    </template>
  </Suspense>
</template>
