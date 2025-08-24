import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { LoginScreen, RegisterScreen, NearbyMechanicsScreen, RequestSessionScreen, ChatScreen, QuoteScreen } from '../screens';
import { TabNavigator } from './TabNavigator';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../theme';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
  NearbyMechanics: { serviceType?: string };
  RequestSession: { requestId: string; mechanicName: string; serviceType: string };
  Chat: { sessionId: string; mechanicName: string; requestId: string };
  Quote: { requestId: string; mechanicName: string; serviceType: string; quoteAmount: number; quoteDescription: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  // Show loading screen while checking authentication state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.darkBlue} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? "Main" : "Login"}
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary.darkBlue,
          },
          headerTintColor: theme.colors.neutral.white,
          headerTitleStyle: {
            fontWeight: theme.typography.fontWeight.semibold,
          },
          headerShadowVisible: false,
        }}
      >
        {user ? (
          // User is authenticated - show main app
          <>
            <Stack.Screen
              name="Main"
              component={TabNavigator}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="NearbyMechanics"
              component={NearbyMechanicsScreen}
              options={{
                headerShown: false,
                presentation: 'modal',
              }}
            />
            <Stack.Screen
              name="RequestSession"
              component={RequestSessionScreen}
              options={{
                headerShown: false,
                presentation: 'modal',
              }}
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={{
                headerShown: false,
                presentation: 'modal',
              }}
            />
            <Stack.Screen
              name="Quote"
              component={QuoteScreen}
              options={{
                headerShown: false,
                presentation: 'modal',
              }}
            />
          </>
        ) : (
          // User is not authenticated - show auth screens
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{
                title: 'Create Account',
                headerBackTitle: 'Back',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
  },
});
