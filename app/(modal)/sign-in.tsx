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
import { login, sendOTP } from "@/actions/auth";

// Create a simplified schema for email-only login
const emailLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function CredentialsLoginView() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = async () => {
    try {
      setIsLoading(true);
      const validatedData = emailLoginSchema.parse({ email });
      setErrors({});

      const response = await sendOTP({ email: validatedData.email });

      if (response.success) {
        setOtpSent(true);
      } else {
        setErrors({ form: response.error || "Failed to send OTP" });
      }
    } catch (error) {
      console.error("Send OTP Error:", error);

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
          form: "Failed to send OTP. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setIsLoading(true);

      if (!otp || otp.trim() === "") {
        setErrors({ otp: "Please enter the OTP" });
        setIsLoading(false);
        return;
      }

      setErrors({});

      // Use the login function from your auth actions
      const response = await login({ email, otp });

      console.log({ response });

      if (response.success) {
        router.replace("/");
      } else {
        setErrors({ form: response.error || "Login failed" });
      }
    } catch (error) {
      console.error("Verification Error:", error);
      setErrors({
        form: "Verification failed. Please check your OTP and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isEmailValid = () => {
    try {
      emailLoginSchema.parse({ email });
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
                editable={!isLoading && !otpSent}
                autoCapitalize="none"
                returnKeyType="next"
              />
              {errors.email && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.email}
                </Text>
              )}
            </View>

            {otpSent && (
              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  One-Time Password
                </Text>
                <TextInput
                  className={`rounded-lg p-3 h-14 bg-gray-100 placeholder:text-black/60 ${
                    errors.otp ? "border border-red-500" : ""
                  }`}
                  placeholder="Enter the OTP sent to your email"
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={setOtp}
                  placeholderTextColor="#6B7280"
                  editable={!isLoading}
                  maxLength={6}
                  returnKeyType="done"
                  onSubmitEditing={handleVerifyOTP}
                />
                {errors.otp && (
                  <Text className="text-red-500 text-sm mt-1">
                    {errors.otp}
                  </Text>
                )}
              </View>
            )}

            <TouchableOpacity
              className={`rounded-lg p-4 h-14 bg-primary`}
              onPress={otpSent ? handleVerifyOTP : handleSendOTP}
              disabled={isLoading || (!otpSent && !isEmailValid())}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-center text-white font-semibold text-base">
                  {otpSent ? "Verify OTP" : "Send OTP"}
                </Text>
              )}
            </TouchableOpacity>

            {otpSent && (
              <TouchableOpacity
                className="mt-4"
                onPress={() => {
                  setOtpSent(false);
                  setOtp("");
                }}
                disabled={isLoading}
              >
                <Text className="text-center text-secondary">
                  Change email or resend OTP
                </Text>
              </TouchableOpacity>
            )}

            <View className="flex-row items-center my-8">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="mx-4 text-gray-500 uppercase font-medium shrink-0">
                or
              </Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>
            <SocialButtons />

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
