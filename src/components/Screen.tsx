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
 * Estrutura:
 *   - SafeAreaView externo: trata notch/status bar.
 *   - View intermediária com fundo "ambiente" (visível só no desktop wide).
 *   - View interna (max-w-md) que centraliza o conteúdo em um trilho fixo,
 *     dando aparência de app mobile mesmo numa tela larga.
 *
 * Isso garante que o app pareça nativo em qualquer largura: no celular
 * ocupa tudo, no desktop fica num "celular virtual" no centro.
 */
export function Screen({ children, noPadding = false }: ScreenProps) {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#EDEDF0' }}
      edges={['top', 'left', 'right']}
    >
      <View className="flex-1 items-center">
        <View
          className={`flex-1 w-full bg-background ${noPadding ? '' : 'px-5'}`}
          style={{ maxWidth: 440 }}
        >
          {children}
        </View>
      </View>
    </SafeAreaView>
  );
}