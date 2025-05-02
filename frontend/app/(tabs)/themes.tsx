import React from "react";
import { GestureHandlerRootView, Pressable, ScrollView } from "react-native-gesture-handler";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { CheckerPreview } from "@/components/CheckerPreview";

// Define the list of available themes with name, text color, and base light/dark colors
const themes = [
  { name: "Default", textColor: "#FFD700", light: "#454A64", dark: "#FFF37E" },
  { name: "Light", textColor: "#000000", light: "#595959", dark: "#F1F1F1" },
  { name: "Dark", textColor: "#CCCCCC", light: "#191A21", dark: "#595959" },
  { name: "Mint", textColor: "green", light: "#29671C", dark: "#93FF8F" },
  { name: "Lavender", textColor: "purple", light: "#3C1044", dark: "#C88CF1" },
  { name: "Strawberry", textColor: "#FFC6F8", light: "#B12B55", dark: "#FFC6F8" },
  { name: "Blueberry", textColor: "navy", light: "#3D4AA5", dark: "#CEDFEF" },
  { name: "Thai Tea", textColor: "#9E5C46", light: "#340C0C", dark: "#9E5C46" },
  { name: "Terminal", textColor: "#7CFC00", light: "#191A1B", dark: "#78A616" },
  { name: "Midnight", textColor: "#FFFFFF", light: "#0C0E13", dark: "#60759F" },
];

// Utility function to blend two colors (used for theme row background)
function blendColors(color1: string, color2: string, ratio = 0.4): string {
  const hexToRgb = (hex: string) =>
    hex.replace(/^#/, "").match(/.{2}/g)?.map((x) => parseInt(x, 16)) || [0, 0, 0];

  const rgbToHex = (rgb: number[]) =>
    "#" + rgb.map((x) => Math.round(x).toString(16).padStart(2, "0")).join("");

  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  const blended = rgb1.map((c, i) => c * (1 - ratio) + rgb2[i] * ratio);

  return rgbToHex(blended as number[]);
}

// Main screen component that displays all themes
export default function ThemesScreen() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.header}>
          Select a Theme
        </ThemedText>

        {themes.map((theme, index) => {
          const blendedBackground = blendColors(theme.light, theme.dark, 0.4);

          return (
            <Pressable
              key={index}
              style={[styles.themeRow, { backgroundColor: blendedBackground }]}
            >
              <ThemedText style={{ ...styles.themeText, color: theme.textColor }}>
                {theme.name}
              </ThemedText>

              {/* CheckerPreview shows the chessboard color scheme */}
              <CheckerPreview lightColor={theme.light} darkColor={theme.dark} />
            </Pressable>
          );
        })}
      </ScrollView>
    </GestureHandlerRootView>
  );
}

// Define the component styles
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#2e2e48", // Background of the whole screen
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },
  themeRow: {
    flexDirection: "row", // Text and preview side by side
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    marginBottom: 12,
    borderRadius: 10, // Rounded corners
  },
  themeText: {
    fontWeight: "bold",
    fontSize: 18,
  },
});