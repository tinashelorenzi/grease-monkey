import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { HomeTabScreen, HistoryTabScreen, PaymentsTabScreen, ChatTabScreen } from '../screens';

export type TabParamList = {
  Home: undefined;
  History: undefined;
  Payments: undefined;
  Chat: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Payments') {
            iconName = focused ? 'card' : 'card-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary.darkBlue,
        tabBarInactiveTintColor: theme.colors.text.tertiary,
        tabBarStyle: {
          backgroundColor: theme.colors.background.card,
          borderTopColor: theme.colors.border.primary,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeTabScreen}
        options={{
          title: 'Home',
        }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryTabScreen}
        options={{
          title: 'History',
        }}
      />
      <Tab.Screen 
        name="Payments" 
        component={PaymentsTabScreen}
        options={{
          title: 'Payments',
        }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatTabScreen}
        options={{
          title: 'Chat',
        }}
      />
    </Tab.Navigator>
  );
};
