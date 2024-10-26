import React from "react";
import { View, Text } from "react-native";
import { CalendarX } from "lucide-react-native"; // Make sure you import the correct icons for React Native

const NoTicketsAvailable = () => {
  return (
    <View className="w-full mx-auto text-center p-4 border border-gray-300 rounded-lg bg-white shadow-md">
      <View className="mb-2">
        <View className="flex flex-row items-center justify-center space-x-2">
          <CalendarX className="w-6 h-6 text-gray-400" />
          <Text className="text-lg font-bold">No Tickets Available</Text>
        </View>
      </View>
      <View className="mb-4">
        <Text className="text-gray-600 max-w-md text-center mx-auto">
          We couldn't find any tickets matching your search criteria. This could
          be due to the route, date, or availability.
        </Text>
      </View>
      <View className="flex flex-col items-center">
        <Text className="text-sm text-gray-500 max-w-md text-center mx-auto">
          Try adjusting your search parameters or selecting a different date.
        </Text>
        {/* Uncomment if you want to add a button */}
        {/* <Button title="Adjust Search" onPress={handleAdjustSearch} className="mt-4" /> */}
      </View>
    </View>
  );
};

export default NoTicketsAvailable;
