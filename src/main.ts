import 'primeicons/primeicons.css'
import config from '../formkit.config'
import { plugin, defaultConfig } from '@formkit/vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import DialogService from 'primevue/dialogservice';
import queryClient from './pkg/plugins/tanstack.config'
import { VueQueryPlugin } from '@tanstack/vue-query'
import PrimeVue from 'primevue/config';
import App from './App.vue'
import ToastService from 'primevue/toastservice'
import router from './pkg/router/router'
import { createI18n } from 'vue-i18n'
import { apiClient } from './pkg/api/ApiClient';
import "./pkg/styles/style.css";
import "./pkg/styles/base.css";
// import Aura from '@primevue/themes/aura';
const app = createApp(App)
app.provide('apiClient', apiClient)
app.use(createPinia())
  .use(router)
  .use(plugin, defaultConfig(config))
  .use(PrimeVue, {
    theme: 'none'
  })
  .use(DialogService)
  .use(createI18n({
    locale: 'en',
    fallbackLocale: 'en'
  }))
  .use(ToastService)
  .use(VueQueryPlugin, {
    queryClient
  })

app.mount('#app')
