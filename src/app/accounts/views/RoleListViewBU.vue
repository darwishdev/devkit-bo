<script setup lang="ts">
import { apiClient } from "@/pkg/api/ApiClient"
import { useQuery } from '@tanstack/vue-query'
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { InputIcon, InputText } from "primevue";
import AppBtn from "@/pkg/components/AppBtn.vue";
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  roleName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
  roleDescription: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
});
const i18n = useI18n()
onMounted(() => {
  console.log(i18n.messages.value, "mounttt")
})

console.log('TanStack Query is ready:',)
const { data, suspense } = useQuery({
  queryKey: ['roleList'],
  suspense: true,
  queryFn: async () => apiClient.roleList({}),
})
await suspense()

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    roleName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    roleDescription: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
  };
};
const clearFilter = () => {
  initFilters();
};
const selectItems = ref([])
</script>
<template>
  <h2>{{ $t('role') }}</h2>
  <DataTable v-if="data" v-model:filters="filters" v-model:selection="selectItems" :value="data.records" paginator
    :rows="10" dataKey="roleId" filterDisplay="menu" :globalFilterFields="['roleName', 'roleDescription']">
    <template #header>
      <div class="flex justify-between">
        <AppBtn icon="filter-slash" iconType="primevue" label="Clear" outlined @click="clearFilter()" />
        <IconField>
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
        </IconField>
      </div>
    </template>
    <template #empty> No customers found. </template>
    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
    <Column field="roleName" header="roleName" sortable style="min-width: 14rem">
      <template #body="{ data }">
        {{ data.roleName }}
      </template>
      <template #filter="{ filterModel }">
        <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
      </template>
    </Column>
    <Column field="roleDescription" header="roleDescription" sortable style="min-width: 14rem">
      <template #body="{ data }">
        {{ data.roleDescription }}
      </template>
      <template #filter="{ filterModel }">
        <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
      </template>
    </Column>
  </DataTable>
</template>
