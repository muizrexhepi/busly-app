import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { PROFILE_LINKS } from "@/constants/data";
import { logout } from "@/actions/auth";
import { useAuth } from "@/contexts/auth-provider";
import useUser from "@/hooks/use-user";

const LoggedInUserView = ({ user }: any) => (
  <View className="w-full bg-primary p-4 pt-20">
    <View className="flex-row items-center mb-4">
      <Image
        source={{
          uri: user.profilePicture || "https://example.com/default-avatar.jpg",
        }}
        className="w-20 h-20 rounded-full bg-white mr-4"
      />
      <View>
        <Text className="text-2xl text-white font-bold">{user.name}</Text>
        <Text className="text-base text-white/90">{user.email}</Text>
      </View>
    </View>
  </View>
);

const GuestView = () => (
  <View className="w-full bg-primary p-6 pt-20">
    <Text className="text-2xl text-white font-bold mb-2">Discover GoBusly</Text>
    <Text className="text-base text-white/90 mb-4">
      Create an account for faster bookings, personalized travel, and exclusive
      deals!
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
);

export default function ProfileTab() {
  const { user, loading, refreshUser } = useUser();

  console.log({ user });
  if (loading) {
    return (
      <View className="h-full flex items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="h-full">
      {user ? <LoggedInUserView user={user} /> : <GuestView />}
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

        {!user ? (
          <View className="m-4">
            <TouchableOpacity
              className="bg-primary rounded-lg p-4 items-center"
              onPress={() => router.push("/(modal)/sign-in")}
            >
              <Text className="text-lg font-bold text-white">Sign In</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            className="flex-row mx-4 items-center py-4 border-b border-secondary/10"
            onPress={async () => {
              await logout();
              refreshUser();
              router.replace("/");
            }}
          >
            <Ionicons name={"exit"} size={24} color="#ff007f" />
            <Text className="flex-1 ml-4 text-base text-[#ff007f]">Logout</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
