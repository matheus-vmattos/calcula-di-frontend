import { Pressable, Text, View } from 'react-native';

interface SegmentedControlProps {
  /** Opções a exibir. */
  options: readonly string[];
  /** Índice da opção selecionada. */
  selectedIndex: number;
  /** Callback ao selecionar (recebe o índice). */
  onSelect: (index: number) => void;
}

/**
 * Controle segmentado (estilo iOS): linha de botões onde só um fica ativo.
 * Usado pro toggle Dias/Meses/Anos e presets de % CDI.
 */
export function SegmentedControl({
  options,
  selectedIndex,
  onSelect,
}: SegmentedControlProps) {
  return (
    <View className="flex-row" style={{ gap: 6 }}>
      {options.map((opt, idx) => {
        const ativo = idx === selectedIndex;
        return (
          <Pressable
            key={opt}
            onPress={() => onSelect(idx)}
            className={`flex-1 py-2 rounded-md items-center border ${
              ativo
                ? 'bg-primary border-primary'
                : 'bg-surface border-border'
            }`}
          >
            <Text
              className={`text-xs ${
                ativo ? 'text-primary-inverse font-medium' : 'text-text-secondary'
              }`}
            >
              {opt}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}