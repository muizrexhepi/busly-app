import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import useSearchStore from "@/store"; // Adjust the import path as needed
import { useNavigation } from "expo-router";

type PassengerSelectProps = {
  updateUrl?: boolean; // New prop to manage URL update logic if necessary
  title?: string;
};

const PassengerSelect = ({
  updateUrl = false,
  title,
}: PassengerSelectProps) => {
  const { passengers, setPassengers } = useSearchStore();
  const navigation = useNavigation();

  // Update passengers and optionally the URL
  const updatePassengers = (updatedPassengers: {
    adults: number;
    children: number;
  }) => {
    setPassengers(updatedPassengers);

    if (updateUrl) {
      // Add URL updating logic here if needed
    }
  };

  // Handle confirm action
  const handleConfirm = () => {
    updatePassengers(passengers); // No need to reassign since we're using store directly
    navigation.goBack();
  };

  // Increment/Decrement logic
  const incrementPassengers = (type: "adults" | "children") => {
    const maxCount = type === "adults" ? 9 : 9; // Adjust max if needed
    const newCount =
      type === "adults" ? passengers.adults + 1 : passengers.children + 1;

    if (type === "adults") {
      if (newCount <= maxCount) {
        updatePassengers({ adults: newCount, children: passengers.children });
      }
    } else {
      if (newCount <= maxCount) {
        updatePassengers({ adults: passengers.adults, children: newCount });
      }
    }
  };

  const decrementPassengers = (type: "adults" | "children") => {
    const newCount =
      type === "adults" ? passengers.adults - 1 : passengers.children - 1;

    if (type === "adults" && newCount >= 1) {
      updatePassengers({ adults: newCount, children: passengers.children });
    } else if (type === "children" && newCount >= 0) {
      updatePassengers({ adults: passengers.adults, children: newCount });
    }
  };

  return (
    <View className="flex-1 px-4 h-full bg-white">
      <View className="flex-row justify-between items-center mt-4">
        <View>
          <Text className="text-lg font-semibold">Adults</Text>
          <Text className="text-gray-500">Age 13+</Text>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => decrementPassengers("adults")}
            disabled={passengers.adults <= 1}
            className={`p-2 ${passengers.adults <= 1 ? "opacity-50" : ""}`}
          >
            <AntDesign
              name="minus"
              size={20}
              color={passengers.adults <= 1 ? "#999" : "#000"}
            />
          </TouchableOpacity>
          <Text className="mx-2 text-lg">{passengers.adults}</Text>
          <TouchableOpacity
            onPress={() => incrementPassengers("adults")}
            disabled={passengers.adults >= 9}
            className={`p-2 ${passengers.adults >= 9 ? "opacity-50" : ""}`}
          >
            <AntDesign
              name="plus"
              size={20}
              color={passengers.adults >= 9 ? "#999" : "#000"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Children Selection */}
      <View className="flex-row justify-between items-center mt-4">
        <View>
          <Text className="text-lg font-semibold">Children</Text>
          <Text className="text-gray-500">Age 2-12</Text>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => decrementPassengers("children")}
            disabled={passengers.children <= 0}
            className={`p-2 ${passengers.children <= 0 ? "opacity-50" : ""}`}
          >
            <AntDesign
              name="minus"
              size={20}
              color={passengers.children <= 0 ? "#999" : "#000"}
            />
          </TouchableOpacity>
          <Text className="mx-2 text-lg">{passengers.children}</Text>
          <TouchableOpacity
            onPress={() => incrementPassengers("children")}
            disabled={passengers.children >= 9}
            className={`p-2 ${passengers.children >= 9 ? "opacity-50" : ""}`}
          >
            <AntDesign
              name="plus"
              size={20}
              color={passengers.children >= 9 ? "#999" : "#000"}
            />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={handleConfirm}
        className="h-14 bg-primary rounded-lg items-center justify-center mt-4"
      >
        <Text className="text-white font-semibold">Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PassengerSelect;
