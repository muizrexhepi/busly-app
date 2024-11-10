import React from "react";
import { View, Text } from "react-native";
import { CardField } from "@stripe/stripe-react-native";
import { useCheckoutStore } from "@/store";

const PaymentMethod = () => {
  const { setCardDetails } = useCheckoutStore();

  return (
    <View className="my-4">
      <View className="bg-white rounded-xl shadow-md overflow-hidden">
        <View className="p-4">
          <Text className="text-[#353535] font-medium text-2xl">
            Payment Method
          </Text>
          <Text className="text-base text-gray-600 my-4">
            Please enter your credit card information to complete the payment.
          </Text>

          <Text className="font-medium text-gray-700">
            Credit Card Information
          </Text>
          <CardField
            postalCodeEnabled={false}
            onCardChange={setCardDetails}
            style={{
              height: 50,
              marginVertical: 8,
            }}
            cardStyle={{
              backgroundColor: "#FFFFFF",
              textColor: "#000000",
              borderRadius: 10,
              borderColor: "#4b5563",
              borderWidth: 1,
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default PaymentMethod;
