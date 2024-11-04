import React, { Fragment } from "react";
import { View, Text, Linking } from "react-native";
import {
  MapPin,
  Calendar,
  Clock,
  Bus,
  Snowflake,
  Plug,
  BusFront,
} from "lucide-react-native";
import moment from "moment-timezone";
import InfoBlock from "../info-block";
import { useCheckoutStore } from "@/store";

export default function TicketDetails() {
  const { selectedTicket: ticket } = useCheckoutStore();
  const formatDate = (date: any) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (time: any) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleLocation = (location: any) => {
    if (!location || !location.lat || !location.lng) {
      console.log("No lat lng");
      return;
    }

    const { lat, lng } = location;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(googleMapsUrl);
  };

  if (!ticket) return null;

  return (
    <View className="relative flex-1">
      <View className="flex flex-row">
        <View className="flex flex-row items-center mr-4">
          <Calendar className="w-6 h-6" color={"black"} />
          <Text className="ml-2 font-medium">
            {formatDate(ticket.departure_date)}
          </Text>
        </View>
        <View className="flex flex-row items-center">
          <Clock className="w-6 h-6" color={"black"} />
          <Text className="ml-2 font-medium">{formatTime(ticket.time)}</Text>
        </View>
      </View>
      <View className="w-full h-px bg-primary/30 my-4" />
      <View className="flex flex-row justify-between items-center mb-4">
        <View className="flex flex-row items-center">
          <Text className="text-secondary font-bold text-lg mr-2">FLiXBUS</Text>
          <View className="bg-emerald-100 px-2 py-1 rounded">
            <Text className="text-secondary text-xs font-semibold">
              CHEAPEST
            </Text>
          </View>
        </View>
        <Text className="text-xl font-bold">
          £{ticket.stops[0].other_prices.our_price.toFixed(2)}
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

      <View className="mb-4">
        {ticket.stops.map((stop, index) => (
          <Fragment key={stop._id}>
            <View className="flex flex-row items-start gap-2">
              <View className="flex flex-col items-center mr-4">
                <View className="bg-primary p-2 rounded-full">
                  <BusFront color={"white"} />
                </View>
                <View className="w-0.5 h-2 bg-emerald-600 my-1" />
                <View className="w-0.5 h-2 bg-emerald-600 my-1" />
                <View className="w-0.5 h-2 bg-emerald-600 my-1" />
                <View className="border border-primary p-2 rounded-full">
                  <MapPin color={"#080e2c"} />
                </View>
              </View>
              <View className="flex-1 justify-between">
                <View className="flex justify-between">
                  <Text className="font-medium capitalize text-black/80">
                    {stop.from.name}
                  </Text>
                  <Text className="font-medium text-black/50">
                    {moment.utc(stop.departure_date).format("HH:mm")}
                  </Text>
                </View>
                <View className="flex justify-end h-24">
                  <Text className="font-medium capitalize text-black/80">
                    {stop.to.name}
                  </Text>
                  <Text className="font-medium text-black/50">
                    {moment.utc(stop.arrival_time).format("HH:mm")}
                  </Text>
                </View>
              </View>
            </View>
            {!ticket.is_direct_route && index < ticket.stops.length - 1 && (
              <View className="w-full my-4 bg-gray-100 p-2 rounded-lg">
                <View className="flex items-center justify-center">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  <Text className="text-sm text-gray-500">
                    {(() => {
                      const duration = moment.duration(
                        moment
                          .utc(ticket.stops[index + 1].departure_date)
                          .diff(moment.utc(stop.arrival_time))
                      );

                      const hours = Math.floor(duration.asHours());
                      const minutes = duration.minutes();

                      return `Transfer time: ${
                        hours > 0 ? `${hours} hours ` : ""
                      }${minutes} minutes`;
                    })()}
                  </Text>
                </View>
              </View>
            )}
          </Fragment>
        ))}
      </View>

      <View className="">
        {ticket.metadata?.features?.map((feature, index) => (
          <View key={index} className="flex flex-row items-center mb-2">
            {feature === "ac/heating" ? (
              <Snowflake className="w-6 h-6 text-secondary" />
            ) : feature === "usb charging ports" ? (
              <Plug className="w-6 h-6 text-secondary" />
            ) : (
              <Bus className="w-6 h-6 text-secondary" />
            )}
            <Text className="ml-2 capitalize">
              {feature === "ac/heating"
                ? "AC/Heating"
                : feature === "usb charging ports"
                ? "USB Charging Ports"
                : "Bus"}
            </Text>
          </View>
        ))}
      </View>

      <InfoBlock
        desc="This trip will be operated by"
        title={ticket.metadata?.operator_company_name}
      />
    </View>
  );
}
