import { cn } from "@/lib/utils";
import { View, Text } from "react-native";
import { useState, useEffect, useMemo } from "react";
import PriceSummaryItem from "./price-item-summary";
import useSearchStore, { useDepositStore } from "@/store";
import { useCheckoutStore } from "@/store";
import { Ticket } from "@/models/ticket";

const CheckoutPrice = ({ className }: { className?: string }) => {
  const [useBalance, setUseBalance] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);

  const { useDeposit, depositAmount } = useDepositStore();
  const childrenAmount = useSearchStore((state) => state.passengers.children);
  const { outboundTicket, returnTicket, selectedFlex, passengers } =
    useCheckoutStore();

  useEffect(() => {
    const handleUseBalanceChange = (event: any) => {
      setUseBalance(event.detail.useBalance);
      setBalanceAmount(event.detail.balanceAmount);
      setRemainingAmount(event.detail.remainingAmount);
    };

    // Note: For React Native, you might want to use a different event system
    // This is just kept for reference
    return () => {
      // Cleanup
    };
  }, []);

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

  const finalPrice = useMemo(() => {
    if (useBalance) {
      const appliedBalanceAmount = Math.min(balanceAmount / 100, totalPrice);
      return Math.max(totalPrice - appliedBalanceAmount, 0);
    }
    return totalPrice;
  }, [useBalance, balanceAmount, totalPrice]);

  useEffect(() => {
    if (useBalance) {
      const appliedBalanceAmount = Math.min(balanceAmount / 100, totalPrice);
      setRemainingAmount(Math.max(totalPrice - appliedBalanceAmount, 0));
    } else {
      setRemainingAmount(totalPrice - (depositAmount || 0));
    }
  }, [useBalance, balanceAmount, totalPrice, depositAmount]);

  return (
    <View className={cn("bg-white rounded-xl p-4 space-y-3", className)}>
      <Text className="font-medium text-lg">Booking Price</Text>
      <View className="flex flex-col gap-1">
        {outboundDetails && (
          <>
            <Text className="font-medium text-base mt-2">Outbound Trip</Text>
            <PriceSummaryItem
              label="Adults"
              amount={outboundDetails.adultPrice}
              quantity={outboundDetails.adultCount}
            />
            <PriceSummaryItem
              label="Children"
              className={`${childrenAmount < 1 && "hidden"}`}
              amount={outboundDetails.childPrice}
              quantity={outboundDetails.childCount}
            />
          </>
        )}

        {returnDetails && (
          <>
            <Text className="font-medium text-base mt-2">Return Trip</Text>
            <PriceSummaryItem
              label="Adults"
              amount={returnDetails.adultPrice}
              quantity={returnDetails.adultCount}
            />
            <PriceSummaryItem
              label="Children"
              amount={returnDetails.childPrice}
              quantity={returnDetails.childCount}
            />
          </>
        )}

        {selectedFlex && selectedFlex !== "no_flex" && (
          <PriceSummaryItem
            label={selectedFlex === "premium" ? "Premium Flex" : "Basic Flex"}
            amount={flexPrice}
          />
        )}

        <View className="w-full h-[1px] bg-neutral-500 my-2" />

        {useDeposit && (
          <>
            <PriceSummaryItem
              label="Subtotal"
              amount={finalPrice}
              className="font-medium"
            />
            <PriceSummaryItem
              label="Amount Used From Deposit"
              amount={-depositAmount || 0}
              className="text-green-600"
            />
          </>
        )}

        <PriceSummaryItem
          label="Total"
          amount={remainingAmount}
          className="font-medium text-lg"
        />
      </View>
    </View>
  );
};

export default CheckoutPrice;
