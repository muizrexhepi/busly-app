import React, { useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { PaymentButton } from "./payment-button";
import useSearchStore, { useCheckoutStore } from "@/store";
import { Ticket } from "@/models/ticket";

interface PriceSummaryItemProps {
  label: string;
  amount: number;
  quantity?: number;
  className?: string;
}

const PriceSummaryItem = ({
  label,
  amount,
  quantity,
  className = "",
}: PriceSummaryItemProps) => (
  <View className={`flex-row justify-between items-center py-1 ${className}`}>
    <Text className="text-gray-900 text-base">
      {quantity ? `${label} x ${quantity}` : label}
    </Text>
    <Text className="font-medium text-base">€{amount?.toFixed(2)}</Text>
  </View>
);

export default function CheckoutPrice() {
  const { outboundTicket, returnTicket, selectedFlex, passengers } =
    useCheckoutStore();
  const childrenAmount = useSearchStore((state) => state.passengers.children);
  const flexPrice = useMemo(() => {
    return selectedFlex === "premium" ? 4 : selectedFlex === "basic" ? 2 : 0;
  }, [selectedFlex]);

  const calculateTicketTotal = (ticket: Ticket) => {
    const adultPrice = ticket.stops[0].other_prices.our_price;
    const childPrice = ticket.stops[0].other_prices.our_children_price;
    const adultCount = passengers.filter((p) => p.age > 10).length;
    const childCount = passengers.filter((p) => p.age <= 10).length;
    return {
      adultTotal: adultPrice * adultCount,
      childTotal: childPrice * childCount,
      adultCount,
      childCount,
      adultPrice,
      childPrice,
    };
  };

  const outboundDetails = outboundTicket
    ? calculateTicketTotal(outboundTicket)
    : null;
  const returnDetails = returnTicket
    ? calculateTicketTotal(returnTicket)
    : null;

  const totalPrice = useMemo(() => {
    const outboundTotal = outboundDetails
      ? outboundDetails.adultTotal + outboundDetails.childTotal
      : 0;
    const returnTotal = returnDetails
      ? returnDetails.adultTotal + returnDetails.childTotal
      : 0;
    return outboundTotal + returnTotal + flexPrice;
  }, [outboundDetails, returnDetails, flexPrice]);

  return (
    <View className="bg-white pb-8">
      <Text className="text-xl font-semibold mb-4">Total (incl. VAT)</Text>

      <View className="space-y-2">
        <PriceSummaryItem
          label={"Adults"}
          amount={outboundDetails?.adultPrice!}
          quantity={outboundDetails?.adultCount}
        />
        <PriceSummaryItem
          label={"Children"}
          className={`${childrenAmount < 1 && "hidden"}`}
          amount={outboundDetails?.childPrice!}
          quantity={outboundDetails?.childCount}
        />
        {selectedFlex && selectedFlex !== "no_flex" && (
          <PriceSummaryItem
            label={selectedFlex === "premium" ? "Premium Flex" : "Basic Flex"}
            amount={flexPrice}
          />
        )}
      </View>

      <View className="mt-4 pt-4 border-t border-gray-200">
        <PriceSummaryItem
          label="Total"
          amount={totalPrice + 0.99}
          className="text-lg font-semibold"
        />
      </View>

      <PaymentButton loading={false} totalPrice={totalPrice} />

      <View className="mt-6 space-y-2">
        <Text className="text-sm text-gray-600">
          Contract partner for transportation services:
        </Text>
        <Text className="text-sm text-gray-900">
          FUDEKS d.o.o. (Skopje - Belgrade AS)
        </Text>
        <TouchableOpacity>
          <Text className="text-sm text-blue-600">Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
