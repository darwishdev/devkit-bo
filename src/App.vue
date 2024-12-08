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
      <div class="loading">
        <h2 style="color : red">loadddinggg</h2>
        <div>Loading from app..</div>
      </div>
    </template>
  </Suspense>
  <DynamicDialog :modal='true' />
  <Toast />
</template>
