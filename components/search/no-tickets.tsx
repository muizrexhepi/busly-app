import React from "react";
import { View, Text } from "react-native";
import { CalendarX } from "lucide-react-native";

const NoTicketsAvailable = () => {
  return (
    <View className="w-11/12 mx-auto my-4 p-6 border border-gray-200 rounded-lg bg-[#f1f5f9] shadow">
      <View className="flex items-center mb-4">
        <CalendarX className="w-8 h-8 text-primary" />
        <Text className="text-xl font-semibold text-gray-700 mt-2">
          No Tickets Available
        </Text>
      </View>
      <Text className="text-center text-gray-600 mb-3">
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
