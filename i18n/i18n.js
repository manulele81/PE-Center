import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import fr from './locales/fr.json'
import de from './locales/de.json'
import pt from './locales/pt.json'
import es from './locales/es.json'

const resources = {
  en,
  fr,
  de,
  pt,
  es
}

export default lang =>
  i18n.use(initReactI18next).init({
    resources,
    lng: lang,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    react: {
      bindI18n: false
    },
    order: [],
    caches: [],
    htmlTag: document.documentElement
  })
