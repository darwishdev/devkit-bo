<script setup lang="ts">
import { apiClient } from "@/pkg/api/ApiClient"
import { useQuery } from '@tanstack/vue-query'
import { useDialog } from 'primevue/usedialog';
import { useToast } from 'primevue/usetoast';
import AppBtn from "@/pkg/components/AppBtn.vue";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
const toast = useToast();
const dialog = useDialog();
const showProducts = () => {
  console.log("showing toast")
  console.log(toast)
  toast.add({ severity: 'info', summary: 'Info', detail: 'Message Content', life: 3000 });
}
const i18n = useI18n()
onMounted(() => {
  console.log(i18n.messages.value, "mounttt")
})

console.log('TanStack Query is ready:',)
const { data, suspense } = useQuery({
  queryKey: ['icon'],
  suspense: true,
  queryFn: async () => apiClient.iconList({}),
})
await suspense()
</script>
<template>
  <AppBtn label="show toast" @click="showProducts" />
</template>
