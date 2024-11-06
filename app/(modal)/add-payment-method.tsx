import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

const AddPaymentMethod = () => {
  const [newCard, setNewCard] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });

  const formatCardNumber = (text: any) => {
    const cleaned = text.replace(/\s/g, "");
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(" ").substr(0, 19);
  };

  const formatExpiryDate = (text: any) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const formatName = (text: any) => {
    return text.replace(/[^a-zA-Z\s'-]/g, "");
  };

  const handleCardNumberChange = (text: any) => {
    const formatted = formatCardNumber(text.replace(/\D/g, ""));
    setNewCard({ ...newCard, number: formatted });
  };

  const handleExpiryChange = (text: any) => {
    const formatted = formatExpiryDate(text);
    setNewCard({ ...newCard, expiry: formatted });
  };

  const handleCVCChange = (text: any) => {
    const cleaned = text.replace(/\D/g, "").substr(0, 3);
    setNewCard({ ...newCard, cvc: cleaned });
  };

  const handleNameChange = (text: any) => {
    const formatted = formatName(text);
    setNewCard({ ...newCard, name: formatted });
  };

  const addNewCard = () => {
    const newPaymentMethod = {
      id: Date.now().toString(),
      type: "card",
      last4: newCard.number.replace(/\s/g, "").slice(-4),
      expiryDate: newCard.expiry,
      cardBrand: "New Card",
    };
    setNewCard({ number: "", expiry: "", cvc: "", name: "" });
  };

  return (
    <View className="p-6 bg-white flex-1 rounded-xl">
      <View>
        <Text className="text-sm font-medium text-gray-700 mb-1">
          Card Number
        </Text>
        <TextInput
          className="border border-gray-200 p-3 rounded-lg bg-gray-50"
          placeholder="1234 5678 9012 3456"
          value={newCard.number}
          onChangeText={handleCardNumberChange}
          keyboardType="numeric"
          maxLength={19}
        />
      </View>

      <View className="flex-row gap-4 mt-4">
        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Expiry Date
          </Text>
          <TextInput
            className="border border-gray-200 p-3 rounded-lg bg-gray-50"
            placeholder="MM/YY"
            value={newCard.expiry}
            onChangeText={handleExpiryChange}
            keyboardType="numeric"
            maxLength={5}
          />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-700 mb-1">CVC</Text>
          <TextInput
            className="border border-gray-200 p-3 rounded-lg bg-gray-50"
            placeholder="123"
            value={newCard.cvc}
            onChangeText={handleCVCChange}
            keyboardType="numeric"
            maxLength={3}
            secureTextEntry
          />
        </View>
      </View>

      <View className="mt-4">
        <Text className="text-sm font-medium text-gray-700 mb-1">
          Name on Card
        </Text>
        <TextInput
          className="border border-gray-200 p-3 rounded-lg bg-gray-50"
          placeholder="John Doe"
          value={newCard.name}
          onChangeText={handleNameChange}
          autoCapitalize="words"
        />
      </View>

      <TouchableOpacity
        className="mt-6 bg-primary p-4 rounded-xl"
        onPress={addNewCard}
      >
        <Text className="text-white font-semibold text-center">Add Card</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddPaymentMethod;
