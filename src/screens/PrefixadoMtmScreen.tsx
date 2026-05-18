import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, Text, TextInput, View, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Screen, Card, Button, PrefixadoMtmChart } from '../components';
import { calcularPrefixadoMtm } from '../domain/prefixado-mtm';
import { formatarMoeda, formatarPercentual } from '../domain/format';
import { fetchIndicesSnapshot } from '../services';
import { loadJson, saveJson } from '../services/local-storage';

interface PrefixadoMtmScreenProps {
  onBack?: () => void;
}

type ReferenciaTaxa = 'cdi' | 'selic';

const MTM_STORAGE_KEY = 'prefixado_mtm_form_v1';

interface PrefixadoMtmPersistedState {
  valor: string;
  taxaContratada: string;
  taxaMercado: string;
  refTaxa: ReferenciaTaxa;
  dataCompra: string;
  dataVenc: string;
}

function maskDateBR(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, 8);
  const p1 = digits.slice(0, 2);
  const p2 = digits.slice(2, 4);
  const p3 = digits.slice(4, 8);
  if (digits.length <= 2) return p1;
  if (digits.length <= 4) return `${p1}/${p2}`;
  return `${p1}/${p2}/${p3}`;
}

function parseBrDateToIso(brDate: string): string {
  const m = brDate.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) throw new Error('Data deve estar no formato DD/MM/AAAA.');

  const d = Number(m[1]);
  const mo = Number(m[2]);
  const y = Number(m[3]);

  if (y < 1900 || y > 2100) throw new Error('Ano inválido.');
  if (mo < 1 || mo > 12) throw new Error('Mês inválido.');
  if (d < 1 || d > 31) throw new Error('Dia inválido.');

  const iso = `${String(y).padStart(4, '0')}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const dt = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(dt.getTime())) throw new Error('Data inválida.');
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() + 1 !== mo || dt.getUTCDate() !== d) {
    throw new Error('Data inválida.');
  }
  return iso;
}

function getHojeBR(): string {
  const now = new Date();
  return `${String(now.getUTCDate()).padStart(2, '0')}/${String(now.getUTCMonth() + 1).padStart(2, '0')}/${String(now.getUTCFullYear())}`;
}

function maskMoneyBR(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (!digits) return '';
  const value = Number(digits) / 100;
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function maskPercentBR(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, 6);
  if (!digits) return '';
  const value = Number(digits) / 100;
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function parseMoneyBRToNumber(masked: string): number {
  const n = Number(masked.replace(/\./g, '').replace(',', '.').trim());
  if (!Number.isFinite(n) || n <= 0) throw new Error('Valor investido inválido.');
  return n;
}

function parsePercentBRToNumber(masked: string, fieldName: string): number {
  const n = Number(masked.replace(/\./g, '').replace(',', '.').trim());
  if (!Number.isFinite(n)) throw new Error(`${fieldName} inválida.`);
  return n;
}

function TaxaToggle({
  value,
  onChange,
}: {
  value: ReferenciaTaxa;
  onChange: (v: ReferenciaTaxa) => void;
}) {
  return (
    <View className="mt-2 self-start rounded-lg border border-border overflow-hidden flex-row">
      <Pressable
        onPress={() => onChange('cdi')}
        className={`px-4 py-2 ${value === 'cdi' ? 'bg-primary' : 'bg-card'}`}
      >
        <Text className={value === 'cdi' ? 'text-primary-inverse font-medium' : 'text-text-primary'}>
          CDI
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onChange('selic')}
        className={`px-4 py-2 border-l border-border ${value === 'selic' ? 'bg-primary' : 'bg-card'}`}
      >
        <Text className={value === 'selic' ? 'text-primary-inverse font-medium' : 'text-text-primary'}>
          SELIC
        </Text>
      </Pressable>
    </View>
  );
}

export function PrefixadoMtmScreen({ onBack }: PrefixadoMtmScreenProps = {}) {
  const { t } = useTranslation();

  const [valor, setValor] = useState('10.000,00');
  const [taxaContratada, setTaxaContratada] = useState('15,00');
  const [taxaMercado, setTaxaMercado] = useState('14,00');

  const [refTaxa, setRefTaxa] = useState<ReferenciaTaxa>('cdi');
  const [cdiAnual, setCdiAnual] = useState<number | null>(null);
  const [selicAnual, setSelicAnual] = useState<number | null>(null);

  const [dataCompra, setDataCompra] = useState('02/01/2025');
  const [dataVenc, setDataVenc] = useState('02/01/2027');

  const [isHydrated, setIsHydrated] = useState(false);
  const lastSavedRef = useRef('');

  const hojeBr = getHojeBR();

  useEffect(() => {
    let mounted = true;
    loadJson<PrefixadoMtmPersistedState>(MTM_STORAGE_KEY).then((saved) => {
      if (!mounted) return;
      if (saved) {
        setValor(saved.valor ?? '10.000,00');
        setTaxaContratada(saved.taxaContratada ?? '15,00');
        setTaxaMercado(saved.taxaMercado ?? '14,00');
        setRefTaxa(saved.refTaxa ?? 'cdi');
        setDataCompra(saved.dataCompra ?? '02/01/2025');
        setDataVenc(saved.dataVenc ?? '02/01/2027');
      }
      setIsHydrated(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    fetchIndicesSnapshot()
      .then((snap) => {
        const cdi = snap.cdi?.valorAnual ?? null;
        const selic = snap.selic?.valorAnual ?? null;
        setCdiAnual(cdi);
        setSelicAnual(selic);

        if (refTaxa === 'cdi' && cdi !== null) {
          setTaxaMercado(cdi.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        }
        if (refTaxa === 'selic' && selic !== null) {
          setTaxaMercado(selic.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (refTaxa === 'cdi' && cdiAnual !== null) {
      setTaxaMercado(cdiAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    }
    if (refTaxa === 'selic' && selicAnual !== null) {
      setTaxaMercado(selicAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    }
  }, [refTaxa, cdiAnual, selicAnual]);

  useEffect(() => {
    if (!isHydrated) return;
    const payload: PrefixadoMtmPersistedState = {
      valor,
      taxaContratada,
      taxaMercado,
      refTaxa,
      dataCompra,
      dataVenc,
    };
    const serialized = JSON.stringify(payload);
    if (serialized === lastSavedRef.current) return;
    lastSavedRef.current = serialized;
    saveJson(MTM_STORAGE_KEY, payload);
  }, [isHydrated, valor, taxaContratada, taxaMercado, refTaxa, dataCompra, dataVenc]);

  const sim = useMemo(() => {
    try {
      const dataCompraIso = parseBrDateToIso(dataCompra);
      const dataVencIso = parseBrDateToIso(dataVenc);
      const dataHojeIso = parseBrDateToIso(hojeBr);

      const valorNum = parseMoneyBRToNumber(valor);
      const taxaContratadaNum = parsePercentBRToNumber(taxaContratada, t('mtm.contractedRate'));
      const taxaMercadoNum = parsePercentBRToNumber(taxaMercado, t('mtm.marketRateUsed'));

      const data = calcularPrefixadoMtm({
        valorInvestido: valorNum,
        taxaContratadaAnual: taxaContratadaNum,
        taxaMercadoAnual: taxaMercadoNum,
        dataCompra: dataCompraIso,
        dataHoje: dataHojeIso,
        dataVencimento: dataVencIso,
        margemSegurancaPp: 0.5,
      });

      return { data, erro: null as string | null, valorInicialNum: valorNum };
    } catch (e) {
      return {
        data: null,
        erro: e instanceof Error ? e.message : t('common.error'),
        valorInicialNum: 0,
      };
    }
  }, [valor, taxaContratada, taxaMercado, dataCompra, dataVenc, hojeBr, t]);

  if (!isHydrated) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <Text className="text-sm text-text-secondary">{t('common.loading')}</Text>
        </View>
      </Screen>
    );
  }

  const r = sim.data;
  const isGanho = (r?.diferencaMtmVsCurvaHoje ?? 0) >= 0;

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 16 }}>
        <Text className="text-xs text-text-tertiary uppercase tracking-wider">Renda Fixa</Text>
        <Text className="mt-1 text-3xl font-medium text-text-primary">{t('mtm.title')}</Text>
        <Text className="mt-1 text-sm text-text-secondary">{t('mtm.subtitle')}</Text>

        <Card className="mt-4">
          <Text className="text-sm text-text-secondary">{t('mtm.investAmount')}</Text>
          <TextInput
            value={valor}
            onChangeText={(t2) => setValor(maskMoneyBR(t2))}
            keyboardType="numeric"
            placeholder="0,00"
            className="mt-1 rounded-md border border-border px-3 py-2 text-base text-text-primary"
          />

          <Text className="mt-3 text-sm text-text-secondary">{t('mtm.contractedRate')}</Text>
          <TextInput
            value={taxaContratada}
            onChangeText={(t2) => setTaxaContratada(maskPercentBR(t2))}
            keyboardType="numeric"
            placeholder="0,00"
            className="mt-1 rounded-md border border-border px-3 py-2 text-base text-text-primary"
          />

          <Text className="mt-3 text-sm text-text-secondary">{t('mtm.marketRateRef')}</Text>
          <TaxaToggle value={refTaxa} onChange={setRefTaxa} />

          <Text className="mt-3 text-sm text-text-secondary">{t('mtm.marketRateUsed')}</Text>
          <TextInput
            value={taxaMercado}
            onChangeText={(t2) => setTaxaMercado(maskPercentBR(t2))}
            keyboardType="numeric"
            placeholder="0,00"
            className="mt-1 rounded-md border border-border px-3 py-2 text-base text-text-primary"
          />

          <Text className="mt-3 text-sm text-text-secondary">{t('mtm.purchaseDate')}</Text>
          <TextInput
            value={dataCompra}
            onChangeText={(t2) => setDataCompra(maskDateBR(t2))}
            keyboardType="numeric"
            maxLength={10}
            placeholder={t('mtm.dateFormatHint')}
            className="mt-1 rounded-md border border-border px-3 py-2 text-base text-text-primary"
          />

          <Text className="mt-3 text-sm text-text-secondary">{t('mtm.maturityDate')}</Text>
          <TextInput
            value={dataVenc}
            onChangeText={(t2) => setDataVenc(maskDateBR(t2))}
            keyboardType="numeric"
            maxLength={10}
            placeholder={t('mtm.dateFormatHint')}
            className="mt-1 rounded-md border border-border px-3 py-2 text-base text-text-primary"
          />
        </Card>

        {sim.erro && (
          <Card className="mt-4">
            <Text className="text-danger font-medium">{t('common.error')}</Text>
            <Text className="mt-1 text-sm text-text-secondary">{sim.erro}</Text>
          </Card>
        )}

        {r && (
          <>
            <Card className="mt-4">
              <Text className="text-sm text-text-secondary">{t('mtm.sellTodayEstimated')}</Text>
              <Text className="mt-1 text-2xl font-semibold text-text-primary">
                {formatarMoeda(r.valorMercadoHoje)}
              </Text>

              <Text className="mt-4 text-sm text-text-secondary">{t('mtm.versusCurveToday')}</Text>
              <Text className={`mt-1 text-base font-semibold ${isGanho ? 'text-emerald-600' : 'text-danger'}`}>
                {isGanho ? `▲ ${t('mtm.aboveCurve')}` : `▼ ${t('mtm.belowCurve')}`}: {formatarMoeda(Math.abs(r.diferencaMtmVsCurvaHoje))} ({formatarPercentual(Math.abs(r.diferencaMtmVsCurvaHojePercentual))})
              </Text>

              <Text className="mt-4 text-sm text-text-secondary">{t('mtm.estimatedNetSaleValue')}</Text>
              <Text className="mt-1 text-xl font-semibold text-text-primary">
                {formatarMoeda(r.valorLiquidoEstimado)}
              </Text>

              <View className="mt-3">
                <Text className="text-sm text-text-secondary">{t('mtm.grossGain')}: {formatarMoeda(r.ganhoBrutoNaVenda)}</Text>
                <Text className="text-sm text-text-secondary">{t('mtm.estimatedIof')}: {formatarMoeda(r.iof)}</Text>
                <Text className="text-sm text-text-secondary">
                  {t('mtm.estimatedIncomeTax', { rate: (r.aliquotaIr * 100).toFixed(1) })}: {formatarMoeda(r.ir)}
                </Text>
                <Text className="text-sm text-text-secondary">{t('mtm.netGain')}: {formatarMoeda(r.ganhoLiquidoEstimado)}</Text>
              </View>
            </Card>

            <PrefixadoMtmChart
              valorInicial={sim.valorInicialNum}
              valorCurvaHoje={r.valorCurvaContratadaHoje}
              valorMtmHoje={r.valorMercadoHoje}
              valorVencimento={r.valorNoVencimento}
            />

            <Text className="mt-3 text-xs text-text-tertiary">
              {t('mtm.educationalDisclaimer')}
            </Text>
          </>
        )}

        <View className="mt-5">
          <Button label={t('common.back')} onPress={onBack ?? (() => {})} fullWidth />
        </View>
      </ScrollView>
    </Screen>
  );
}