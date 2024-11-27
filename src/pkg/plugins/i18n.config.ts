import { db } from '../db/Db'
import { apiClient } from '../api/ApiClient'
import type { TranslationFindLocaleResponse } from '@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/public_translation_pb'
export type SUPPORTE_LOCALES_TYPE = 'en' | 'ar'
export const SUPPORT_LOCALES: SUPPORTE_LOCALES_TYPE[] = ['en', 'ar']
const translationListApi = (locale: SUPPORTE_LOCALES_TYPE) => {
  return new Promise<Record<string, any>>((resolve) => {
    apiClient.translationFindLocale({ locale }).then((response: TranslationFindLocaleResponse) => {
      db.translation.add({ localeKey: locale, translations: response.translations })
      resolve(response.translations)
    }).catch((err: Error) => {
      resolve({})
      console.log('cannot load translations for locale: ', locale, "ERR: ", err)
    })
  })

}
export const translationList = (locale: SUPPORTE_LOCALES_TYPE) => {
  return new Promise<Record<string, any>>((resolve) => {
    db.translation.get(locale).then(cachedLocale => {
      if (cachedLocale) {
        if (Object.keys(cachedLocale.translations).length) {
          resolve(cachedLocale.translations)
          return
        }
      }
      translationListApi(locale).then(response => resolve(response))
    })
  })
}

