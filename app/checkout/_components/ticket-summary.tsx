import { View, Text } from "react-native";
import moment from "moment";
import { Calendar, Timer as TimerIcon, Bus } from "lucide-react-native";
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
    <View className="bg-white rounded-xl mb-4">
      <View className="flex-row items-center gap-4 mb-4">
        <View className="flex items-center justify-center w-10 h-10 bg-primary/10 border border-primary rounded-xl">
          <Bus size={20} color="#080e2c" />
        </View>
        <View>
          <Text className="text-[#353535] font-medium text-2xl">
            {isReturn ? "Return Trip" : "Outbound Trip"}
          </Text>
          {/* <Text className="text-base text-gray-600">
            Trip details and timing information
          </Text> */}
        </View>
      </View>

      <View className="bg-gray-50 rounded-xl p-4 mb-4">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-1">
            <Text className="text-gray-500 text-sm mb-1">From</Text>
            <Text className="text-lg font-medium capitalize">
              {isReturn ? ticket.stops[0].to.city : ticket.stops[0].from.city}
            </Text>
          </View>
          <View className="h-[1px] flex-1 bg-gray-300 mx-4" />
          <View className="flex-1 items-end">
            <Text className="text-gray-500 text-sm mb-1">To</Text>
            <Text className="text-lg font-medium capitalize">
              {isReturn ? ticket.stops[0].from.city : ticket.stops[0].to.city}
            </Text>
          </View>
        </View>

        <View className="space-y-3">
          <View className="flex-row items-center">
            <View className="w-10">
              <Calendar color="#6b7280" size={20} />
            </View>
            <View className="flex-1">
              <Text className="text-gray-500 text-sm">Departure</Text>
              <Text className="text-base font-medium">
                {moment
                  .utc(ticket.stops[0].departure_date)
                  .format("dddd, DD-MM-YYYY")}
              </Text>
              <Text className="text-base font-medium text-blue-600">
                {moment.utc(ticket.stops[0].departure_date).format("HH:mm")}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <View className="w-10">
              <TimerIcon color="#6b7280" size={20} />
            </View>
            <View className="flex-1">
              <Text className="text-gray-500 text-sm">Duration</Text>
              <Text className="text-base font-medium">
                {moment
                  .duration(
                    moment(ticket.stops[0].arrival_time).diff(
                      moment(ticket.stops[0].departure_date)
                    )
                  )
                  .asHours()
                  .toFixed(1)}{" "}
                hours
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="border-t border-gray-200 pt-4">
        <View className="flex-row items-center">
          <View className="w-10">
            <Bus size={20} color="#6b7280" />
          </View>
          <View className="flex-1">
            <Text className="text-gray-500 text-sm">Operated by</Text>
            <Text className="text-base font-medium">
              {ticket.metadata.operator_company_name}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TicketSummary;
