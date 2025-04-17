import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SectionList } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import Chessboard from 'react-native-chessboard';
import { GestureHandlerRootView, Pressable, ScrollView } from 'react-native-gesture-handler';
import { fetchRandomPuzzle } from '@/components/RandomPuzzle';
import ChessboardDemo from '@/components/ChessboardDemo';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';

export default function DailyScreen() {
  const router = useRouter();

  return (
    <GestureHandlerRootView>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Pressable
          style={styles.dailyPuzzleButton}
          onPress={() => router.push('/puzzles/daily-puzzle')}
        >
          <ThemedText style={styles.dailyPuzzleButtonText}>
            Daily Puzzle #x:
          </ThemedText>
          <ThemedText style={styles.dailyPuzzleButtonSplash}>
            example title
          </ThemedText>
        </Pressable>

        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1, gap: 20}}>
          <Pressable
            style={styles.streakButton}
            onPress={() => router.navigate('/')}
          >
            <ThemedText style={{ fontSize: 20, color: '#000' }}>
              Streak
            </ThemedText>
          </Pressable>

          <Pressable
            style={styles.rankingButton}
            onPress={() => router.navigate('/')}
          >
            <ThemedText style={{ fontSize: 20, color: '#000' }}>
              Leaderboard
            </ThemedText>
          </Pressable>
        </View>

      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2B2D3B',
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 20,
  },

  dailyPuzzleButton: {
    backgroundColor: '#D9D9D9',
    padding: 30,
    borderRadius: 10,
    width: '100%',
    height: 200,
  },
  dailyPuzzleButtonText: {
    fontSize: 30,
    lineHeight: 30,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#000',
  },
  dailyPuzzleButtonSplash: {
    fontSize: 20,
    lineHeight: 36,
    fontStyle: 'italic',
    textAlign: 'left',
    color: '#000',
  },

  streakButton: {
    backgroundColor: '#D9D9D9',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    height: 140,
    flex: 1,
  },

  rankingButton: {
    backgroundColor: '#D9D9D9',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    height: 140,
    flex: 2,
  }

});