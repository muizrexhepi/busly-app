import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { CreditCard, Play, Trash2, Plus, X } from "lucide-react-native";

type PaymentMethod = {
  id: string;
  type: "card" | "paypal";
  last4?: string;
  expiryDate?: string;
  cardBrand?: string;
  email?: string;
};

const PaymentMethodItem = ({
  method,
  onDelete,
}: {
  method: PaymentMethod;
  onDelete: () => void;
}) => (
  <View className="flex-row items-center justify-between bg-white rounded-xl p-4 mb-3 shadow-sm">
    <View className="flex-row items-center gap-4">
      {method.type === "card" ? (
        <CreditCard size={24} color="#1a237e" strokeWidth={1.5} />
      ) : (
        <Play size={24} color="#003087" strokeWidth={1.5} />
      )}
      <View>
        <Text className="font-semibold text-gray-800 text-base">
          {method.type === "card"
            ? `${method.cardBrand} •••• ${method.last4}`
            : "PayPal"}
        </Text>
        {method.type === "card" ? (
          <Text className="text-gray-500 text-sm">
            Expires {method.expiryDate}
          </Text>
        ) : (
          <Text className="text-gray-500 text-sm">{method.email}</Text>
        )}
      </View>
    </View>
    <TouchableOpacity
      className="p-2 rounded-full hover:bg-red-50"
      onPress={onDelete}
    >
      <Trash2 size={20} color="#ef4444" strokeWidth={1.5} />
    </TouchableOpacity>
  </View>
);

const PaymentMethodsScreen = () => {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "card",
      last4: "4242",
      expiryDate: "12/24",
      cardBrand: "Visa",
    },
    { id: "2", type: "paypal", email: "user@example.com" },
  ]);

  const deletePaymentMethod = (id: string) => {
    setPaymentMethods((methods) =>
      methods.filter((method) => method.id !== id)
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        className="flex-1 bg-gray-50"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View className="p-4 pb-32">
          <Text className="text-gray-600 mb-6">
            Manage your saved payment methods and add new ones. Your payment
            information is securely stored for future transactions.
          </Text>
          <View className="gap-3">
            {paymentMethods.map((method) => (
              <PaymentMethodItem
                key={method.id}
                method={method}
                onDelete={() => deletePaymentMethod(method.id)}
              />
            ))}
          </View>
          <TouchableOpacity
            className="mt-4 flex-row items-center justify-center gap-2 bg-primary p-4 rounded-xl"
            onPress={() => router.push("/(modal)/add-payment-method")}
          >
            <Plus size={20} color="#ffffff" strokeWidth={1.5} />
            <Text className="text-white font-semibold">Add New Card</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PaymentMethodsScreen;
