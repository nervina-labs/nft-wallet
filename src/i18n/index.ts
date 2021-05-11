import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zh from './zh.json'
import en from './en.json'

// eslint-disable-next-line @typescript-eslint/no-floating-promises
i18n.use(initReactI18next).init({
  resources: {
    zh,
    en,
  },
  fallbackLng: 'zh',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
