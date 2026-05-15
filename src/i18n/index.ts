import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import { ptBR } from './locales/pt-BR';
import { enUS } from './locales/en-US';

/**
 * Configuração do i18next.
 *
 * - Detecta automaticamente o idioma do dispositivo na primeira execução.
 * - Cai pra 'pt-BR' se o idioma não for suportado.
 * - Estrutura aninhada por namespace (common, indices, calculator, about).
 */

const SUPPORTED_LANGUAGES = ['pt-BR', 'en-US'] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

function detectInitialLanguage(): SupportedLanguage {
  const locales = Localization.getLocales();
  const primary = locales[0]?.languageTag ?? 'pt-BR';

  if (SUPPORTED_LANGUAGES.includes(primary as SupportedLanguage)) {
    return primary as SupportedLanguage;
  }

  const lang = primary.split('-')[0];
  if (lang === 'pt') return 'pt-BR';
  if (lang === 'en') return 'en-US';

  return 'pt-BR';
}

i18n.use(initReactI18next).init({
  resources: {
    'pt-BR': { translation: ptBR },
    'en-US': { translation: enUS },
  },
  lng: detectInitialLanguage(),
  fallbackLng: 'pt-BR',
  interpolation: {
    escapeValue: false,
  },
  defaultNS: 'translation',
});

export default i18n;