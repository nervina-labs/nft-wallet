import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zh from './zh.json'
import en from './en.json'
import { LocalCache } from '../cache'

const browserLanguage = navigator.language.startsWith('zh') ? 'zh' : 'en'

// eslint-disable-next-line @typescript-eslint/no-floating-promises
i18n.use(initReactI18next).init({
  resources: {
    zh,
    en,
  },
  lng: LocalCache.getI18nLng() ?? browserLanguage,
  fallbackLng: 'zh',
  interpolation: {
    escapeValue: false,
  },
  cache: localStorage,
})

export default i18n
