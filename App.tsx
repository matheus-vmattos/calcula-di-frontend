import './global.css';
import './src/i18n';

import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { Screen, Card, Button } from './src/components';
import { fetchIndicesSnapshot, IndicesApiError } from './src/services';
import type { IndicesSnapshot } from './src/types/indices';

export default function App() {
  const { t, i18n } = useTranslation();

  const [snapshot, setSnapshot] = useState<IndicesSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarIndices = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchIndicesSnapshot();
      setSnapshot(data);
    } catch (err) {
      const msg = err instanceof IndicesApiError ? err.message : 'Erro desconhecido';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarIndices();
  }, []);

  const toggleLang = (): void => {
    const next = i18n.language === 'pt-BR' ? 'en-US' : 'pt-BR';
    i18n.changeLanguage(next);
  };

  return (
    <SafeAreaProvider>
      <Screen>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 20 }}>

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
              <ActivityIndicator size="large" color="#000" />
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
                <Button label={t('common.retry')} onPress={carregarIndices} fullWidth />
              </View>
            </View>
          )}

          {snapshot && !loading && !error && (
            <>
              <View className="mt-6 flex-row" style={{ gap: 10 }}>
                <Card className="flex-1">
                  <Text className="text-xs font-medium text-text-secondary tracking-wide">
                    {t('indices.ipca')}
                  </Text>
                  <Text className="mt-2 text-2xl font-medium text-text-primary">
                    {snapshot.ipca?.valorMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) ?? '—'}
                    <Text className="text-sm text-text-secondary">%</Text>
                  </Text>
                  <Text className="mt-1 text-xs text-text-tertiary">
                    {snapshot.ipca?.mesReferenciaDisplay ?? '—'}
                  </Text>
                  <View className="mt-2 pt-2 border-t border-border">
                    <Text className="text-xs text-text-tertiary">{t('indices.accumulated12m')}</Text>
                    <Text className="mt-0.5 text-base font-medium text-text-primary">
                      {snapshot.ipca?.acumulado12m.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) ?? '—'}%
                    </Text>
                  </View>
                </Card>

                <Card className="flex-1">
                  <Text className="text-xs font-medium text-text-secondary tracking-wide">
                    {t('indices.igpm')}
                  </Text>
                  <Text className="mt-2 text-2xl font-medium text-text-primary">
                    {snapshot.igpm?.valorMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) ?? '—'}
                    <Text className="text-sm text-text-secondary">%</Text>
                  </Text>
                  <Text className="mt-1 text-xs text-text-tertiary">
                    {snapshot.igpm?.mesReferenciaDisplay ?? '—'}
                  </Text>
                  <View className="mt-2 pt-2 border-t border-border">
                    <Text className="text-xs text-text-tertiary">{t('indices.accumulated12m')}</Text>
                    <Text className="mt-0.5 text-base font-medium text-text-primary">
                      {snapshot.igpm?.acumulado12m.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) ?? '—'}%
                    </Text>
                  </View>
                </Card>
              </View>

              <View className="mt-3 flex-row" style={{ gap: 10 }}>
                <Card className="flex-1">
                  <Text className="text-xs font-medium text-text-secondary tracking-wide">
                    {t('indices.selic')}
                  </Text>
                  <Text className="mt-2 text-2xl font-medium text-text-primary">
                    {snapshot.selic?.valorAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) ?? '—'}
                    <Text className="text-sm text-text-secondary">%</Text>
                  </Text>
                  <Text className="mt-1 text-xs text-text-tertiary">{t('indices.yearly')}</Text>
                  <View className="mt-2 pt-2 border-t border-border">
                    <Text className="text-xs text-text-tertiary">{t('indices.dailyEquivalent')}</Text>
                    <Text className="mt-0.5 text-base font-medium text-text-primary">
                      {snapshot.selic?.valorDiarioEquivalente.toLocaleString('pt-BR', { minimumFractionDigits: 4 }) ?? '—'}%
                    </Text>
                  </View>
                </Card>

                <Card className="flex-1">
                  <Text className="text-xs font-medium text-text-secondary tracking-wide">
                    {t('indices.cdi')}
                  </Text>
                  <Text className="mt-2 text-2xl font-medium text-text-primary">
                    {snapshot.cdi?.valorAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) ?? '—'}
                    <Text className="text-sm text-text-secondary">%</Text>
                  </Text>
                  <Text className="mt-1 text-xs text-text-tertiary">{t('indices.yearly')}</Text>
                  <View className="mt-2 pt-2 border-t border-border">
                    <Text className="text-xs text-text-tertiary">{t('indices.dailyRate')}</Text>
                    <Text className="mt-0.5 text-base font-medium text-text-primary">
                      {snapshot.cdi?.valorDiarioEquivalente.toLocaleString('pt-BR', { minimumFractionDigits: 4 }) ?? '—'}%
                    </Text>
                  </View>
                </Card>
              </View>

              <View className="mt-6">
                <Button
                  label={t('indices.simulateCdb')}
                  onPress={() => console.log('Calculadora!')}
                  variant="primary"
                  fullWidth
                />
              </View>

              <Text className="mt-4 text-xs text-text-tertiary text-center">
                {snapshot.origem === 'cache' ? t('indices.sourceCache') : t('indices.sourceLive')}
              </Text>
            </>
          )}

          <View className="mt-6">
            <Button
              label={i18n.language === 'pt-BR' ? 'Switch to English' : 'Mudar pra Português'}
              onPress={toggleLang}
              variant="secondary"
              fullWidth
            />
          </View>

        </ScrollView>
        <StatusBar style="auto" />
      </Screen>
    </SafeAreaProvider>
  );
}