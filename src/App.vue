<script lang="ts" setup>
import DynamicDialog from 'primevue/dynamicdialog';
import Toast from 'primevue/toast';
import AppLayoutLoading from './pkg/components/Loading/AppLayoutLoading.vue';
import { useUiStore } from './pkg/stores/ui_store';
const uiStore = useUiStore()
uiStore.init()
</script>
<template>
  <Suspense>
    <template #default>
      <RouterView />
    </template>
    <template #fallback>
      <div class="w-full h-screen">
        <AppLayoutLoading></AppLayoutLoading>
      </div>
    </template>
  </Suspense>
  <DynamicDialog />
  <Toast />
</template>
