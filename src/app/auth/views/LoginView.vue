<script setup lang="ts">
import { apiClient } from '@/pkg/api/ApiClient';
import AppForm from '@/pkg/forms/AppForm.vue';
import type { AppFormProps } from '@/pkg/forms/types';
import type { AuthLoginResponse } from '@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/accounts_auth_pb';
import { useToast } from 'primevue';
import { onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
const { push } = useRouter()
const toast = useToast()
onBeforeMount(() => {
  const token = localStorage.getItem("token")
  if (token) {
    console.log("user have token")
  }
})
const handleLoginCallback = (response: AuthLoginResponse) => {
  if (!response.loginInfo) {
    throw new Error("login info is missing")
  }
  localStorage.setItem("token", response.loginInfo.accessToken)
  localStorage.setItem("user", JSON.stringify(response.user))
  localStorage.setItem("navigation_bar", JSON.stringify(response.navigationBar))
}
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
      endpoint: apiClient.authLogin,
      callback: handleLoginCallback,
      redirectRoute: "home_view"
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
            name: "loginCode",
            placeholder: "email",
            label: "email"
          },
          {
            $formkit: 'password',
            prefixIcon: "password",
            outerClass: "col-12",
            validation: "required",
            name: "userPassword",
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
