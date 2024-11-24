<script setup lang="ts">
import { apiClient } from '@/pkg/api/ApiClient';
import { type AuthLoginResponse } from '@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/accounts_auth_pb';
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
const sc = [
  {
    $formkit: 'text',
    name: 'email',
    label: 'Email',
    help: 'This will be used for your account.',
    validation: 'required|email',
  },
  {
    $formkit: 'password',
    name: 'password',
    label: 'Password',
    help: 'Enter your new password.',
    validation: 'required|length:5,16',
  }
]
const submitHandler = (req: any) => {
  apiClient.authLogin({ loginCode: req.email, userPassword: req.password }).then((resp: AuthLoginResponse) => {
    if (resp.loginInfo) {
      localStorage.setItem("token", resp.loginInfo.accessToken)
      localStorage.setItem("user", JSON.stringify(resp.user))
      localStorage.setItem("navigation_bar", JSON.stringify(resp.navigationBar))
      push("/dashboard")
    }
  }).catch(() => {

  })
}
</script>
<template>
  <div class="login-view">
    <div class="login-img"></div>
    <div class="login-content">
      <h2>login</h2>
      <div class="login-form">
        <FormKit type="form" @submit="submitHandler">
          <FormKitSchema :schema="sc" />
        </FormKit>
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
