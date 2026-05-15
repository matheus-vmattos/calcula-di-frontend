import './global.css';
import './src/i18n';

import { StatusBar } from 'expo-status-bar';
import { Text, View, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { Screen, Card, Button } from './src/components';

export default function App() {
  const { t, i18n } = useTranslation();

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

          <View className="mt-6 flex-row" style={{ gap: 10 }}>
            <Card className="flex-1">
              <Text className="text-xs font-medium text-text-secondary tracking-wide">
                {t('indices.ipca')}
              </Text>
              <Text className="mt-2 text-2xl font-medium text-text-primary">
                0,67
                <Text className="text-sm text-text-secondary">%</Text>
              </Text>
              <Text className="mt-1 text-xs text-text-tertiary">Abril/2026</Text>
              <View className="mt-2 pt-2 border-t border-border">
                <Text className="text-xs text-text-tertiary">{t('indices.accumulated12m')}</Text>
                <Text className="mt-0.5 text-base font-medium text-text-primary">4,39%</Text>
              </View>
            </Card>

            <Card className="flex-1">
              <Text className="text-xs font-medium text-text-secondary tracking-wide">
                {t('indices.selic')}
              </Text>
              <Text className="mt-2 text-2xl font-medium text-text-primary">
                14,50
                <Text className="text-sm text-text-secondary">%</Text>
              </Text>
              <Text className="mt-1 text-xs text-text-tertiary">{t('indices.yearly')}</Text>
              <View className="mt-2 pt-2 border-t border-border">
                <Text className="text-xs text-text-tertiary">{t('indices.dailyEquivalent')}</Text>
                <Text className="mt-0.5 text-base font-medium text-text-primary">0,0537%</Text>
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

          <View className="mt-3">
            <Button
              label={i18n.language === 'pt-BR' ? 'Switch to English' : 'Mudar pra Português'}
              onPress={toggleLang}
              variant="secondary"
              fullWidth
            />
          </View>

          <Text className="mt-6 text-xs text-text-tertiary text-center">
            Idioma: {i18n.language}
          </Text>

        </ScrollView>
        <StatusBar style="auto" />
      </Screen>
    </SafeAreaProvider>
  );
}