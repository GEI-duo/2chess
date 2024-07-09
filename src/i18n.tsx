import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import HttpBackend, { HttpBackendOptions } from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import dayjs from 'dayjs';

export const availableLanguages = [
  {
    code: 'en',
    name: 'English',
  },
  {
    code: 'es',
    name: 'Español',
  },
];

export const getLanguageName = (code: string) => {
  const language = availableLanguages.find(lang => lang.code === code);
  return language ? language.name : '';
};

i18n
  // Load translations using http (https://github.com/i18next/i18next-http-backend)
  .use(HttpBackend)
  // Detect user language (https://github.com/i18next/i18next-browser-languageDetector)
  .use(LanguageDetector)
  // Init i18n for react (https://react.i18next.com/)
  .use(initReactI18next)
  // Configure i18n (https://www.i18next.com/overview/configuration-options=
  .init<HttpBackendOptions>({
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    fallbackLng: {
      'en-US': ['en'],
      'es-ES': ['es'],
      default: ['en'],
    },
    keySeparator: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    detection: {
      convertDetectedLanguage: lng => {
        const lngCode = lng.split(/[-]/)[0];
        if (!availableLanguages.some(lang => lang.code === lngCode)) {
          return 'en';
        }
        return lngCode;
      },
    },
  })
  .then(() => {
    dayjs.locale(i18n.language);
  });

export default i18n;
