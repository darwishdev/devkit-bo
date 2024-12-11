<script setup lang="ts">
import { apiClient } from "@/pkg/api/ApiClient"
import DataList from "@/pkg/datalist/DataList.vue";
import type { TableRouter, ITableHeader, DataListProps, tableFetchFn } from "@/pkg/datalist/types";
import { useI18n } from "vue-i18n";
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import type { AccountsSchemaRole, RoleListRequest } from "@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/accounts_role_pb";
import { TableHeaderLink, TableHeaderText } from "@/pkg/datalist/headers/HeaderBase";
import type { AppFormSection } from "@/pkg/forms/types";
const { t } = useI18n()

// const { records, deletedRecords, options } = await apiClient.roleList({})
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


const formSections: Record<string, AppFormSection> = {
    'role_info': {
        isTitleHidden: true,
        isTransparent: true,
        inputs: [
            {
                $formkit: 'text',
                prefixIcon: "tools",
                outerClass: "col-12 sm:col-6 md:col-5",
                name: "roleName",
                validation: "required",
                placeholder: t("roleName"),
                label: t("roleName")
            },
            {
                $formkit: 'textarea',
                prefixIcon: "text",
                outerClass: "col-12 sm:col-6 md:col-7",
                name: "roleDescription",
                placeholder: t("roleDescription"),
                label: t("roleDescription")
            },
        ]
    }
}

const tableProps: DataListProps<RoleListRequest, AccountsSchemaRole> = {
  context: {
    key: 'role',
    title: "roles",
    dataKey: "roleId",
    records: [{
      $typeName : 'devkit.v1.AccountsSchemaRole',
      createdAt : '11/12/2024',
      deletedAt : '',
      roleId : 1,
      roleName : 'Admin',
      roleDescription : 'Admin Role',
      tenantId : 0 ,
      updatedAt : ''
    }],
    exportable: true,
    useLazyFilters: false,
    isActionsDropdown: true,
    deletedRecords: [],
    // viewRouter: viewRouter,
    //displayType: "card",
    fetchFn: apiClient.roleList,
    formSections: formSections,
    options: {
      title : 'Roles',
      description : 'Roles List',
      createHandler : {
        endpoint : 'roleCreateUpdate',
        redirectRoute : '/accounts/role/create',
        routeName : 'role_create',
        title : 'Create Role',
      },
      updateHandler : {
        endpoint : 'roleCreateUpdate',
        routeName : 'role_update',
        title : 'Update Role',
        findEndpoint : 'roleFindForUpdate',
        findRequestProperty : 'recordId',
        redirectRoute : ''
      },
    }!,
    headers
  }
}
</script>
<template>
  <DataList :context="tableProps.context">
  </DataList>
</template>
