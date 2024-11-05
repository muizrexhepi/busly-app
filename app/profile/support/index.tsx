import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SUPPORT_LINKS } from "@/constants/data";

export default function SettingsPage() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="rounded-lg px-4 overflow-hidden">
        {SUPPORT_LINKS.map((link, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center py-4 border-b border-secondary/10"
            // onPress={() => navigation.navigate(link.route)}
          >
            <Ionicons name={link.icon} size={24} color="#15203e" />
            <Text className="flex-1 ml-4 text-base text-primary">
              {link.title}
            </Text>
            <Ionicons
              name="chevron-forward-outline"
              size={24}
              color="#C7C7CC"
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
