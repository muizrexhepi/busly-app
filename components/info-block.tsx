import { cn } from "@/lib/utils";
import { InfoIcon } from "lucide-react-native"; // Make sure this icon library is compatible with React Native
import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";

const InfoBlock = ({
  desc,
  title,
  href,
  className,
  required_full_url,
}: {
  desc: string;
  title: string;
  href?: string;
  className?: string;
  required_full_url?: boolean;
}) => {
  const handlePress = () => {
    const url = required_full_url ? href : `/partners/active-operators/${href}`;
    Linking.openURL(url!);
  };

  return (
    <View
      className={cn(
        "py-2 px-4 bg-secondary/5 rounded-lg mt-2 font-light",
        className
      )}
    >
      <View className="flex-row items-center gap-4 p-2">
        <InfoIcon color={"#080e2c"} />
        <View>
          <Text className="line-clamp-1 truncate">{desc} </Text>
          <TouchableOpacity onPress={handlePress}>
            <Text className="font-medium text-primary">{title}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default InfoBlock;
