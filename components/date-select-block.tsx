import React from "react";
import DateSelect from "./modals/date-select";
import ReturnDateSelect from "./modals/return-date-select";
import { View } from "react-native";

interface DateSelectorProps {
  departureDate: string | null;
  returnDate: string | null;
  tripType: "one-way" | "round-trip";
  parseDate: (dateString: string) => Date;
  setTripType: (type: "one-way" | "round-trip") => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  departureDate,
  returnDate,
  tripType,
  parseDate,
}) => {
  return (
    <View className="flex-row items-center h-16 justify-between border border-primary/10 p-4 rounded-lg">
      <DateSelect parseDate={parseDate} />

      <View className="h-11 w-[1px] bg-gray-200 mx-4" />

      <ReturnDateSelect parseDate={parseDate} />
    </View>
  );
};

export default DateSelector;
