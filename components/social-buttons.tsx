import { Text, TouchableOpacity, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as AppleAuthentication from "expo-apple-authentication";
import { useState, useEffect } from "react";
import { appleLogin } from "@/actions/oauth";
import useUser from "@/hooks/use-user";
import { router } from "expo-router";

export const SocialButtons = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const { refreshUser } = useUser();

  useEffect(() => {
    const checkAppleAuthentication = async () => {
      const available = await AppleAuthentication.isAvailableAsync();
      setIsAvailable(available);
    };

    checkAppleAuthentication();
  }, []);

  return (
    <View>
      <TouchableOpacity
        className="flex-row items-center bg-gray-100 rounded-lg px-4 h-14 mb-3"
        onPress={() => {}}
      >
        <AntDesign name="google" size={24} color="black" />
        <Text className="ml-4 text-base font-semibold text-primary">
          Continue with Google
        </Text>
      </TouchableOpacity>

      {isAvailable && (
        <TouchableOpacity
          className="flex-row items-center bg-black rounded-lg px-4 h-14 mb-3"
          onPress={async () => {
            const result = await appleLogin();
            if (result.success) {
              refreshUser();
              router.replace("/");
              console.log("Apple login successful, token:", result.token);
            } else {
              console.error("Apple login failed:", result.error);
            }
          }}
        >
          <AntDesign name="apple1" size={24} color="white" />
          <Text className="ml-4 text-base font-semibold text-white">
            Continue with Apple
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        className="flex-row items-center bg-blue-600 rounded-lg px-4 h-14 mb-3"
        onPress={() => {}}
      >
        <AntDesign name="facebook-square" size={24} color="white" />
        <Text className="ml-4 text-base font-semibold text-white">
          Continue with Facebook
        </Text>
      </TouchableOpacity>
    </View>
  );
};
