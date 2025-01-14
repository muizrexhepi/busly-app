import { useState } from "react";
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
import { useRouter } from "expo-router";
import { SocialButtons } from "@/components/social-buttons";
import { z } from "zod";
import { openBrowserAsync } from "expo-web-browser";
import { environment } from "@/environment";
import { login } from "@/actions/auth";
import { Eye, EyeOff } from "lucide-react-native";
import { loginSchema } from "@/schemas";
// import { account, appwriteLogin } from "@/lib/appwrite";

export default function SignInView() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // const handleSignIn = async () => {
  //   try {
  //     // Validate data using the schema
  //     const validatedData = loginSchema.parse({
  //       email,
  //       password,
  //     });

  //     // Call login function
  //     await appwriteLogin(validatedData.email, validatedData.password);

  //     // Fetch the current session to confirm login success
  //     const session = await account.get();
  //     console.log("Login successful:", session);
  //   } catch (error: any) {
  //     // Handle error (e.g., invalid credentials)
  //     console.error("Login failed:", error.message || error);
  //   }
  // };

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const validatedData = loginSchema.parse({
        email,
        password,
      });
      setErrors({});

      const response = await login({
        email: validatedData.email,
        password: validatedData.password,
      });

      if (response.success) {
        router.replace("/");
      } else {
        setErrors({ form: response.error || "Registration failed" });
      }
    } catch (error) {
      console.error("Signin Error:", error);

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
          form: "Sign in failed. Please check your credentials and try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    try {
      loginSchema.parse({ email, password });
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
              Sign In
            </Text>

            {errors.form && (
              <Text className="text-red-500 text-sm mb-4 text-center">
                {errors.form}
              </Text>
            )}

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
                returnKeyType="next"
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
              placeholder="Enter your password"
              error={errors.password}
              editable={!isLoading}
              returnKeyType="done"
              onSubmitEditing={isFormValid() ? handleSignIn : undefined}
            />

            <TouchableOpacity
              // onPress={() => router.push("/(modal)/forgot-password")}
              className="mb-6"
            >
              <Text className="text-right text-secondary text-sm">
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`rounded-lg p-4 h-14 bg-primary`}
              onPress={handleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-center text-white font-semibold text-base">
                  Sign In
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

            <TouchableOpacity
              className="mt-4"
              onPress={() => router.push("/(modal)/sign-up")}
              disabled={isLoading}
            >
              <Text className="text-center text-base text-primary">
                Don't have an account?{" "}
                <Text className="font-semibold">Sign Up</Text>
              </Text>
            </TouchableOpacity>

            <Text className="text-center text-sm text-gray-600 mt-8">
              By continuing, you agree to our{" "}
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
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const PasswordInput = ({
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
