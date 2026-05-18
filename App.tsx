import './global.css';
import './src/i18n';

import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { IndicesScreen } from './src/screens/IndicesScreen';
import { CalculadoraScreen } from './src/screens/CalculadoraScreen';
import { PrefixadoMtmScreen } from './src/screens/PrefixadoMtmScreen';
import { fetchIndicesSnapshot } from './src/services';

type Tela = 'indices' | 'calculadora' | 'prefixadoMtm';

export default function App() {
  const { i18n } = useTranslation();
  const [tela, setTela] = useState<Tela>('indices');
  const [cdiAnual, setCdiAnual] = useState<number>(14.4);

  // Pré-carrega o CDI pra passar pra calculadora
  useEffect(() => {
    fetchIndicesSnapshot()
      .then((snap) => {
        if (snap.cdi?.valorAnual) setCdiAnual(snap.cdi.valorAnual);
      })
      .catch(() => {
        // mantém fallback 14.4
      });
  }, []);

  const toggleLang = (): void => {
    const next = i18n.language === 'pt-BR' ? 'en-US' : 'pt-BR';
    i18n.changeLanguage(next);
  };

  return (
    <SafeAreaProvider>
      <View className="flex-1 bg-background">
        {tela === 'indices' && (
          <IndicesScreen
            onNavigateToCalculator={() => setTela('calculadora')}
            onNavigateToPrefixadoMtm={() => setTela('prefixadoMtm')}
          />
        )}

        {tela === 'calculadora' && (
          <CalculadoraScreen cdiAnual={cdiAnual} onBack={() => setTela('indices')} />
        )}

        {tela === 'prefixadoMtm' && (
          <PrefixadoMtmScreen onBack={() => setTela('indices')} />
        )}

        <Pressable
          onPress={toggleLang}
          className="absolute bottom-5 right-5 bg-primary px-3 py-2 rounded-md"
        >
          <Text className="text-primary-inverse text-xs font-medium">
            {i18n.language === 'pt-BR' ? '🌐 EN' : '🌐 PT'}
          </Text>
        </Pressable>

        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}