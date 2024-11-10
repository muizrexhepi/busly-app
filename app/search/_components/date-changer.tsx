import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { format, addDays, subDays, parse, isValid } from "date-fns";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import useSearchStore, { useCheckoutStore, useLoadingStore } from "@/store";
import { cn } from "@/lib/utils";

type RootStackParamList = {
  Search: { departureDate?: string; returnDate?: string };
};

type SearchScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Search"
>;

interface DateButtonProps {
  date: Date;
  isSelected: boolean;
  onPress: () => void;
  departureDate: Date;
  outboundTicket: any;
  tripType: string;
}

const DateButton: React.FC<DateButtonProps> = ({
  date,
  isSelected,
  onPress,
  departureDate,
  outboundTicket,
  tripType,
}) => (
  <TouchableOpacity
    className={cn("p-2 rounded-full bg-white flex-grow", {
      "bg-white/20": !isSelected,
    })}
    disabled={
      tripType === "round-trip" && outboundTicket && date < departureDate
    }
    onPress={onPress}
  >
    <Text
      className={`text-sm text-center font-bold truncate line-clamp-1 ${
        isSelected ? "text-gray-900" : "text-white"
      }`}
    >
      {format(date, "EEE, MMM d")}
    </Text>
  </TouchableOpacity>
);

export function DateChanger() {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const {
    departureDate,
    setDepartureDate,
    returnDate,
    setReturnDate,
    tripType,
  } = useSearchStore();
  const { outboundTicket } = useCheckoutStore();
  const { isLoading } = useLoadingStore();

  const parsedDepartureDate = departureDate
    ? parse(departureDate, "dd-MM-yyyy", new Date())
    : new Date();

  const [selectedDate, setSelectedDate] = useState<Date>(
    tripType === "round-trip" && outboundTicket
      ? returnDate
        ? parse(returnDate, "dd-MM-yyyy", new Date())
        : parsedDepartureDate
      : parsedDepartureDate
  );

  const dates = [
    subDays(selectedDate, 1),
    selectedDate,
    addDays(selectedDate, 1),
  ];

  useEffect(() => {
    if (departureDate) {
      const parsedDate = parse(departureDate, "dd-MM-yyyy", new Date());
      if (
        isValid(parsedDate) &&
        parsedDate.getTime() !== selectedDate.getTime()
      ) {
        setSelectedDate(parsedDate);
      }
    }
  }, [departureDate]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const formattedDate = format(date, "dd-MM-yyyy");

    if (tripType === "round-trip" && outboundTicket) {
      setReturnDate(formattedDate);
      navigation.setParams({ returnDate: formattedDate });
    } else {
      setDepartureDate(formattedDate);
      console.log("setting", formattedDate);
      navigation.setParams({ departureDate: formattedDate });
    }
  };

  return (
    <View className="">
      <View className="flex flex-row justify-between items-center gap-4 p-4 bg-primary">
        {dates.map((date) =>
          isLoading ? (
            <View
              key={date.toISOString()}
              className="flex-1 h-9 flex-grow bg-gray-100 rounded-full flex justify-center items-center mx-1"
            >
              <View className="h-3.5 w-20 bg-gray-300 rounded" />
            </View>
          ) : (
            <DateButton
              key={date.toISOString()}
              outboundTicket={outboundTicket}
              tripType={tripType || "one-way"}
              date={date}
              isSelected={date.toDateString() === selectedDate.toDateString()}
              onPress={() => handleDateSelect(date)}
              departureDate={parsedDepartureDate}
            />
          )
        )}
      </View>
    </View>
  );
}

export default DateChanger;
