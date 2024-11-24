<script setup lang="ts">
import { apiClient } from "@/pkg/api/ApiClient"
import { useQuery } from '@tanstack/vue-query'
import { useDialog } from 'primevue/usedialog';
import { useToast } from 'primevue/usetoast';
import AppBtn from "@/pkg/components/AppBtn.vue";
const toast = useToast();
const dialog = useDialog();
const showProducts = () => {
  console.log("showing toast")
  console.log(toast)
  toast.add({ severity: 'info', summary: 'Info', detail: 'Message Content', life: 3000 });
}

console.log('TanStack Query is ready:',)
const { data, suspense } = useQuery({
  queryKey: ['icon'],
  suspense: true,
  queryFn: async () => apiClient.iconList({}),
})
await suspense()
</script>
<template>
  <h2>dasboard</h2>
  <AppBtn label="show toast" @click="showProducts" />
</template>
