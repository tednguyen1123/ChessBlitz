import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{
        headerBackButtonDisplayMode: 'minimal',
        headerBackButtonMenuEnabled: false,
        headerTintColor: '#fff',
        headerStyle: {
          backgroundColor: '#454A64',
        },
        headerTitleStyle: {
          color: '#fff',
        },
      }}>
        <Stack.Screen name="index" options={{
          title: 'Landing',
          headerShown: false,
        }}/>
        <Stack.Screen name="(tabs)" options={{
          headerShown: false,
        }}/>
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="puzzles/daily-puzzle" options={{
          title: 'Puzzle',
        }}/>
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
