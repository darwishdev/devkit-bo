<script setup lang="ts">
import { apiClient } from "@/pkg/api/ApiClient"
import DataList from "@/pkg/datalist/DataList.vue";
import type { TableRouter, ITableHeader, DataListProps } from "@/pkg/datalist/types";
import { useI18n } from "vue-i18n";
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import type { AccountsSchemaRole, RoleListRequest } from "@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/accounts_role_pb";
import { TableHeaderLink, TableHeaderText } from "@/pkg/datalist/headers/HeaderBase";
const { t } = useI18n()

const { records, deletedRecords, options } = await apiClient.roleList({})
const dataKey = "roleId"
const viewRouter: TableRouter = {
  name: "roles_find",
  paramName: "id",
  paramColumnName: dataKey
}
const headers: Record<string, ITableHeader> = {
  'roleId': new TableHeaderText('roleId', {
    sortable: true,
    isGlobalFilter: true,
    //router: viewRouter
  }),

  'roleName': new TableHeaderText('roleName', {
    sortable: true,
    isGlobalFilter: true,
    filter: {
      matchMode: FilterMatchMode.CONTAINS,
      input: {
        $formkit: 'text',
        prefixIcon: "tools",
        outerClass: "col-12 sm:col-6 md:col-3",
        name: "roleName",
        placeholder: t("roleName")
      }
    }
  }),

  'roleDescription': new TableHeaderText('roleDescription', {
    sortable: true,
    isGlobalFilter: true,
    filter: {
      matchMode: FilterMatchMode.CONTAINS,
      input: {
        $formkit: 'text',
        prefixIcon: "tools",
        outerClass: "col-12 sm:col-6 md:col-3",
        name: "roleName",
        placeholder: t("roleName")
      }
    }
  }),
}



const tableProps: DataListProps<RoleListRequest, AccountsSchemaRole> = {
  context: {
    title: "roles",
    dataKey: "roleId",
    records: records,
    exportable: true,
    deletedRecords: deletedRecords,
    // viewRouter: viewRouter,
    displayType: "card",
    fetchFn: apiClient.roleList,
    options: options! as any,
    headers
  }
}
</script>
<template>
  <DataList :context="tableProps.context" />
</template>
