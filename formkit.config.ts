import { ar, en } from '@formkit/i18n'
import { rootClasses } from './formkit.theme'
import { defaultConfig } from '@formkit/vue'

export default defaultConfig({
  locales: { en, ar },
  locale: 'en',
  config : {
    rootClasses
  }
})

