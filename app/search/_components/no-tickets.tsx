import React from "react";
import { View, Text } from "react-native";
import { SvgXml } from "react-native-svg";

const NoTicketsAvailable = () => {
  // Paste the actual content of your SVG file here
  const svgXmlData = `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <!-- Your SVG content here -->
    <circle cx="50" cy="50" r="40" fill="#f0f0f0" />
    <path d="M30 40 L50 60 L70 40" stroke="#666" stroke-width="2" fill="none" />
  </svg>`;

  return (
    <View className="w-full px-4 py-8" accessibilityRole="alert">
      <View className="flex items-center mb-6">
        <SvgXml xml={svgXmlData} width={100} height={100} />
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
