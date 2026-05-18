import './global.css';
import './src/i18n';

import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { IndicesScreen } from './src/screens/IndicesScreen';

export default function App() {
  const { i18n } = useTranslation();
  const [showLanguageToggle] = useState(true); // depois esconde, fica em "Sobre"

  const toggleLang = (): void => {
    const next = i18n.language === 'pt-BR' ? 'en-US' : 'pt-BR';
    i18n.changeLanguage(next);
  };

  return (
    <SafeAreaProvider>
      <View className="flex-1 bg-background">
        <IndicesScreen
          onNavigateToCalculator={() => console.log('Ir para Calculadora')}
        />

        {/* Toggle temporário de idioma, vai pra tela Sobre depois */}
        {showLanguageToggle && (
          <Pressable
            onPress={toggleLang}
            className="absolute bottom-5 right-5 bg-primary px-3 py-2 rounded-md"
          >
            <Text className="text-primary-inverse text-xs font-medium">
              {i18n.language === 'pt-BR' ? '🌐 EN' : '🌐 PT'}
            </Text>
          </Pressable>
        )}

        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}