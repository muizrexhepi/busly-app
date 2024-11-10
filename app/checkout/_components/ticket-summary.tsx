import React from "react";
import { View, Text } from "react-native";
import { MapPin, Clock } from "lucide-react-native";
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
    <View className="rounded-xl">
      {/* Journey Type Header */}
      <Text className="text-gray-600 text-sm mb-2">
        {isReturn ? "Return Journey" : "Outbound Journey"}
      </Text>

      {/* Date and Duration */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-base font-medium text-gray-800">
          {format(departure, "EEE, d MMM")} → {format(arrival, "EEE, d MMM")}
        </Text>
        <Text className="text-sm text-gray-500">
          {format(departure, "HH:mm")} - {format(arrival, "HH:mm")}
        </Text>
      </View>

      {/* Operator Badge */}
      <View className="mb-4">
        <View className="bg-secondary/20 self-start rounded-full px-3 py-1">
          <Text className="text-sm text-primary">
            {ticket.metadata.operator_company_name}
          </Text>
        </View>
      </View>

      {/* Journey Path */}
      <View className="relative">
        <View className="absolute left-[3] top-4 bottom-4 w-[1] bg-gray-300" />

        <View className="flex-row items-center mb-6">
          <View className="w-2 h-2 rounded-full bg-blue-500 mr-4" />
          <View className="flex-1">
            <Text className="text-base capitalize font-medium text-gray-900">
              {from}
            </Text>
            <Text className="text-sm text-gray-500">Departure</Text>
          </View>
          <Clock size={16} color="#6B7280" />
          <Text className="text-base ml-2 text-gray-700">
            {format(departure, "HH:mm")}
          </Text>
        </View>

        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-blue-500 mr-4" />
          <View className="flex-1">
            <Text className="text-base capitalize font-medium text-gray-900">
              {to}
            </Text>
            <Text className="text-sm text-gray-500">Arrival</Text>
          </View>
          <Clock size={16} color="#6B7280" />
          <Text className="text-base ml-2 text-gray-700">
            {format(arrival, "HH:mm")}
          </Text>
        </View>
      </View>

      {/* Price Information */}
      {/* <View className="mt-4 pt-4 border-t border-gray-200">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-sm text-gray-600">
              Adults x {ticket.stops[0].other_prices.our_price_count}
            </Text>
            {ticket.stops[0].other_prices.our_children_price > 0 && (
              <Text className="text-sm text-gray-600 mt-1">
                Children x {ticket.stops[0].other_prices.our_children_price_count}
              </Text>
            )}
          </View>
          <View>
            <Text className="text-base font-medium text-gray-900">
              €{ticket.stops[0].other_prices.our_price.toFixed(2)}
            </Text>
            {ticket.stops[0].other_prices.our_children_price > 0 && (
              <Text className="text-base font-medium text-gray-900 mt-1">
                €{ticket.stops[0].other_prices.our_children_price.toFixed(2)}
              </Text>
            )}
          </View>
        </View>
      </View> */}
    </View>
  );
}
