import { View, Text, useWindowDimensions } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';

interface PrefixadoMtmChartProps {
  valorInicial: number;
  valorCurvaHoje: number;
  valorMtmHoje: number;
  valorVencimento: number;
}

function toPath(points: Array<{ x: number; y: number }>): string {
  if (!points.length) return '';
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
}

export function PrefixadoMtmChart({
  valorInicial,
  valorCurvaHoje,
  valorMtmHoje,
  valorVencimento,
}: PrefixadoMtmChartProps) {
  const { width: screenWidth } = useWindowDimensions();

  const width = Math.max(260, Math.min(screenWidth - 56, 420)); // responsivo e estável
  const height = 180;
  const padX = 18;
  const padY = 18;

  const values = [valorInicial, valorCurvaHoje, valorMtmHoje, valorVencimento].filter(
    (v) => Number.isFinite(v),
  );

  if (values.length < 4) {
    return (
      <View className="mt-4 rounded-xl border border-border bg-card p-3">
        <Text className="text-sm text-text-secondary">Gráfico indisponível (dados inválidos).</Text>
      </View>
    );
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;

  const xCompra = padX;
  const xHoje = width / 2;
  const xVenc = width - padX;

  const y = (v: number): number => padY + ((max - v) / span) * (height - padY * 2);

  const curvaPts = [
    { x: xCompra, y: y(valorInicial) },
    { x: xHoje, y: y(valorCurvaHoje) },
    { x: xVenc, y: y(valorVencimento) },
  ];

  const mtmPts = [
    { x: xCompra, y: y(valorInicial) },
    { x: xHoje, y: y(valorMtmHoje) },
  ];

  return (
    <View className="mt-4 rounded-xl border border-border bg-card p-3">
      <Text className="text-sm text-text-secondary">Evolução estimada</Text>

      <Svg width={width} height={height}>
        {/* Linha vertical em "hoje" */}
        <Line
          x1={xHoje}
          y1={padY}
          x2={xHoje}
          y2={height - padY}
          stroke="#CBD5E1"
          strokeDasharray="4,4"
          strokeWidth={1}
        />

        {/* Curva contratada (azul) */}
        <Path d={toPath(curvaPts)} stroke="#2563EB" strokeWidth={3} fill="none" />

        {/* MTM hoje (vermelho) */}
        <Path d={toPath(mtmPts)} stroke="#DC2626" strokeWidth={3} fill="none" />

        {/* Pontos */}
        {curvaPts.map((p, idx) => (
          <Circle key={`curva-${idx}`} cx={p.x} cy={p.y} r={4} fill="#2563EB" />
        ))}
        <Circle cx={mtmPts[1].x} cy={mtmPts[1].y} r={5} fill="#DC2626" />
      </Svg>

      <View className="mt-2 flex-row items-center" style={{ gap: 14 }}>
        <View className="flex-row items-center" style={{ gap: 6 }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#2563EB' }} />
          <Text className="text-xs text-text-secondary">Curva contratada</Text>
        </View>

        <View className="flex-row items-center" style={{ gap: 6 }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#DC2626' }} />
          <Text className="text-xs text-text-secondary">Venda hoje (MTM)</Text>
        </View>
      </View>
    </View>
  );
}