import './assets/main.css'
import config from './pkg/plugins/formkit/formkit.config'
import { plugin, defaultConfig } from '@formkit/vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import queryClient from './pkg/plugins/tanstack/config'
import { VueQueryPlugin } from '@tanstack/vue-query'
import PrimeVue from 'primevue/config';

import App from './App.vue'
import router from './pkg/router/router'
import Aura from '@primevue/themes/aura';
const app = createApp(App)
app.use(createPinia())
  .use(router)
  .use(plugin, defaultConfig(config))
  .use(PrimeVue, {
    theme: {
      preset: Aura
    }
  }).use(VueQueryPlugin, {
    queryClient
  })

app.mount('#app')
