import React from "react";
import { Text, View, Image } from "react-native";
import Logo from "./logo";

interface HeaderProps {
  userProfileUrl?: string;
}

const Header: React.FC<HeaderProps> = ({
  userProfileUrl = "/api/placeholder/32/32",
}) => {
  return (
    <View className="mb-6 px-4">
      <View className="flex-row items-center justify-between mb-1">
        {/* <Logo /> */}
        <Text className="font-bold text-4xl">Busly</Text>
        <Image
          source={{ uri: userProfileUrl }}
          className="w-8 h-8 rounded-full"
        />
      </View>
      <Text className="text-base text-black">Find cheap bus tickets</Text>
    </View>
  );
};

export default Header;
