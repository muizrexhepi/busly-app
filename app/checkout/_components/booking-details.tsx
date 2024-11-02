import { Text, View } from "react-native";
import TicketSummary from "./ticket-summary";
import { useCheckoutStore } from "@/store";
import CheckoutPrice from "./booking-price";

export function BookingDetails() {
  const { outboundTicket, returnTicket } = useCheckoutStore();

  return (
    <View className="bg-white rounded-xl p-4">
      <View className="flex-row items-center gap-4 mb-2">
        <Text className="text-[#353535] font-medium text-2xl">
          Booking Summary
        </Text>
      </View>
      <Text className="text-base text-gray-600 mb-3">
        Review your trip summary below.
      </Text>
      {outboundTicket && (
        <TicketSummary ticket={outboundTicket} isReturn={false} />
      )}
      {returnTicket && <TicketSummary ticket={returnTicket} isReturn={true} />}
      <CheckoutPrice />
    </View>
  );
}
