import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zh from './zh.json'
import en from './en.json'
import { LocalCache } from '../cache'

// eslint-disable-next-line @typescript-eslint/no-floating-promises
i18n.use(initReactI18next).init({
  resources: {
    zh,
    en,
  },
  lng: LocalCache.getI18nLng(),
  fallbackLng: 'zh',
  interpolation: {
    escapeValue: false,
  },
  cache: localStorage,
})

export default i18n
