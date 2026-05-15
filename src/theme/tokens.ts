/**
 * Design tokens do CalculaDI.
 *
 * Centraliza cores, espaçamentos e tipografia em um único lugar.
 * Todas as telas e componentes consomem daqui — assim, mudar a paleta
 * inteira é alterar este arquivo (e nada mais).
 *
 * Inspiração: Apple Human Interface Guidelines (HIG) e iOS Wallet/Stocks.
 */

export const colors = {
  // Backgrounds
  background: '#FFFFFF',
  surface: '#F5F5F7',
  surfaceElevated: '#FAFAFA',

  // Acentos (uso muito controlado)
  primary: '#000000',      // CTA principal, ícones ativos
  primaryInverse: '#FFFFFF', // texto sobre primary

  // Textos
  textPrimary: '#1D1D1F',
  textSecondary: '#86868B',
  textTertiary: '#AEAEB2',

  // Estrutura
  border: '#D2D2D7',
  divider: '#E5E5EA',

  // Semânticos (uso raro, só pra estados de sistema)
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 48,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 34,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
} as const;

// Type helpers — pra TypeScript autocompletar bonito nas chamadas
export type ColorToken = keyof typeof colors;
export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radius;
export type FontSizeToken = keyof typeof fontSize;