import './global.css';

import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-2xl font-medium text-text-primary">
        CalculaDI
      </Text>
      <Text className="mt-2 text-sm text-text-secondary">
        Setup funcionando 🎯
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}