import React from "react";
import { View, Text } from "react-native";
import { MapPin } from "lucide-react-native";
import { format } from "date-fns";
import { Ticket } from "@/models/ticket";

type TicketSummaryProps = {
  ticket: Ticket;
  isReturn: boolean;
};

export default function TicketSummary({
  ticket,
  isReturn,
}: TicketSummaryProps) {
  const departure = new Date(ticket.stops[0].departure_date);
  const arrival = new Date(ticket.stops[0].arrival_time);

  const from = isReturn ? ticket.stops[0].to.city : ticket.stops[0].from.city;
  const to = isReturn ? ticket.stops[0].from.city : ticket.stops[0].to.city;

  return (
    <View className="bg-white rounded-xl py-4 ">
      <Text className="text-base mb-2">
        {format(departure, "EEE, d MMM")} → {format(arrival, "EEE, d MMM")}
      </Text>

      <View className="mb-4">
        <View className="bg-gray-200 self-start rounded-full px-3 py-1">
          <Text className="text-sm">
            {ticket.metadata.operator_company_name}
          </Text>
        </View>
      </View>

      <View className="relative">
        <View className="absolute left-[3] top-4 bottom-4 w-[1] bg-gray-300" />

        <View className="flex-row items-center mb-6">
          <View className="w-2 h-2 rounded-full bg-gray-400 mr-4" />
          <Text className="flex-1 text-base capitalize font-medium">
            {from}
          </Text>
          <MapPin size={16} color="#6B7280" />
          <Text className="text-base ml-2">{format(departure, "HH:mm")}</Text>
        </View>

        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-gray-400 mr-4" />
          <Text className="flex-1 text-base capitalize font-medium">{to}</Text>
          <MapPin size={16} color="#6B7280" />
          <Text className="text-base ml-2">{format(arrival, "HH:mm")}</Text>
        </View>
      </View>

      <Text className="text-green-600 font-medium mt-4">DIRECT TRIP</Text>
    </View>
  );
}
