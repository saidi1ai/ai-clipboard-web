import React from 'react';
import { Tabs } from 'expo-router';
import { useAppTheme } from '@/utils/theme-helper';
import { Home, ClipboardList, Settings } from 'lucide-react-native';
import colors from '@/constants/colors';

export default function TabLayout() {
  const { card, text } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: card,
        },
        headerStyle: {
          backgroundColor: card,
        },
        headerTitleStyle: {
          color: text,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => (
            <ClipboardList size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}