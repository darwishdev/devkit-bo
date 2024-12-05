<script lang="ts" setup>
import DynamicDialog from 'primevue/dynamicdialog';
import Toast from 'primevue/toast';
</script>
<template>
  <Suspense>
    <template #default>
      <RouterView />
    </template>
    <template #fallback>
      <div>Loading from app..</div>
    </template>
  </Suspense>
  <DynamicDialog :modal='true' />
  <Toast />
</template>
