import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export function BackgroundGradient({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <LinearGradient
      colors={["#000", "#feb47b"]}
      style={styles.gradientContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.innerContainer}>
        <Text className="text-black font-medium text-lg">HIS</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 55,
  },
  innerContainer: {
    backgroundColor: "transparent",
  },
});
