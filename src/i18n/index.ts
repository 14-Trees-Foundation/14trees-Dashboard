import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import language resources
import enTranslations from './locales/en.json';
import hiTranslations from './locales/hi.json';
import mrTranslations from './locales/mr.json';

// Language resources
const resources = {
  en: {
    translation: enTranslations
  },
  hi: {
    translation: hiTranslations
  },
  mr: {
    translation: mrTranslations
  }
};

// Get saved language from localStorage or default to English
const getInitialLanguage = (): string => {
  const savedLanguage = localStorage.getItem('14trees-language');
  if (savedLanguage && ['en', 'hi', 'mr'].includes(savedLanguage)) {
    return savedLanguage;
  }
  
  // Auto-detect from browser language
  const browserLanguage = navigator.language.split('-')[0];
  if (['hi', 'mr'].includes(browserLanguage)) {
    return browserLanguage;
  }
  
  return 'en'; // Default to English
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false, // React already handles XSS protection
    },
    
    // Save language preference
    saveMissing: false,
    
    // Enable debugging in development
    debug: process.env.NODE_ENV === 'development',
  });

// Save language preference when it changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('14trees-language', lng);
  document.documentElement.lang = lng;
});

// Set initial document language
document.documentElement.lang = i18n.language;

export default i18n;