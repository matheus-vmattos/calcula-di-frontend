/**
 * Augmenta os tipos do react-i18next pra que o autocomplete saiba
 * todas as chaves disponíveis. Usa pt-BR como "fonte da verdade".
 */

import 'react-i18next';
import type { ptBR } from './locales/pt-BR';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof ptBR;
    };
  }
}