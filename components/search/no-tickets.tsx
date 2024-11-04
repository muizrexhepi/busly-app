import React from "react";
import { View, Text } from "react-native";
import { CalendarX } from "lucide-react-native";

const NoTicketsAvailable = () => {
  return (
    <View className="w-full px-4 py-8" accessibilityRole="alert">
      <View className="flex items-center mb-6">
        <CalendarX className="w-12 h-12 text-gray-400" />
      </View>
      <Text
        className="text-2xl font-semibold text-gray-800 text-center mb-4"
        accessibilityRole="header"
      >
        No Tickets Available
      </Text>
      <Text className="text-center text-gray-600 mb-4">
        We couldn't find any tickets that match your search criteria. This might
        be due to the route, date, or current availability.
      </Text>
      <Text className="text-center text-sm text-gray-500">
        Try adjusting your search parameters or selecting a different date.
      </Text>
    </View>
  );
};

export default NoTicketsAvailable;
