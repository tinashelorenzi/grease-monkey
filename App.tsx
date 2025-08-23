import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { theme } from './src/theme';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <View style={styles.container}>
        <StatusBar style="light" backgroundColor={theme.colors.primary.darkBlue} />
        <AppNavigator />
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
});
