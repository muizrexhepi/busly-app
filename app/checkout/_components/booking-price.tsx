import { cn } from "@/lib/utils";
import { View, Text } from "react-native";
import { useState, useEffect, useMemo } from "react";
import PriceSummaryItem from "./price-item-summary";
import useSearchStore, { useDepositStore } from "@/store";
import { useCheckoutStore } from "@/store";
import { Ticket } from "@/models/ticket";
import { CreditCard, Receipt } from "lucide-react-native";

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
    <View className={cn("bg-white rounded-xl p-4 mt-4", className)}>
      <View className="flex-row items-center gap-4 mb-4">
        <View className="flex items-center justify-center w-10 h-10 bg-green-100 border border-green-800 rounded-xl">
          <Receipt size={20} color="#166534" />
        </View>
        <View>
          <Text className="text-[#353535] font-medium text-2xl">
            Price Summary
          </Text>
          <Text className="text-base text-gray-600">
            Breakdown of your booking costs
          </Text>
        </View>
      </View>

      {/* Price Details */}
      <View className="bg-gray-50 rounded-xl p-4 mb-4">
        {/* Outbound Trip */}
        {outboundDetails && (
          <View className="mb-4">
            <Text className="font-medium text-gray-800 mb-2">
              Outbound Trip
            </Text>
            <View className="space-y-2">
              <PriceSummaryItem
                label="Adults"
                amount={outboundDetails.adultPrice}
                quantity={outboundDetails.adultCount}
              />
              {childrenAmount > 0 && (
                <PriceSummaryItem
                  label="Children"
                  amount={outboundDetails.childPrice}
                  quantity={outboundDetails.childCount}
                />
              )}
            </View>
          </View>
        )}

        {/* Return Trip */}
        {returnDetails && (
          <View className="mb-4">
            <Text className="font-medium text-gray-800 mb-2">Return Trip</Text>
            <View className="space-y-2">
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
            </View>
          </View>
        )}

        {/* Flex Options */}
        {selectedFlex && selectedFlex !== "no_flex" && (
          <View className="mb-4 pt-4 border-t border-gray-200">
            <PriceSummaryItem
              label={selectedFlex === "premium" ? "Premium Flex" : "Basic Flex"}
              amount={flexPrice || 0}
              className="text-blue-600"
            />
          </View>
        )}
      </View>

      {/* Total Section */}
      <View className="border-t border-gray-200 pt-4">
        {useDeposit && (
          <>
            <PriceSummaryItem
              label="Subtotal"
              amount={finalPrice}
              className="font-medium"
            />
            <View className="flex-row items-center gap-2 my-2">
              <CreditCard size={16} color="#059669" />
              <PriceSummaryItem
                label="Deposit Applied"
                amount={-depositAmount || 0}
                className="text-emerald-600 flex-1"
              />
            </View>
          </>
        )}

        <View className="mt-2 pt-2 border-t border-gray-200">
          <PriceSummaryItem
            label="Total Amount"
            amount={remainingAmount}
            className="font-bold text-lg"
          />
        </View>
      </View>
    </View>
  );
};

export default CheckoutPrice;
