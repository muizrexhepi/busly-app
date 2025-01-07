import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import moment from "moment-timezone";
import { Ionicons } from "@expo/vector-icons";
import useSearchStore, { useCheckoutStore } from "@/store";
import { Ticket } from "@/models/ticket";
import { router } from "expo-router";

export interface TicketBlockProps {
  ticket: Ticket;
  isFastest?: boolean;
  isCheapest?: boolean;
  onSelect: (ticket: Ticket, isFromModal?: boolean) => void;
}

const TicketBlock: React.FC<TicketBlockProps> = ({
  ticket,
  isFastest,
  isCheapest,
  onSelect,
}) => {
  const {
    outboundTicket,

    isSelectingReturn,
  } = useCheckoutStore();
  const { tripType } = useSearchStore();

  const departureDate = moment.utc(ticket.stops[0].departure_date);
  const arrivalTime = moment.utc(
    ticket.stops[ticket.stops.length - 1].arrival_time
  );
  const duration = moment.duration(arrivalTime.diff(departureDate));
  const durationFormatted = `${duration.hours()}h ${duration.minutes()}m`;

  return (
    <View className="mb-4 p-4 bg-white border border-primary/10 rounded-xl h-[180px] shrink-0">
      <View className="flex flex-row justify-between items-center mb-4">
        <View className="flex flex-row items-center">
          <Text className="text-emerald-500 font-bold text-lg mr-2">
            {ticket.operatorInfo.name}
          </Text>
          {isCheapest && (
            <View className="bg-secondary/30 px-2 py-1 rounded">
              <Text className="text-primary text-xs font-semibold">
                CHEAPEST
              </Text>
            </View>
          )}
          {isFastest && (
            <View className="ml-2 bg-secondary/30 px-2 py-1 rounded">
              <Text className="text-primary text-xs font-semibold">
                FASTEST
              </Text>
            </View>
          )}
        </View>
        <Text className="text-xl font-bold">
          £{ticket.stops[0].other_prices.our_price.toFixed(2)}
        </Text>
      </View>

      <View className="flex-1 flex-row justify-between items-center mb-2">
        <Text className="text-lg font-semibold">
          {departureDate.format("h:mm A")}
        </Text>
        <View className="flex-1 flex-row items-center shrink-0">
          <View className="h-px bg-secondary/80 flex-grow ml-2" />
          <View className="border-secondary/80 border rounded-full px-2 py-1">
            <Text className="text-emerald-800 text-sm">
              {durationFormatted}
            </Text>
          </View>
          <View className="h-px bg-secondary/80 flex-grow mr-2" />
        </View>
        <Text className="text-lg font-semibold">
          {arrivalTime.format("h:mm A")}
        </Text>
      </View>

      <View className="flex flex-row justify-between mb-4">
        <View>
          <Text className="font-medium capitalize">
            {ticket.stops[0].from.city}
          </Text>
          <Text className="text-gray-500 text-sm capitalize truncate">
            {ticket.stops[0].from.name}
          </Text>
        </View>
        <View className="items-end">
          <Text className="font-medium capitalize">
            {ticket.stops[ticket.stops.length - 1].to.city}
          </Text>
          <Text className="text-gray-500 text-sm capitalize truncate">
            {ticket.stops[ticket.stops.length - 1].to.name}
          </Text>
        </View>
      </View>

      <View className="flex flex-row justify-between gap-4">
        {/* <TouchableOpacity className="bg-gray-100 px-3 py-2 rounded-full flex flex-row items-center">
          <Text className="text-gray-700 mr-1">
            {ticket.is_direct_route
              ? "Direct"
              : `${ticket.stops.length - 1} transfer`}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#4B5563" />
        </TouchableOpacity> */}

        <View className="flex flex-row items-center">
          <Ionicons name="person" size={16} color="#4B5563" />
          <Text className="text-gray-700 ml-1">
            {ticket.number_of_tickets} Seats left
          </Text>
        </View>

        <TouchableOpacity
          className="bg-primary px-3 py-2 rounded-full flex flex-row items-center"
          onPress={() => onSelect(ticket, true)}
        >
          <Text className="text-white mr-1">
            {isSelectingReturn && outboundTicket
              ? "Select return"
              : tripType !== "round-trip"
              ? "Continue"
              : "Select outbound"}
          </Text>
          {tripType !== "round-trip" && (
            <Ionicons name="chevron-forward" size={16} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TicketBlock;
