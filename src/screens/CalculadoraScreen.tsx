import { useMemo, useState } from 'react';
import { Text, View, ScrollView, Pressable, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Screen, Card, Button, CampoNumero, SegmentedControl } from '../components';
import { calcularCdb } from '../domain/cdb-calculator';
import { converterPrazo, type UnidadePrazo } from '../domain/prazo';
import { formatarMoeda, formatarPercentual } from '../domain/format';

interface CalculadoraScreenProps {
  cdiAnual?: number;
  onBack?: () => void;
}

const PRESETS_CDI = ['100%', '110%', '120%', 'Outro'] as const;
const UNIDADES: UnidadePrazo[] = ['dias', 'meses', 'anos'];

function maskMoneyBR(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (!digits) return '';
  const value = Number(digits) / 100;
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function parseMoneyBRToNumber(masked: string): number {
  const normalized = masked.replace(/\./g, '').replace(',', '.').trim();
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
}

function sanitizePercentInput(value: string): string {
  // mantém dígitos e vírgula, permite "200", "200,5", "200,50"
  let v = value.replace(/[^\d,]/g, '');
  const firstComma = v.indexOf(',');
  if (firstComma !== -1) {
    // remove vírgulas extras
    v = v.slice(0, firstComma + 1) + v.slice(firstComma + 1).replace(/,/g, '');
    // limita 2 casas decimais
    const [intPart, decPart = ''] = v.split(',');
    v = `${intPart},${decPart.slice(0, 2)}`;
  }
  return v;
}

function parsePercentBRToNumber(masked: string): number {
  const normalized = masked.replace(/\./g, '').replace(',', '.').trim();
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
}

export function CalculadoraScreen({ cdiAnual = 14.4, onBack }: CalculadoraScreenProps) {
  const { t } = useTranslation();

  const [valor, setValor] = useState('10.000,00');
  const [presetIdx, setPresetIdx] = useState(2);
  const [percentualCustom, setPercentualCustom] = useState('120');
  const [unidadeIdx, setUnidadeIdx] = useState(2);
  const [prazoValor, setPrazoValor] = useState('2');

  const percentualCdi = useMemo(() => {
    if (presetIdx === 3) return parsePercentBRToNumber(percentualCustom);
    return [100, 110, 120][presetIdx];
  }, [presetIdx, percentualCustom]);

  const resultado = useMemo(() => {
    const valorNum = parseMoneyBRToNumber(valor);
    const prazoNum = Number(prazoValor.replace(/\D/g, ''));
    if (valorNum <= 0 || prazoNum <= 0 || percentualCdi <= 0) return null;

    try {
      const { diasCorridos, diasUteis } = converterPrazo(prazoNum, UNIDADES[unidadeIdx]);
      return calcularCdb({
        valorInvestido: valorNum,
        percentualCdi,
        taxaCdiAnual: cdiAnual,
        diasCorridos,
        diasUteis,
      });
    } catch {
      return null;
    }
  }, [valor, prazoValor, percentualCdi, unidadeIdx, cdiAnual]);

  const labelUnidades = [t('calculator.days'), t('calculator.months'), t('calculator.years')];

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 20 }}>
        <View className="flex-row items-center" style={{ gap: 12 }}>
          <Pressable
            onPress={onBack}
            className="w-9 h-9 rounded-full bg-surface border border-border items-center justify-center"
          >
            <Text className="text-base text-text-primary">‹</Text>
          </Pressable>
          <View>
            <Text className="text-xs text-text-tertiary uppercase tracking-wider">
              {t('calculator.label')}
            </Text>
            <Text className="text-lg font-medium text-text-primary">
              {t('calculator.title')}
            </Text>
          </View>
        </View>

        <View className="mt-5">
          <CampoNumero
            label={t('calculator.amount')}
            value={valor}
            onChangeText={(txt) => setValor(maskMoneyBR(txt))}
            prefixo="R$"
            placeholder="10.000,00"
          />
        </View>

        <View className="mt-4">
          <Text className="mb-1.5 text-xs font-medium text-text-secondary">
            {t('calculator.rate')}
          </Text>
          <SegmentedControl
            options={PRESETS_CDI}
            selectedIndex={presetIdx}
            onSelect={setPresetIdx}
          />

          {presetIdx === 3 && (
            <View className="mt-2">
              <Text className="mb-1.5 text-xs font-medium text-text-secondary">% do CDI</Text>
              <View className="rounded-xl border border-border bg-surface px-3 py-2">
                <TextInput
                  value={percentualCustom}
                  onChangeText={(txt) => setPercentualCustom(sanitizePercentInput(txt))}
                  keyboardType="decimal-pad"
                  placeholder="120"
                  placeholderTextColor="#9A9A9F"
                  className="text-base text-text-primary"
                />
              </View>
            </View>
          )}

          {resultado && (
            <Text className="mt-1.5 text-xs text-text-tertiary">
              {percentualCdi.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}% do CDI ·{' '}
              {formatarPercentual(resultado.taxaContratadaAnual)} a.a. estimado
            </Text>
          )}
        </View>

        <View className="mt-4">
          <Text className="mb-1.5 text-xs font-medium text-text-secondary">
            {t('calculator.duration')}
          </Text>
          <SegmentedControl
            options={labelUnidades}
            selectedIndex={unidadeIdx}
            onSelect={setUnidadeIdx}
          />
          <View className="mt-2">
            <CampoNumero
              label=""
              value={prazoValor}
              onChangeText={(txt) => setPrazoValor(txt.replace(/\D/g, '').slice(0, 4))}
              placeholder="2"
              legenda={
                resultado
                  ? `${resultado.diasCorridos} dias corridos · ${resultado.diasUteis} dias úteis`
                  : undefined
              }
            />
          </View>
        </View>

        {resultado && (
          <Card variant="highlight" className="mt-6">
            <Text className="text-xs" style={{ color: '#9A9A9F', letterSpacing: 0.5 }}>
              {t('calculator.youWillReceive')}
            </Text>
            <Text className="mt-1.5 text-3xl font-medium" style={{ color: '#FAFAFA' }}>
              {formatarMoeda(resultado.valorFinal)}
            </Text>

            <View className="mt-3.5">
              <LinhaResultado
                label={t('calculator.grossYield')}
                valor={`+ ${formatarMoeda(resultado.rendimentoBruto)}`}
              />
              {resultado.iof > 0 && (
                <LinhaResultado
                  label={t('calculator.iof')}
                  valor={`− ${formatarMoeda(resultado.iof)}`}
                />
              )}
              <LinhaResultado
                label={t('calculator.incomeTax', { rate: (resultado.aliquotaIr * 100).toFixed(1) })}
                valor={`− ${formatarMoeda(resultado.ir)}`}
              />
              <View className="border-t mt-2 pt-2" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
                <View className="flex-row justify-between">
                  <Text className="text-sm font-medium" style={{ color: '#FAFAFA' }}>
                    {t('calculator.netYield')}
                  </Text>
                  <Text className="text-sm font-medium" style={{ color: '#FAFAFA' }}>
                    {formatarMoeda(resultado.rendimentoLiquido)}
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        )}

        <View className="mt-6">
          <Button label={t('common.back')} onPress={onBack ?? (() => {})} variant="secondary" fullWidth />
        </View>
      </ScrollView>
    </Screen>
  );
}

function LinhaResultado({ label, valor }: { label: string; valor: string }) {
  return (
    <View className="flex-row justify-between py-1">
      <Text className="text-xs" style={{ color: '#9A9A9F' }}>{label}</Text>
      <Text className="text-xs" style={{ color: '#E8E8EB' }}>{valor}</Text>
    </View>
  );
}