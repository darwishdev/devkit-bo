<script setup lang="ts">
import { apiClient } from "@/pkg/api/ApiClient"
import AppDialog from "@/pkg/components/AppDialog.vue";
import AppImage from "@/pkg/components/AppImage.vue";
import { useQuery } from '@tanstack/vue-query'
import { useDialog } from 'primevue/usedialog';

const dialog = useDialog();
const showProducts = () => {
  dialog.open(AppDialog, {});
}

console.log('TanStack Query is ready:',)
const { data, suspense } = useQuery({
  queryKey: ['todos'],
  suspense: true,
  queryFn: async () => apiClient.translationList({}),
})
await suspense()
</script>
<template>
  <AppImage src="https://primefaces.org/cdn/primevue/images/galleria/galleria10.jpg" />

</template>
