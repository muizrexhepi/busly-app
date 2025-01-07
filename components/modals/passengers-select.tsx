import React, { useCallback, useRef } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import useSearchStore from "@/store";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

type PassengerSelectProps = {
  updateUrl?: boolean;
  title?: string;
  passengerDescription: string;
};

const PassengerSelect = ({
  updateUrl = false,
  title,
  passengerDescription,
}: PassengerSelectProps) => {
  const { passengers, setPassengers } = useSearchStore();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const updatePassengers = (updatedPassengers: {
    adults: number;
    children: number;
  }) => {
    setPassengers(updatedPassengers);

    if (updateUrl) {
    }
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleConfirm = () => {
    updatePassengers(passengers);
    bottomSheetModalRef.current?.dismiss();
  };

  const incrementPassengers = (type: "adults" | "children") => {
    const maxCount = 9;
    const newCount =
      type === "adults" ? passengers.adults + 1 : passengers.children + 1;

    if (type === "adults" && newCount <= maxCount) {
      updatePassengers({ adults: newCount, children: passengers.children });
    } else if (type === "children" && newCount <= maxCount) {
      updatePassengers({ adults: passengers.adults, children: newCount });
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
    <>
      <Pressable
        className="flex-row items-center h-16 bg-secondary/10 rounded-xl px-4"
        accessibilityRole="button"
        accessibilityLabel="Select number of passengers"
        onPress={handlePresentModalPress}
      >
        <View className="flex-row items-center gap-3 flex-1">
          <View className="w-8 h-8 rounded-full items-center justify-center">
            <FontAwesome name="user" size={24} color="gray" />
          </View>
          <View>
            <Text className="text-gray-500 text-sm">Passengers</Text>
            <Text className="text-black font-medium">
              {passengerDescription || "Select passengers"}
            </Text>
          </View>
        </View>
      </Pressable>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={["50%"]}
        index={1}
        enableDismissOnClose
      >
        <BottomSheetView className="flex-1 px-4 h-full bg-white ">
          {/* Header */}
          <View className="mb-4">
            <Text className="text-xl font-semibold">Select Passengers</Text>
            <Text className="text-gray-500 text-sm">
              Choose the number of passengers for your trip.
            </Text>
          </View>

          {/* Adults Selection */}
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
                className={`p-2 ${
                  passengers.children <= 0 ? "opacity-50" : ""
                }`}
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
                className={`p-2 ${
                  passengers.children >= 9 ? "opacity-50" : ""
                }`}
              >
                <AntDesign
                  name="plus"
                  size={20}
                  color={passengers.children >= 9 ? "#999" : "#000"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            onPress={handleConfirm}
            className="h-14 bg-primary rounded-lg items-center justify-center mt-6"
          >
            <Text className="text-white font-semibold">Confirm Selection</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};

export default PassengerSelect;
