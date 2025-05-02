import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, View, StyleSheet, Easing, TouchableOpacity } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { ThemeProvider } from '@/context/ThemeContext';
import { Stack } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        animation: 'shift',
        headerShown: true, // Ensure the header (back button) is visible
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            paddingBottom: 0,
          },
          default: {
            paddingBottom: 0,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="daily"
        options={{
          title: 'Daily',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: 'Practice',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="puzzlepiece.extension" color={color} />,
        }}
      />
      <Tabs.Screen
        name="ranking"
        options={{
          title: 'Ranking',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="trophy" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person" color={color} />,
        }}
      />
      <Tabs.Screen
        name="themes"
        options={{
          title: 'Themes',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}

export function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        animation: 'shift',
        tabBarInactiveBackgroundColor: theme.headerBackground,
        tabBarActiveBackgroundColor: theme.headerBackground,
        tabBarInactiveTintColor: theme.lightText,
        tabBarActiveTintColor: theme.accentColor1,
        headerStyle: {
          backgroundColor: theme.headerBackground,
        },
        headerTitleStyle: {
          color: theme.titleText,
        },
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            paddingBottom: 0,
          },
          default: {
            paddingBottom: 0,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="daily"
        options={{
          title: 'Daily',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: 'Practice',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="puzzlepiece.extension" color={color} />,
        }}
      />
      <Tabs.Screen
        name="ranking"
        options={{
          title: 'Ranking',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="trophy" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person" color={color} />,
        }}
      />
      <Tabs.Screen
        name="themes"
        options={{
          title: 'Themes',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}