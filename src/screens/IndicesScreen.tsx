import { useCallback, useEffect, useState } from 'react';
import { Text, View, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Screen, Card, Button, IndiceCard } from '../components';
import { fetchIndicesSnapshot, IndicesApiError } from '../services';
import type { IndicesSnapshot } from '../types/indices';

interface IndicesScreenProps {
  /** Callback acionado quando o usuário toca em "Calcular rendimento". */
  onNavigateToCalculator?: () => void;
}

/**
 * Tela principal do CalculaDI: exibe os 4 índices em grid 2x2,
 * com loading, tratamento de erro, pull-to-refresh e botão pra calculadora.
 *
 * NOTA: o snapshot internamente tem o campo `origem` ('cache' | 'live' |
 * 'parcial'), mas isso é detalhe técnico e NÃO é exibido ao usuário.
 * Fica disponível só para debugging via DevTools.
 */
export function IndicesScreen({ onNavigateToCalculator }: IndicesScreenProps = {}) {
  const { t } = useTranslation();

  const [snapshot, setSnapshot] = useState<IndicesSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregar = useCallback(async (isRefresh = false): Promise<void> => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await fetchIndicesSnapshot();
      setSnapshot(data);
    } catch (err) {
      const msg = err instanceof IndicesApiError ? err.message : 'Erro desconhecido';
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    carregar(false);
  }, [carregar]);

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => carregar(true)} />
        }
      >
        <Text className="text-xs text-text-tertiary uppercase tracking-wider">
          {t('navigation.indices')}
        </Text>
        <Text className="mt-1 text-3xl font-medium text-text-primary">
          {t('indices.title')}
        </Text>
        <Text className="mt-1 text-sm text-text-secondary">
          {t('indices.subtitle')}
        </Text>

        {loading && (
          <View className="mt-10 items-center">
            <ActivityIndicator size="large" color="#1C1C1E" />
            <Text className="mt-3 text-sm text-text-secondary">{t('common.loading')}</Text>
          </View>
        )}

        {error && !loading && (
          <View className="mt-6">
            <Card>
              <Text className="text-base font-medium text-danger">⚠️ {t('common.error')}</Text>
              <Text className="mt-2 text-sm text-text-secondary">{error}</Text>
            </Card>
            <View className="mt-3">
              <Button label={t('common.retry')} onPress={() => carregar(false)} fullWidth />
            </View>
          </View>
        )}

        {snapshot && !loading && !error && (
          <>
            <View className="mt-6 flex-row" style={{ gap: 10 }}>
              <IndiceCard
                nome={t('indices.ipca')}
                valorPrincipal={snapshot.ipca?.valorMes}
                legendaPrincipal={snapshot.ipca?.mesReferenciaDisplay ?? '—'}
                rotuloSecundario={t('indices.accumulated12m')}
                valorSecundario={snapshot.ipca?.acumulado12m}
              />
              <IndiceCard
                nome={t('indices.igpm')}
                valorPrincipal={snapshot.igpm?.valorMes}
                legendaPrincipal={snapshot.igpm?.mesReferenciaDisplay ?? '—'}
                rotuloSecundario={t('indices.accumulated12m')}
                valorSecundario={snapshot.igpm?.acumulado12m}
              />
            </View>

            <View className="mt-3 flex-row" style={{ gap: 10 }}>
              <IndiceCard
                nome={t('indices.selic')}
                valorPrincipal={snapshot.selic?.valorAnual}
                legendaPrincipal={t('indices.yearly')}
                rotuloSecundario={t('indices.dailyEquivalent')}
                valorSecundario={snapshot.selic?.valorDiarioEquivalente}
                formatoSecundario="pct4"
              />
              <IndiceCard
                nome={t('indices.cdi')}
                valorPrincipal={snapshot.cdi?.valorAnual}
                legendaPrincipal={t('indices.yearly')}
                rotuloSecundario={t('indices.dailyRate')}
                valorSecundario={snapshot.cdi?.valorDiarioEquivalente}
                formatoSecundario="pct4"
              />
            </View>

            <View className="mt-6">
              <Button
                label={t('indices.simulateCdb')}
                onPress={onNavigateToCalculator ?? (() => {})}
                variant="primary"
                fullWidth
              />
            </View>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}