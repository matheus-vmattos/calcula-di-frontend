import { Text, View } from 'react-native';
import { Card } from './Card';
import { formatarPercentual, formatarPercentual4 } from '../domain/format';

interface IndiceCardProps {
  /** Nome curto do índice (label superior). Ex: "IPCA", "SELIC META". */
  nome: string;
  /** Valor principal exibido em destaque. */
  valorPrincipal: number | null | undefined;
  /** Sufixo da linha do valor principal (ex: "Abril/2026", "ao ano"). */
  legendaPrincipal: string;
  /** Rótulo da métrica secundária (ex: "12 meses", "equivalente diária"). */
  rotuloSecundario: string;
  /** Valor secundário. */
  valorSecundario: number | null | undefined;
  /**
   * Casas decimais do valor secundário.
   *  - 'pct2' (default): 2 casas (acumulados mensais)
   *  - 'pct4': 4 casas (taxas diárias)
   */
  formatoSecundario?: 'pct2' | 'pct4';
}

/**
 * Card individual de índice financeiro.
 *
 * Espelha o layout aprovado no mockup: label, valor principal grande,
 * legenda, separador, métrica secundária.
 */
export function IndiceCard({
  nome,
  valorPrincipal,
  legendaPrincipal,
  rotuloSecundario,
  valorSecundario,
  formatoSecundario = 'pct2',
}: IndiceCardProps) {
  const formatarSec = formatoSecundario === 'pct4' ? formatarPercentual4 : formatarPercentual;

  return (
    <Card className="flex-1">
      <Text className="text-xs font-medium text-text-secondary tracking-wide">
        {nome}
      </Text>
      <Text className="mt-2 text-2xl font-medium text-text-primary">
        {formatarPercentual(valorPrincipal).replace('%', '')}
        <Text className="text-sm text-text-secondary">%</Text>
      </Text>
      <Text className="mt-1 text-xs text-text-tertiary">{legendaPrincipal}</Text>
      <View className="mt-2 pt-2 border-t border-border">
        <Text className="text-xs text-text-tertiary">{rotuloSecundario}</Text>
        <Text className="mt-0.5 text-base font-medium text-text-primary">
          {formatarSec(valorSecundario)}
        </Text>
      </View>
    </Card>
  );
}