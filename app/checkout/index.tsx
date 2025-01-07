import React from "react";
import PassengerInfo from "./_components/passenger-info";
import { ScrollView } from "react-native";
import { BookingDetails } from "./_components/booking-details";
import Extras from "./_components/extras-info";
import PaymentMethod from "./_components/payment-method";

const Checkout = () => {
  return (
    <ScrollView
      keyboardDismissMode="on-drag"
      className="h-full bg-gray-100"
      contentInsetAdjustmentBehavior="automatic"
    >
      <PassengerInfo />
      <Extras />
      <PaymentMethod />
      <BookingDetails />
    </ScrollView>
  );
};

export default Checkout;
