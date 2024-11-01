import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import axios from "axios";
import { environment } from "@/environment";
import { useRouter } from "expo-router";
import { Ticket } from "@/models/ticket";
import { useDepositStore, useCheckoutStore } from "@/store";
import { CardField, CardFieldInput } from "@stripe/stripe-react-native";
import { calculatePassengerPrices } from "@/hooks/use-passengers";

const PaymentMethod = () => {
  const stripe = useStripe();
  const [loading, setLoading] = useState<boolean>(false);
  const [cardDetails, setCardDetails] = useState<CardFieldInput.Details | null>(
    null
  );
  const router = useRouter();

  const {
    passengers,
    outboundTicket,
    returnTicket,
    selectedFlex,
    flexPrice,
    setSelectedFlex,
    resetCheckout,
  } = useCheckoutStore();

  //   const { user } = useUser();
  const [balance, setBalance] = useState<number>(0);
  const [isGreater, setIsGreater] = useState<boolean>(false);
  const { useDeposit, setDepositAmount, setUseDeposit, depositAmount } =
    useDepositStore();

  //   useEffect(() => {
  //     const fetchDepositAmount = async () => {
  //       if (user) {
  //         try {
  //           const balance = await getUserBalance(user.$id);
  //           setIsGreater(balance / 100 > totalPrice);
  //           setBalance(balance);
  //         } catch (error) {
  //           console.error("Failed to fetch deposit amount:", error);
  //         }
  //       }
  //     };

  //     fetchDepositAmount();
  //   }, [user]);

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

  const calculateOperatorTicketTotal = (ticket: Ticket) => {
    const adultPrice = ticket.stops[0].price;
    const childPrice = ticket.stops[0].children_price;
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
  const totalPrice = outboundTotal + returnTotal + flexPrice;

  const handleUseDepositChange = (checked: boolean) => {
    if (!checked) {
      setDepositAmount(0);
    }
    setUseDeposit(checked);
  };

  const finalPrice = useDeposit
    ? Math.max(totalPrice - depositAmount, 0)
    : totalPrice;

  const handlePayment = async () => {
    if (!stripe || !cardDetails?.complete) {
      Alert.alert("Something went wrong, please try again!");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post<{ data: { clientSecret: string } }>(
        `${environment.apiurl}/payment/create-payment-intent`,
        { passengers, amount_in_cents: finalPrice * 100 }
      );

      const { clientSecret } = res.data.data;
      const { error: confirmError, paymentIntent } =
        await stripe.confirmPayment(clientSecret, {
          paymentMethodType: "Card",
        });

      if (confirmError) {
        Alert.alert("error", confirmError.message || "Errori gjenerik");
      } else if (paymentIntent?.status === "Succeeded") {
        await createBookings(paymentIntent.id);
        // router.push("/checkout/success");
      }
    } catch (err: any) {
      Alert.alert("Errorski", err.response?.data?.message || "Errori gjenerik");
    } finally {
      setLoading(false);
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
    const departure_station_label = ticket.stops[0].from.name;
    const arrival_station_label = ticket.stops[0].to.name;
    const passengersWithPrices = calculatePassengerPrices(passengers, ticket);
    const ticketTotal = isReturn ? returnTotal : outboundTotal;

    return axios
      .post(
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
      )
      .then((res: any) => {
        if (typeof global !== "undefined") {
          const savedBookings = JSON.parse(
            global.localStorage.getItem("noUserBookings") || "[]"
          );
          const newBooking = res.data.data;
          const allBookings = [...savedBookings, newBooking];
          global.localStorage.setItem(
            "noUserBookings",
            JSON.stringify(allBookings)
          );
        }
        return res.data.data;
      });
  };

  const handleFullDepositPayment = async () => {
    setLoading(true);

    try {
      await createBookings("full_deposit_payment");
      resetCheckout();
      //   router.push("/checkout/success");
    } catch (error: any) {
      Alert.alert(
        "Errorski",
        error.response?.data?.message || "Errori gjenerik"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="my-4">
      <View className="bg-white rounded-xl shadow-md overflow-hidden">
        <View className="p-6">
          <View className="flex-row items-center gap-4">
            <View className="flex items-center justify-center w-10 h-10 bg-emerald-100 border border-emerald-800 rounded-xl">
              <Text className="text-emerald-800 font-semibold">3</Text>
            </View>
            <Text className="text-[#353535] font-medium text-2xl">
              Payment Method
            </Text>
          </View>

          <Text className="text-base text-gray-600 my-4">
            Choose your preferred payment method. You can use your account
            balance for partial or full payment, with any remaining amount to be
            paid by card
          </Text>

          {balance > 0 && (
            <View className="bg-gray-50 rounded-lg p-4 mb-6">
              {/* <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <Checkbox
                      checked={useDeposit}
                      onValueChange={handleUseDepositChange}
                      className="text-emerald-600"
                    />
                    <Text className="text-sm font-medium text-gray-700">
                      {t("paymentMethod.useAccountBalance")}
                    </Text>
                  </View>
                  <Text className="text-sm font-semibold text-emerald-600">
                    €{(balance / 100).toFixed(2)} {t("paymentMethod.available")}
                  </Text>
                </View> */}

              {useDeposit && (
                <View className="mt-4">
                  <TextInput
                    keyboardType="numeric"
                    value={String(depositAmount)}
                    onChangeText={(value) => {
                      const numValue = Math.min(
                        Number(value),
                        isGreater ? totalPrice : balance / 100
                      );
                      setDepositAmount(numValue);
                    }}
                    className="w-full px-3 py-2 text-gray-700 border rounded-md"
                    placeholder={"0.00$"}
                  />
                </View>
              )}
            </View>
          )}

          {totalPrice > depositAmount && (
            <View className="space-y-4">
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
                  borderColor: "#000",
                  borderWidth: 1,
                }}
              />
            </View>
          )}
        </View>
      </View>

      {/* <View className="flex-row items-center justify-end gap-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-md"
          >
            <Text>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={
              totalPrice <= depositAmount
                ? handleFullDepositPayment
                : handlePayment
            }
            className="px-6 py-2 bg-emerald-600 rounded-md"
            disabled={
              loading || (!cardDetails?.complete && totalPrice > depositAmount)
            }
          >
            <Text className="text-white">
              {loading ? "Processing payment" : "Complete payment"}
            </Text>
          </TouchableOpacity>
        </View> */}
    </View>
  );
};

export default PaymentMethod;
