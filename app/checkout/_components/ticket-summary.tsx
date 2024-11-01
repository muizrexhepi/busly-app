import { View, Text } from "react-native";
import moment from "moment";
import { Calendar, Timer as TimerIcon } from "lucide-react-native";
import { Ticket } from "@/models/ticket";
import InfoBlock from "@/components/info-block";

const TicketSummary = ({
  ticket,
  isReturn,
}: {
  ticket: Ticket;
  isReturn: boolean;
}) => {
  return (
    <View className="flex flex-col">
      <Text className="font-medium text-base mt-2">
        {isReturn ? "Return Trip" : "Outbound Trip"}
      </Text>
      <View className="flex flex-row items-center mt-2 gap-8">
        <View className="flex flex-row items-center gap-2 justify-between w-full">
          <Text className="text-black capitalize">
            {isReturn ? ticket.stops[0].to.city : ticket.stops[0].from.city}
          </Text>
          <View className="h-[0.5px] flex-1 bg-gray-800" />
          <Text className="text-black capitalize">
            {isReturn ? ticket.stops[0].from.city : ticket.stops[0].to.city}
          </Text>
        </View>
      </View>
      <View className="flex flex-col gap-2 mt-2">
        <View className="flex flex-row items-center gap-2">
          <Calendar color="gray" size={20} />
          <Text className="text-black text-sm">Departure:</Text>
          <Text className="font-medium text-black text-sm">
            {moment
              .utc(ticket.stops[0].departure_date)
              .format("dddd, DD-MM-YYYY / HH:mm")}
          </Text>
        </View>
        <View className="flex flex-row items-center gap-2">
          <TimerIcon color="gray" size={20} />
          <Text className="text-black text-sm">Duration:</Text>
          <Text className="font-medium text-black text-sm">
            {moment
              .duration(
                moment(ticket.stops[0].arrival_time).diff(
                  moment(ticket.stops[0].departure_date)
                )
              )
              .asHours()
              .toFixed(2)}{" "}
            hrs
          </Text>
        </View>
      </View>
      <InfoBlock
        desc="Operated by"
        title={ticket.metadata.operator_company_name}
      />
    </View>
  );
};

export default TicketSummary;
