import { Text, TextInput, View } from 'react-native';

interface CampoNumeroProps {
  /** Rótulo acima do campo. */
  label: string;
  /** Valor atual (string pra permitir digitação livre). */
  value: string;
  /** Callback de mudança. */
  onChangeText: (text: string) => void;
  /** Prefixo fixo (ex: "R$"). */
  prefixo?: string;
  /** Texto de placeholder. */
  placeholder?: string;
  /** Legenda auxiliar abaixo do campo (ex: "720 dias corridos"). */
  legenda?: string;
}

/**
 * Campo de entrada numérica padrão do CalculaDI.
 * Teclado numérico, visual coerente com a paleta prata.
 */
export function CampoNumero({
  label,
  value,
  onChangeText,
  prefixo,
  placeholder,
  legenda,
}: CampoNumeroProps) {
  return (
    <View>
      <Text className="mb-1.5 text-xs font-medium text-text-secondary">{label}</Text>
      <View className="bg-surface rounded-md px-3.5 py-3 flex-row items-baseline border border-border">
        {prefixo ? (
          <Text className="text-sm text-text-tertiary mr-1.5">{prefixo}</Text>
        ) : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A1A1A6"
          keyboardType="numeric"
          className="flex-1 text-xl font-medium text-text-primary"
          style={{ padding: 0 }}
        />
      </View>
      {legenda ? (
        <Text className="mt-1 text-xs text-text-tertiary">{legenda}</Text>
      ) : null}
    </View>
  );
}