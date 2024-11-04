import React from "react";
import PassengerInfo from "./_components/passenger-info";
import { ScrollView, View } from "react-native";
import { BookingDetails } from "./_components/booking-details";
import Extras from "./_components/extras-info";
import PaymentMethod from "./_components/payment-method";
import { StripeProvider } from "@stripe/stripe-react-native";

const Checkout = () => {
  return (
    <ScrollView className="h-full bg-gray-100">
      <StripeProvider
        merchantIdentifier="merchant.identifier"
        publishableKey="pk_test_51K1DdaDAZApOs2EVXCiMmQnlAa9TIqCpnuhrDrpiKqdTGuGlNvbbyYnaEPgl2m0Qg2WfBC6r6j2wfP2jLdDwPdnm00D2bcqz6v"
      >
        <PassengerInfo />
        <Extras />
        <PaymentMethod />
        <BookingDetails />
      </StripeProvider>
    </ScrollView>
  );
};

export default Checkout;
