import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from "react-native";
import { openBrowserAsync } from "expo-web-browser";
import { environment } from "@/environment";
import { useRouter } from "expo-router";
import { SocialButtons } from "@/components/social-buttons";
import { z } from "zod";
import { registerSchema } from "@/schemas";
import { register } from "@/actions/auth";
import { Eye, EyeOff } from "lucide-react-native";

export default function SignUpView() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      const validatedData = registerSchema.parse({
        fullName,
        email,
        password,
        confirmPassword,
      });
      setErrors({});

      const response = await register({
        fullName: validatedData.fullName,
        email: validatedData.email,
        password: validatedData.password,
      });

      if (response.success) {
        router.replace("/");
      } else {
        setErrors({ form: response.error || "Registration failed" });
      }
    } catch (error) {
      console.error("Signup Error:", error);
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        setErrors({
          form: "Something went wrong. Please try again later.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    try {
      registerSchema.parse({ fullName, email, password, confirmPassword });
      return true;
    } catch {
      return false;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView className="flex-1 px-6 py-8">
            <Text className="text-3xl font-bold text-primary mb-8">
              Sign Up
            </Text>

            {errors.form && (
              <Text className="text-red-500 text-sm mb-4 text-center">
                {errors.form}
              </Text>
            )}

            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </Text>
              <TextInput
                className={`rounded-lg p-3 h-14 bg-gray-100 placeholder:text-black/60 ${
                  errors.fullName ? "border border-red-500" : ""
                }`}
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={setFullName}
                placeholderTextColor="#6B7280"
                editable={!isLoading}
              />
              {errors.fullName && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.fullName}
                </Text>
              )}
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Email
              </Text>
              <TextInput
                className={`rounded-lg p-3 h-14 bg-gray-100 placeholder:text-black/60 ${
                  errors.email ? "border border-red-500" : ""
                }`}
                placeholder="Enter your email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#6B7280"
                editable={!isLoading}
                autoCapitalize="none"
              />
              {errors.email && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.email}
                </Text>
              )}
            </View>

            <PasswordInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              error={errors.password}
              editable={!isLoading}
              returnKeyType="next"
            />

            <PasswordInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              error={errors.confirmPassword}
              editable={!isLoading}
              returnKeyType="done"
              onSubmitEditing={isFormValid() ? handleSignUp : undefined}
            />
            <TouchableOpacity
              className={`rounded-lg p-3 h-14 bg-primary`}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-center text-white font-semibold text-base">
                  Sign Up
                </Text>
              )}
            </TouchableOpacity>
            <View className="flex-row items-center my-8">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="mx-4 text-gray-500 uppercase font-medium shrink-0">
                or
              </Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>
            <SocialButtons />

            <Text className="text-center text-sm text-gray-600 mt-8">
              By signing up, you agree to our{" "}
              <Text
                className="text-secondary underline"
                onPress={() => {
                  openBrowserAsync(
                    `${environment.base_url}/legal/terms-of-service`
                  );
                }}
              >
                Terms of Use
              </Text>{" "}
              and{" "}
              <Text
                className="text-secondary underline"
                onPress={() => {
                  openBrowserAsync(
                    `${environment.base_url}/legal/privacy-policy`
                  );
                }}
              >
                Privacy Policy
              </Text>
              .
            </Text>

            <TouchableOpacity
              className="mt-6"
              onPress={() => router.navigate("/(modal)/sign-in")}
              disabled={isLoading}
            >
              <Text className="text-center text-base text-primary">
                Already have an account?{" "}
                <Text className="font-semibold">Sign In</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export const PasswordInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  editable,
  returnKeyType,
  onSubmitEditing,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
  editable?: boolean;
  returnKeyType?: "next" | "done";
  onSubmitEditing?: () => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-gray-700 mb-2">{label}</Text>
      <View className="relative">
        <TextInput
          className={`rounded-lg pl-3 pr-12 h-14 bg-gray-100 placeholder:text-black/60 ${
            error ? "border border-red-500" : ""
          }`}
          placeholder={placeholder}
          secureTextEntry={!showPassword}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="#6B7280"
          editable={editable}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
        />
        <TouchableOpacity
          className="absolute right-3 top-3"
          onPress={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff size={24} color="#6B7280" />
          ) : (
            <Eye size={24} color="#6B7280" />
          )}
        </TouchableOpacity>
      </View>
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
};
