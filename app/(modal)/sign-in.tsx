import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function SignInView() {
  const navigation = useNavigation();

  const signInOptions = [
    { title: "Continue with Email", icon: "mail-outline", color: "#34A853" },
    { title: "Continue with Apple", icon: "logo-apple", color: "#000000" },
    { title: "Continue with Google", icon: "logo-google", color: "#4285F4" },
    {
      title: "Continue with Facebook",
      icon: "logo-facebook",
      color: "#1877F2",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 py-8">
        <Text className="text-3xl font-bold text-primary mb-8">Sign In</Text>

        <Text className="text-base text-gray-600 mb-8">
          Choose your preferred sign-in method to access your GoBusly account
          and enjoy personalized travel experiences.
        </Text>

        {signInOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center bg-gray-100 rounded-lg p-4 mb-4"
            onPress={() => {
              // Handle sign in logic here
              console.log(`Signing in with ${option.title}`);
            }}
          >
            <Ionicons name={option.icon} size={24} color={option.color} />
            <Text className="ml-4 text-base font-semibold text-primary">
              {option.title}
            </Text>
          </TouchableOpacity>
        ))}

        <Text className="text-center text-sm text-gray-600 mt-8">
          By continuing, you agree to our{" "}
          <Text
            className="text-secondary underline"
            // onPress={() => navigation.navigate('TermsOfUse')}
          >
            Terms of Use
          </Text>{" "}
          and{" "}
          <Text
            className="text-secondary underline"
            // onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            Privacy Policy
          </Text>
          .
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
