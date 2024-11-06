import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { PROFILE_LINKS } from "@/constants/data";

export default function ProfileTab() {
  return (
    <View className="h-full">
      <View className="w-full bg-primary p-6 pt-20">
        <Text className="text-2xl text-white font-bold mb-2">
          Discover GoBusly
        </Text>
        <Text className="text-base text-white/90 mb-4">
          Create an account for faster bookings, personalized travel, and
          exclusive deals!
        </Text>
        <View className="flex-row justify-between">
          <View className="items-center">
            <Ionicons name="flash-outline" size={24} color="#efefef" />
            <Text className="text-xs text-white/90 mt-1">Fast Booking</Text>
          </View>
          <View className="items-center">
            <Ionicons name="options-outline" size={24} color="#efefef" />
            <Text className="text-xs text-white/90 mt-1">Personalized</Text>
          </View>
          <View className="items-center">
            <Ionicons name="pricetag-outline" size={24} color="#efefef" />
            <Text className="text-xs text-white/90 mt-1">Exclusive Deals</Text>
          </View>
        </View>
      </View>
      <ScrollView className="flex-1 bg-white">
        <View className="rounded-lg px-4 overflow-hidden">
          {PROFILE_LINKS.map((link, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center py-4 border-b border-secondary/10"
              onPress={() => router.push(link.route)}
            >
              <Ionicons name={link.icon} size={24} color="#15203e" />
              <Text className="flex-1 ml-4 text-base text-primary">
                {link.title}
              </Text>
              <Ionicons
                name={
                  link.sublinks
                    ? "chevron-forward-outline"
                    : "arrow-forward-outline"
                }
                size={24}
                color="#C7C7CC"
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          className="mx-4 mt-6 bg-primary rounded-lg p-4 items-center"
          onPress={() => router.push("(modal)/sign-in")}
        >
          <Text className="text-lg font-bold text-white">Sign In</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
