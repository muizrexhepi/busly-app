import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useStripe } from "@stripe/stripe-react-native";
import axios from "axios";
import { environment } from "@/environment";
import { useCheckoutStore, useDepositStore } from "@/store";
import { Ticket } from "@/models/ticket";
import { calculatePassengerPrices } from "@/hooks/use-passengers";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface PaymentButtonProps {
  loading: boolean;
  totalPrice: number;
}

export const PaymentButton = ({ loading, totalPrice }: PaymentButtonProps) => {
  const stripe = useStripe();
  const router = useRouter();

  const [balance, setBalance] = useState<number>(0);
  const { useDeposit, setDepositAmount, setUseDeposit, depositAmount } =
    useDepositStore();
  const {
    passengers,
    outboundTicket,
    returnTicket,
    selectedFlex,
    flexPrice,
    setSelectedFlex,
    resetCheckout,
    cardDetails,
  } = useCheckoutStore();

  useEffect(() => {
    if (!selectedFlex) {
      setSelectedFlex("no_flex");
    }
  }, [selectedFlex]);

  const calculateTicketTotal = (ticket: Ticket) => {
    const adultPrice = ticket.stops[0].other_prices.our_price;
    const childPrice = ticket.stops[0].other_prices.our_children_price;
    const adultCount = passengers.filter((p) => p.age > 10).length;
    const childCount = passengers.filter((p) => p.age <= 10).length;
    return adultPrice * adultCount + childPrice * childCount;
  };

  const outboundTotal = outboundTicket
    ? calculateTicketTotal(outboundTicket)
    : 0;
  const returnTotal = returnTicket ? calculateTicketTotal(returnTicket) : 0;
  const totalPriceWithFlex = outboundTotal + returnTotal + flexPrice;

  const finalPrice = useDeposit
    ? Math.max(totalPriceWithFlex - depositAmount, 0)
    : totalPriceWithFlex;

  const handleFullDepositPayment = async () => {
    try {
      await createBookings("full_deposit_payment");
      resetCheckout();
      router.push("/checkout/success");
    } catch (error: any) {
      console.error("Full deposit payment error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "An error occurred during full deposit payment."
      );
    }
  };

  const handlePayment = async () => {
    if (!stripe || !cardDetails?.complete) {
      Alert.alert(
        "Error",
        "Card details are incomplete or Stripe is not initialized."
      );
      return;
    }

    try {
      const res = await axios.post<{ data: { clientSecret: string } }>(
        `${environment.apiurl}/payment/create-payment-intent`,
        { passengers, amount_in_cents: finalPrice * 100 }
      );

      console.log("Payment Intent Response:", res.data);
      const { clientSecret } = res.data.data;

      const { error: confirmError, paymentIntent } =
        await stripe.confirmPayment(clientSecret, {
          paymentMethodType: "Card",
        });

      if (confirmError) {
        console.error("Payment confirmation error:", confirmError);
        Alert.alert(
          "Payment Error",
          confirmError.message ||
            "An error occurred during payment confirmation."
        );
      } else if (paymentIntent?.status === "Succeeded") {
        console.log("Payment successful:", paymentIntent);
        await createBookings(paymentIntent.id);
        router.push("/checkout/success");
      } else {
        console.warn(
          "Payment not successful. Payment Intent status:",
          paymentIntent?.status
        );
        Alert.alert(
          "Payment Status",
          "Payment was not successful. Please try again."
        );
      }
    } catch (err: any) {
      console.error("Payment process error:", err);
      Alert.alert(
        "Error",
        err.response?.data?.message ||
          "An error occurred during payment processing."
      );
    } finally {
      resetCheckout();
    }
  };

  const createBookings = async (paymentIntentId: string) => {
    const bookings = [];

    if (outboundTicket) {
      const outboundBooking = await createBooking(
        outboundTicket,
        false,
        paymentIntentId
      );
      bookings.push(outboundBooking);
    }

    if (returnTicket) {
      const returnBooking = await createBooking(
        returnTicket,
        true,
        paymentIntentId
      );
      bookings.push(returnBooking);
    }

    return bookings;
  };

  const createBooking = async (
    ticket: Ticket,
    isReturn: boolean,
    paymentIntentId: string
  ) => {
    const departure_station = ticket.stops[0].from._id;
    const arrival_station = ticket.stops[0].to._id;
    const passengersWithPrices = calculatePassengerPrices(passengers, ticket);
    const ticketTotal = isReturn ? returnTotal : outboundTotal;

    try {
      const response = await axios.post(
        `${environment.apiurl}/booking/create/${ticket.operator}/${null}/${
          ticket._id
        }`,
        {
          passengers: passengersWithPrices,
          travel_flex: selectedFlex,
          payment_intent_id: paymentIntentId,
          platform: "mobile",
          flex_price: isReturn ? 0 : flexPrice,
          total_price: ticketTotal + (isReturn ? 0 : flexPrice),
          operator_price: outboundTotal + returnTotal,
          departure_station,
          arrival_station,
          is_return: isReturn,
        }
      );

      console.log("Booking created successfully:", response.data);
      if (typeof global !== "undefined") {
        const savedBookings =
          (await AsyncStorage.getItem("noUserBookings")) || "[]";
        const newBooking = response.data.data;
        const allBookings = [...JSON.parse(savedBookings), newBooking];
        await AsyncStorage.setItem(
          "noUserBookings",
          JSON.stringify(allBookings)
        );
      }
      return response.data.data;
    } catch (error: any) {
      console.error("Error creating booking:", error);
      Alert.alert(
        "Booking Error",
        error.response?.data?.message ||
          "An error occurred while creating the booking."
      );
    }
  };

  return (
    <TouchableOpacity
      className="py-2 mt-4 bg-primary flex justify-center items-center h-16 rounded-lg flex-1"
      disabled={loading}
      onPress={
        totalPrice <= depositAmount ? handleFullDepositPayment : handlePayment
      }
    >
      <Text className="text-white font-medium text-lg">
        {loading ? "Processing payment" : "Complete payment"}
      </Text>
    </TouchableOpacity>
  );
};
