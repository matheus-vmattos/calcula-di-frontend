import { View } from 'react-native';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  /**
   * Variante visual:
   *  - 'default': fundo cinza claro (surface), texto escuro
   *  - 'highlight': fundo preto (primary), texto branco — pra resultado em destaque
   */
  variant?: 'default' | 'highlight';
  /** Override de classes Tailwind para customizações pontuais. */
  className?: string;
}

/**
 * Card visual padrão do CalculaDI.
 * Variante 'highlight' é usada para destaque (ex: card de resultado de CDB).
 */
export function Card({ children, variant = 'default', className = '' }: CardProps) {
  const bg = variant === 'highlight' ? 'bg-primary' : 'bg-surface';
  return (
    <View className={`${bg} rounded-lg p-4 ${className}`}>
      {children}
    </View>
  );
}