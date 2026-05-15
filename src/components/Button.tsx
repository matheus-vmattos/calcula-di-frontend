import { Pressable, Text, View } from 'react-native';
import type { ReactNode } from 'react';

interface ButtonProps {
  /** Texto do botão. */
  label: string;
  /** Função chamada ao tocar. */
  onPress: () => void;
  /** 'primary' = preto sólido, 'secondary' = transparente com borda */
  variant?: 'primary' | 'secondary';
  /** Conteúdo opcional à esquerda do label (ícone, emoji, etc) */
  leadingSlot?: ReactNode;
  /** Se true, ocupa toda a largura disponível. */
  fullWidth?: boolean;
  /** Desabilita o toque e reduz a opacidade. */
  disabled?: boolean;
}

/**
 * Botão padrão do CalculaDI no estilo Apple-clean.
 *
 * - Pressable nativo (feedback de toque automático)
 * - Variantes mantêm consistência visual em todo o app
 * - Selecionado/disabled via prop, sem mexer em estilo manualmente
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  leadingSlot,
  fullWidth = false,
  disabled = false,
}: ButtonProps) {
  const base = 'py-3.5 px-5 rounded-md flex-row items-center justify-center';
  const widthClass = fullWidth ? 'w-full' : '';
  const variantBg =
    variant === 'primary'
      ? 'bg-primary'
      : 'bg-transparent border border-border';
  const labelColor =
    variant === 'primary' ? 'text-primary-inverse' : 'text-text-primary';
  const opacity = disabled ? 'opacity-40' : '';

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      className={`${base} ${variantBg} ${widthClass} ${opacity}`}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      {leadingSlot ? <View className="mr-2">{leadingSlot}</View> : null}
      <Text className={`${labelColor} text-base font-medium`}>{label}</Text>
    </Pressable>
  );
}