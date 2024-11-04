import React from "react";
import { View, ImageBackground } from "react-native";

export default function HomeBackground() {
  return (
    <View className="absolute top-0 left-0 right-0 h-full overflow-hidden">
      <ImageBackground
        source={require("@/assets/images/background2.jpg")}
        className="w-full h-full object-contain relative -top-1/2"
      />
    </View>
  );
}
