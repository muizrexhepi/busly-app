import React from "react";
import { LinearGradient } from "expo-linear-gradient";

export function BackgroundGradient({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <LinearGradient
      colors={["#ff6700", "#ff007f"]}
      style={{ borderRadius: 8, height: "auto", marginBottom: 16 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
}
