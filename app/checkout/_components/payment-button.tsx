import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useStripe } from "@stripe/stripe-react-native";
import axios from "axios";
import { environment } from "@/environment";
import { useCheckoutStore, useDepositStore } from "@/store";
import { Ticket } from "@/models/ticket";
import { calculatePassengerPrices } from "@/hooks/use-passengers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as TaskManager from 'expo-task-manager';

interface PaymentButtonProps {
  loading: boolean;
  totalPrice: number;
}

export const PaymentButton = ({
  loading: externalLoading,
  totalPrice,
}: PaymentButtonProps) => {
  const stripe = useStripe();
  const router = useRouter();
  const [internalLoading, setInternalLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const platform = Platform.OS.toLowerCase();
  const loading = externalLoading || internalLoading || isProcessing;

  const { useDeposit, depositAmount } = useDepositStore();

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
    if (!ticket || !ticket.stops || !ticket.stops[0]) {
      return 0;
    }

    const adultPrice = ticket.stops[0].other_prices?.our_price || 0;
    const childPrice = ticket.stops[0].other_prices?.our_children_price || 0;
    const adultCount = passengers.filter((p) => p.age > 10).length;
    const childCount = passengers.filter((p) => p.age <= 10).length;

    return adultPrice * adultCount + childPrice * childCount;
  };

  const calculateOperatorTicketTotal = (ticket: Ticket) => {
    if (!ticket || !ticket.stops || !ticket.stops[0]) {
      return 0;
    }

    const adultPrice = ticket.stops[0].price || 0;
    const childPrice = ticket.stops[0].children_price || 0;
    const adultCount = passengers.filter((p) => p.age > 10).length;
    const childCount = passengers.filter((p) => p.age <= 10).length;

    return adultPrice * adultCount + childPrice * childCount;
  };

  const outboundTotal = outboundTicket
    ? calculateTicketTotal(outboundTicket)
    : 0;
  const returnTotal = returnTicket ? calculateTicketTotal(returnTicket) : 0;
  const operatorOutboundTotal = outboundTicket
    ? calculateOperatorTicketTotal(outboundTicket)
    : 0;
  const operatorReturnTotal = returnTicket
    ? calculateOperatorTicketTotal(returnTicket)
    : 0;
  const operatorTotalPrice = operatorOutboundTotal + operatorReturnTotal;
  const totalPriceWithFlex = outboundTotal + returnTotal + flexPrice;

  const finalPrice = useDeposit
    ? Math.max(totalPriceWithFlex - depositAmount, 0)
    : totalPriceWithFlex;

  const validatePayment = () => {
    if (!stripe) {
      return "Payment service is not initialized";
    }
    if (!cardDetails?.complete) {
      return "Please complete the card details";
    }
    if (finalPrice <= 0) {
      return "Invalid payment amount";
    }
    return null;
  };

  const logPaymentAttempt = async (data: any) => {
    try {
      console.log("[Payment Attempt]", {
        timestamp: new Date().toISOString(),
        ...data,
      });
      // You could also send this to your analytics service
    } catch (error) {
      console.error("Failed to log payment attempt:", error);
    }
  };

  const handleFullDepositPayment = async () => {
    setIsProcessing(true);
    try {
      await logPaymentAttempt({
        type: "full_deposit",
        amount: totalPrice,
        depositAmount,
      });

      await createBookings("full_deposit_payment");
      resetCheckout();
      router.push("/checkout/success");
    } catch (error: any) {
      console.error("Full deposit payment error:", error);
      Alert.alert(
        "Payment Error",
        error.response?.data?.message ||
          "An error occurred during payment with deposit."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

  TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async ({ data, error }: any) => {
    if (error) {
      console.error('Background notification task error:', error);
      return;
    }
  
    console.log('Background notification received:', data);
  });
  
  const scheduleNotification = async () => {
    try {
      await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
  
      const trigger = Date.now() + 60 * 60 * 1000;
      alert(`Trigger is set for: ${new Date(trigger).toLocaleTimeString()}`);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Payment Processed",
          body: "Your payment was successful. Thank you for booking with us!",
          data: {
            _contentAvailable: true,
            paymentProcessed: true,
          },
        },
        trigger
      });
  
      console.log(`Notification scheduled for ${new Date(trigger).toLocaleString()}`);
    } catch (error) {
      console.error("Failed to schedule notification:", error);
      Alert.alert("Notification Error", "Could not schedule confirmation notification");
    }
  };


  const handlePayment = async () => {
    const validationError = validatePayment();
    if (validationError) {
      Alert.alert("Validation Error", validationError);
      return;
    }

    setIsProcessing(true);

    try {
      console.log("Starting payment process...");

      await logPaymentAttempt({
        type: "card_payment",
        amount: finalPrice,
        depositAmount: useDeposit ? depositAmount : 0,
      });
      console.log("Payment attempt logged successfully");
      console.log({ finalPrice, totalPrice });
      console.log("Creating payment intent...", {
        passengers,
        amount_in_cents: finalPrice * 100,
        platform: platform,
      });

      const res = await axios.post<{ data: { clientSecret: string } }>(
        `${environment.apiurl}/payment/create-payment-intent`,
        {
          passengers,
          amount_in_cents: finalPrice * 100,
          platform: platform,
        }
      );

      console.log({ paymentData: res.data.data });

      const { clientSecret } = res.data.data;
      console.log("Payment intent created successfully");

      console.log("Confirming payment...");
      const { error: confirmError, paymentIntent } =
        await stripe.confirmPayment(clientSecret, {
          paymentMethodType: "Card",
        });

      if (confirmError) {
        console.error("Confirm error:", confirmError);
        throw new Error(confirmError.message || "Payment confirmation failed");
      }

      console.log("Payment intent status:", paymentIntent?.status);

      if (paymentIntent?.status === "Succeeded") {
        console.log("Payment succeeded, creating bookings...");
        await createBookings(paymentIntent.id);
        console.log("Bookings created successfully");
        resetCheckout();
        router.push("/checkout/success");
        await scheduleNotification();
      } else {
        console.error("Unexpected payment status:", paymentIntent?.status);
        throw new Error(`Unexpected payment status: ${paymentIntent?.status}`);
      }
    } catch (error: any) {
      console.error("Payment process error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        fullError: error,
      });

      Alert.alert(
        "Payment Error",
        error.response?.data?.message ||
          error.message ||
          "An error occurred during payment processing."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const createBookings = async (paymentIntentId: string) => {
    const bookings = [];
    setInternalLoading(true);

    try {
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
    } finally {
      setInternalLoading(false);
    }
  };

  const createBooking = async (
    ticket: Ticket,
    isReturn: boolean,
    paymentIntentId: string
  ) => {
    if (!ticket.stops?.[0]) {
      throw new Error("Invalid ticket data");
    }

    const departure_station = ticket.stops[0].from._id;
    const arrival_station = ticket.stops[0].to._id;
    const departure_station_label = ticket.stops[0].from.name;
    const arrival_station_label = ticket.stops[0].to.name;
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
          platform: platform,
          flex_price: isReturn ? 0 : flexPrice,
          total_price: ticketTotal + (isReturn ? 0 : flexPrice),
          operator_price: operatorTotalPrice,
          departure_station,
          arrival_station,
          departure_station_label,
          arrival_station_label,
          is_using_deposited_money: useDeposit,
          deposit_spent: isReturn ? 0 : depositAmount * 100 || 0,
          stop: ticket.stops[0],
          is_return: isReturn,
        }
      );

      try {
        const savedBookings = await AsyncStorage.getItem("noUserBookings");
        const parsedBookings = savedBookings ? JSON.parse(savedBookings) : [];

        // Verify data structure of response.data.data
        console.log("New Booking:", response.data.data);

        // Add new booking
        parsedBookings.push(response.data.data);

        // Save updated array back to AsyncStorage
        await AsyncStorage.setItem(
          "noUserBookings",
          JSON.stringify(parsedBookings)
        );
        console.log("Bookings saved successfully:", parsedBookings);
      } catch (error) {
        console.error("Error handling noUserBookings:", error);
      }
      return response.data.data;
    } catch (error: any) {
      console.error("Error creating booking:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create booking"
      );
    }
  };

  return (
    <TouchableOpacity
      className={`py-2 mt-4 min-h-16 shrink-0 ${
        loading ? "bg-gray-400" : "bg-primary"
      } flex justify-center items-center h-16 rounded-lg flex-1`}
      disabled={loading}
      onPress={
        totalPrice <= depositAmount ? handleFullDepositPayment : handlePayment
      }
    >
      {loading ? (
        <View className="flex-row items-center space-x-2">
          <ActivityIndicator color="white" />
          <Text className="text-white font-medium text-lg">Processing</Text>
        </View>
      ) : (
        <Text className="text-white font-medium text-lg">Complete payment</Text>
      )}
    </TouchableOpacity>
  );
};

export default PaymentButton;
