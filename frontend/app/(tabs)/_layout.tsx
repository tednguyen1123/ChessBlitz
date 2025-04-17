import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, View, StyleSheet, Easing, TouchableOpacity } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <Tabs screenOptions={{
      animation: 'shift',
      tabBarInactiveBackgroundColor: '#454A64',
      tabBarActiveBackgroundColor: '#454A64',
      tabBarInactiveTintColor: '#CDCDCD',
      headerShown: true,
      tabBarButton: HapticTab,
      tabBarBackground: TabBarBackground,
      tabBarStyle: Platform.select({
        ios: {
          // Use a transparent background on iOS to show the blur effect
          position: 'absolute',
          paddingBottom: 0,
        },
        default: {
          paddingBottom: 0,
        }
      }),
      headerStyle: {
        backgroundColor: '#454A64',
      },
      headerTitleStyle: {
        color: '#fff',
      }
    }}>
      <Tabs.Screen
        name="daily"
        options={{
          title: 'Daily',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name={"calendar"} color={color} />,            
          tabBarActiveTintColor: '#93FF8F'
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: 'Practice',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="puzzlepiece.extension" color={color} />,
          tabBarActiveTintColor: '#94CFFF'
        }}
      />
      <Tabs.Screen
        name="ranking"
        options={{
          title: 'Ranking',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="trophy" color={color} />,
          tabBarActiveTintColor: '#FFF37E'
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person" color={color} />,
          tabBarActiveTintColor: '#FF7E7E'
        }}
      />
    </Tabs>
    
    
  );
}