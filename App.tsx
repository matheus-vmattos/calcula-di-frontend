import './global.css';
import './src/i18n';

import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { IndicesScreen } from './src/screens/IndicesScreen';
import { CalculadoraScreen } from './src/screens/CalculadoraScreen';
import { PrefixadoMtmScreen } from './src/screens/PrefixadoMtmScreen';

type Tela = 'indices' | 'calculadora' | 'prefixadoMtm';

function AppContent() {
  const { i18n } = useTranslation();
  const insets = useSafeAreaInsets();

  const [tela, setTela] = useState<Tela>('indices');

  const toggleLang = (): void => {
    const next = i18n.language === 'pt-BR' ? 'en-US' : 'pt-BR';
    i18n.changeLanguage(next);
  };

  return (
    <View className="flex-1 bg-background">
      {tela === 'indices' && (
        <IndicesScreen
          onNavigateToCalculator={() => setTela('calculadora')}
          onNavigateToPrefixadoMtm={() => setTela('prefixadoMtm')}
        />
      )}

      {tela === 'calculadora' && (
        <CalculadoraScreen cdiAnual={14.4} onBack={() => setTela('indices')} />
      )}

      {tela === 'prefixadoMtm' && (
        <PrefixadoMtmScreen onBack={() => setTela('indices')} />
      )}

      <Pressable
        onPress={toggleLang}
        style={{
          position: 'absolute',
          right: 16,
          bottom: Math.max(insets.bottom + 12, 24),
        }}
        className="bg-primary px-3 py-2 rounded-md"
      >
        <Text className="text-primary-inverse text-xs font-medium">
          {i18n.language === 'pt-BR' ? '🌐 EN' : '🌐 PT'}
        </Text>
      </Pressable>

      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}