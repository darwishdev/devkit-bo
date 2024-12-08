<script setup lang="ts">
import { apiClient } from "@/pkg/api/ApiClient"
import DataList from "@/pkg/datalist/DataList.vue";
import type { TableRouter, ITableHeader, DataListProps, tableFetchFn } from "@/pkg/datalist/types";
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
const headers: Record<string, ITableHeader<AccountsSchemaRole>> = {
  'roleId': new TableHeaderText('roleId', {
    sortable: true,
    isGlobalFilter: true,
    //router: viewRoute
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
        name: "roleDescription",
        placeholder: t("roleDescription")
      }
    }
  }),
}

const tableProps: DataListProps<RoleListRequest, AccountsSchemaRole> = {
  context: {
    key: 'role',
    title: "roles",
    dataKey: "roleId",
    records: records,
    exportable: true,
    useLazyFilters: false,
    isActionsDropdown: true,
    deletedRecords: deletedRecords,
    // viewRouter: viewRouter,
    //displayType: "card",
    fetchFn: apiClient.roleList,
    options: options!,
    headers
  }
}
</script>
<template>
  <DataList :context="tableProps.context">
  </DataList>
</template>
