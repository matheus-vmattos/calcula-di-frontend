import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import type { ReactNode } from 'react';

interface ScreenProps {
  children: ReactNode;
  /**
   * Se true, remove o padding horizontal (usado quando o filho
   * controla sua própria margem, ex: tela com cards de borda a borda).
   */
  noPadding?: boolean;
}

/**
 * Wrapper padrão de tela do CalculaDI.
 *
 * Cuida de:
 *   - SafeArea (notch, status bar)
 *   - Background branco consistente
 *   - Padding horizontal padrão
 *
 * Estrutura: SafeAreaView externo (apenas pra SafeArea) + View interna
 * que recebe as classes Tailwind. Isso evita o problema do NativeWind
 * não processar className em SafeAreaView (componente externo).
 */
export function Screen({ children, noPadding = false }: ScreenProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top', 'left', 'right']}>
      <View className={`flex-1 bg-background ${noPadding ? '' : 'px-5'}`}>
        {children}
      </View>
    </SafeAreaView>
  );
}