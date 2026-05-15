import './global.css';
import './src/i18n';

import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function App() {
  const { t, i18n } = useTranslation();

  const toggleLang = (): void => {
    const next = i18n.language === 'pt-BR' ? 'en-US' : 'pt-BR';
    i18n.changeLanguage(next);
  };

  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Text className="text-3xl font-medium text-text-primary">
        {t('common.appName')}
      </Text>
      <Text className="mt-2 text-base text-text-secondary text-center">
        {t('indices.subtitle')}
      </Text>

      <View className="mt-8 w-full max-w-sm bg-surface rounded-lg p-4">
        <Text className="text-xs text-text-tertiary uppercase tracking-wide">
          {t('navigation.indices')}
        </Text>
        <Text className="mt-2 text-2xl font-medium text-text-primary">
          {t('indices.title')}
        </Text>
      </View>

      <View
        className="mt-6 px-6 py-3 rounded-lg bg-primary"
        onTouchEnd={toggleLang}
      >
        <Text className="text-primary-inverse text-base font-medium">
          {i18n.language === 'pt-BR' ? 'Switch to English' : 'Mudar pra Português'}
        </Text>
      </View>

      <Text className="mt-4 text-xs text-text-tertiary">
        Idioma atual: {i18n.language}
      </Text>

      <StatusBar style="auto" />
    </View>
  );
}