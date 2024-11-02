import { router } from "expo-router";
import { CheckCircle } from "lucide-react-native";
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PaymentSuccessScreen = ({ route, navigation }: any) => {
  const paymentDetails = {
    transactionId: "4352 2748 3920",
    date: "1 September 2024",
    type: "Credit Card",
    nominal: "$150.45",
    admin: "$0.5",
    total: "$150.50",
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="items-center justify-center px-4 pt-12 pb-6">
        <View className="bg-green-50 rounded-full p-4 mb-4">
          <CheckCircle size={48} color={"#43eaba"} />
        </View>
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Payment successful
        </Text>
        <Text className="text-gray-600 text-base mb-8">
          Successfully paid {paymentDetails.total}
        </Text>
      </View>

      <View className="px-4 py-6">
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          Payment methods
        </Text>

        <View className="space-y-4">
          <View className="flex-row justify-between py-2">
            <Text className="text-gray-600">Transaction ID</Text>
            <Text className="text-gray-900">
              {paymentDetails.transactionId}
            </Text>
          </View>

          <View className="flex-row justify-between py-2">
            <Text className="text-gray-600">Date</Text>
            <Text className="text-gray-900">{paymentDetails.date}</Text>
          </View>

          <View className="flex-row justify-between py-2">
            <Text className="text-gray-600">Type of Transaction</Text>
            <Text className="text-gray-900">{paymentDetails.type}</Text>
          </View>

          <View className="flex-row justify-between py-2">
            <Text className="text-gray-600">Nominal</Text>
            <Text className="text-gray-900">{paymentDetails.nominal}</Text>
          </View>

          <View className="flex-row justify-between py-2">
            <Text className="text-gray-600">Admin</Text>
            <Text className="text-gray-900">{paymentDetails.admin}</Text>
          </View>

          <View className="flex-row justify-between py-2">
            <Text className="text-gray-600">Status</Text>
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
              <Text className="text-green-500">Success</Text>
            </View>
          </View>
        </View>

        <View className="mt-6 bg-primary rounded-lg p-4 flex-row justify-between items-center">
          <Text className="text-white font-medium">Total</Text>
          <Text className="text-white font-bold text-lg">
            {paymentDetails.total}
          </Text>
        </View>

        <TouchableOpacity
          className="mt-6 bg-secondary py-4 rounded-lg items-center"
          onPress={() => router.push("/")}
        >
          <Text className="text-white font-semibold text-base">
            Back to Home
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PaymentSuccessScreen;
