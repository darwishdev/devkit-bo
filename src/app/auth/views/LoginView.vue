<script setup lang="ts">
import { apiClient } from '@/pkg/api/ApiClient';
import AppForm from '@/pkg/forms/AppForm.vue';
import type { AppFormProps } from '@/pkg/forms/types';
import { FormKitSchema } from '@formkit/vue'
import { useToast } from 'primevue';
import { onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
const { push } = useRouter()
const toast = useToast()
onBeforeMount(() => {
  const token = localStorage.getItem("token")
  if (token) {
    apiClient.authAuthorize({}).then((_) => {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Please logout first before try to login again', life: 3000 });
      push({ name: "home_view" })
    })
  }
})

const formProps: AppFormProps<any, any> = {
  context: {
    title: 'login',
    options: {
      isBulkCreateHidden: true,
      isFormTransparent: false,
      isSuccessNotificationHidden: false,
      successMessageSummary: 'logged_in',
      successMessageDetail: 'logged_in_details',
      isHeaderSubmitHidden: true
    },
    submitHandler: {
      endpoint: apiClient.authLogin
      //endpoint: loginHandler.loginEndpoint,
      //callback: handleLoginCallback,
      //redirectRoute: loginHandler.redirectRoute || "home_view"
    },
    sections: {
      'login': {
        isTitleHidden: true,
        isTransparent: true,
        inputs: [
          {
            $formkit: 'text',
            prefixIcon: "email",
            outerClass: "col-12",
            validation: "required:email",
            name: "email",
            placeholder: "email",
            label: "email"
          },
          {
            $formkit: 'password',
            prefixIcon: "password",
            if: "$isResetPassword == false",
            outerClass: "col-12",
            validation: "required",
            name: "password",
            placeholder: "password",
            label: "password"
          },

        ]
      }
    }

  }
}
</script>
<template>
  <div class="login-view">
    <div class="login-img"></div>
    <div class="login-content">
      <h2>login</h2>
      <div class="login-form">
        <AppForm :context="formProps.context" />
      </div>
    </div>
  </div>
</template>
<style>
.login-view {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
