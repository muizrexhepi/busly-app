import React from "react";
import PassengerInfo from "./_components/passenger-info";
import { ScrollView, View } from "react-native";
import { BookingDetails } from "./_components/booking-details";
import CheckoutPrice from "./_components/booking-price";
import Extras from "./_components/extras-info";
import PaymentMethod from "./_components/payment-method";

const Checkout = () => {
  return (
    <ScrollView className="h-full bg-gray-100 pb-40">
      <PassengerInfo />
      <Extras />
      <PaymentMethod />
      <CheckoutPrice />
      <BookingDetails />
    </ScrollView>
  );
};

export default Checkout;
