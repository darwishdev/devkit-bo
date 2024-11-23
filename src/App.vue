<script lang="ts" setup>
import DynamicDialog from 'primevue/dynamicdialog';

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
  <DynamicDialog />
</template>
