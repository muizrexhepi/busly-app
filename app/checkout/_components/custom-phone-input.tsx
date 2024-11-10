import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface CustomPhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  label: string;
  placeholder: string;
  validatePhoneNumber?: boolean;
}

const CustomPhoneInput: React.FC<CustomPhoneInputProps> = ({
  value,
  onChangeText,
  label,
  placeholder,
  validatePhoneNumber = true, // Default validation
}) => {
  const [isValid, setIsValid] = useState(true);

  const phoneRegex = /^\+\d{10,15}$/; // A simple regex to check 10 digits (adjust it for your needs)

  const handlePhoneChange = (text: string) => {
    onChangeText(text);

    // Validate phone number (if enabled)
    if (validatePhoneNumber) {
      setIsValid(phoneRegex.test(text)); // Set valid/invalid state based on regex
    }
  };

  return (
    <View className="space-y-1 mb-2">
      <Text className="text-sm text-gray-500">{label}</Text>

      <View className="flex-row items-center h-14 bg-secondary/10 rounded-xl px-4">
        <View className="flex-row items-center gap-3">
          <FontAwesome name="globe" size={24} color="#666" />
          <Text className="text-gray-500 text-sm">+MK</Text>
        </View>

        <TextInput
          value={value}
          onChangeText={handlePhoneChange}
          placeholder={placeholder}
          keyboardType="phone-pad"
          maxLength={15}
          className="flex-1 text-black text-base rounded-xl pl-2"
        />
      </View>

      {!isValid && (
        <Text className="text-red-500 text-sm mt-1">
          Please enter a valid phone number.
        </Text>
      )}
    </View>
  );
};

export default CustomPhoneInput;
