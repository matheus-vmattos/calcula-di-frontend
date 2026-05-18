import { View } from 'react-native';

interface MtmMiniChartProps {
  valorInicial: number;
  valorCurvaHoje: number;
  valorMtmHoje: number;
  valorVencimento: number;
}

export function MtmMiniChart({
  valorInicial,
  valorCurvaHoje,
  valorMtmHoje,
  valorVencimento,
}: MtmMiniChartProps) {
  const max = Math.max(valorInicial, valorCurvaHoje, valorMtmHoje, valorVencimento);
  const min = Math.min(valorInicial, valorCurvaHoje, valorMtmHoje, valorVencimento);

  const norm = (v: number): number => {
    if (max === min) return 50;
    return ((v - min) / (max - min)) * 100;
  };

  // eixo X: 0% compra, 50% hoje, 100% vencimento
  const xCompra = 0;
  const xHoje = 50;
  const xVenc = 100;

  // eixo Y invertido (0 topo, 100 base)
  const yCompra = 100 - norm(valorInicial);
  const yCurvaHoje = 100 - norm(valorCurvaHoje);
  const yMtmHoje = 100 - norm(valorMtmHoje);
  const yVenc = 100 - norm(valorVencimento);

  return (
    <View className="mt-3 h-40 rounded-xl border border-border bg-card p-3">
      {/* Linha azul: curva contratada (compra -> hoje -> vencimento) */}
      <View
        style={{
          position: 'absolute',
          left: '3%',
          top: `${yCompra}%`,
          width: '47%',
          height: 2,
          backgroundColor: '#2563EB',
          transform: [{ rotate: `${Math.atan2(yCurvaHoje - yCompra, 50) * (180 / Math.PI)}deg` }],
          transformOrigin: 'left center' as any,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: '50%',
          top: `${yCurvaHoje}%`,
          width: '47%',
          height: 2,
          backgroundColor: '#2563EB',
          transform: [{ rotate: `${Math.atan2(yVenc - yCurvaHoje, 50) * (180 / Math.PI)}deg` }],
          transformOrigin: 'left center' as any,
        }}
      />

      {/* Linha vermelha: compra -> MTM hoje */}
      <View
        style={{
          position: 'absolute',
          left: '3%',
          top: `${yCompra}%`,
          width: '47%',
          height: 2,
          backgroundColor: '#DC2626',
          transform: [{ rotate: `${Math.atan2(yMtmHoje - yCompra, 50) * (180 / Math.PI)}deg` }],
          transformOrigin: 'left center' as any,
        }}
      />

      {/* Pontos */}
      <View style={{ position: 'absolute', left: `${xCompra}%`, top: `${yCompra}%`, width: 8, height: 8, borderRadius: 4, backgroundColor: '#111827' }} />
      <View style={{ position: 'absolute', left: `${xHoje}%`, top: `${yCurvaHoje}%`, width: 8, height: 8, borderRadius: 4, backgroundColor: '#2563EB' }} />
      <View style={{ position: 'absolute', left: `${xHoje}%`, top: `${yMtmHoje}%`, width: 8, height: 8, borderRadius: 4, backgroundColor: '#DC2626' }} />
      <View style={{ position: 'absolute', left: `${xVenc}%`, top: `${yVenc}%`, width: 8, height: 8, borderRadius: 4, backgroundColor: '#2563EB' }} />
    </View>
  );
}