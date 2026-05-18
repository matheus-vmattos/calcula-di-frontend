/**
 * Design tokens do CalculaDI.
 *
 * Paleta prata-futurista: tons neutros frios, sem cor de destaque.
 * Inspirações: Apple Human Interface Guidelines, Tesla touchscreen,
 * Linear app.
 */

export const colors = {
  // Fundos
  background: '#FAFAFB',
  surface: '#F2F2F4',
  surfaceElevated: '#E8E8EB',
  ambient: '#EDEDF0', // visível só no desktop wide (fora do trilho mobile)

  // Acento principal (grafite metálico)
  primary: '#1C1C1E',
  primaryInverse: '#FAFAFA',

  // Textos
  textPrimary: '#1C1C1E',
  textSecondary: '#6E6E73',
  textTertiary: '#A1A1A6',

  // Estrutura
  border: '#D6D6D9',
  divider: '#E8E8EB',

  // Semânticos
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

export type ColorToken = keyof typeof colors;
export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radius;
export type FontSizeToken = keyof typeof fontSize;