import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from './translations';

// Tili localStorage-dan olishga harakat qilamiz, yoki default 'uz'
const savedLanguage = localStorage.getItem('bmi_lang') || 'uz';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      uz: { translation: translations.uz },
      en: { translation: translations.en },
      ru: { translation: translations.ru },
    },
    lng: savedLanguage,
    fallbackLng: 'uz',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
