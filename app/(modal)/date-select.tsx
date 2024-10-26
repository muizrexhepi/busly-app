import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import { format, parse, isValid } from "date-fns";
import useSearchStore from "@/store";
import { useNavigation } from "expo-router";

const DateSelect = () => {
  const navigation = useNavigation();
  const { departureDate, setDepartureDate } = useSearchStore();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Effect to set selected date based on the departureDate from the store
  useEffect(() => {
    if (departureDate) {
      const parsedDate = parse(departureDate, "dd-MM-yyyy", new Date());
      if (isValid(parsedDate)) {
        setSelectedDate(parsedDate);
      } else {
        setSelectedDate(undefined); // Reset if invalid
      }
    }
  }, [departureDate]);

  const handleConfirm = () => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, "dd-MM-yyyy");
      console.log({ departureDate });
      setDepartureDate(formattedDate);
      navigation.goBack();
    } else {
      console.warn("No valid date selected.");
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Calendar
        onDayPress={(day: any) => {
          setSelectedDate(new Date(day.timestamp));
        }}
        markedDates={
          selectedDate
            ? {
                [format(selectedDate, "yyyy-MM-dd")]: {
                  selected: true,
                  selectedColor: "#007AFF",
                },
              }
            : {}
        }
        minDate={new Date().toISOString()} // Prevent selection of past dates
        theme={{
          // Customizing calendar theme
          selectedDayBackgroundColor: "#007AFF",
          selectedDayTextColor: "#FFFFFF",
          todayTextColor: "#007AFF",
          dayTextColor: "#2d4150",
          monthTextColor: "#2d4150",
          textDayFontFamily: "Avenir",
          textMonthFontFamily: "Avenir",
          textDayFontSize: 16,
          textMonthFontSize: 20,
          textDayHeaderFontSize: 14,
        }}
      />

      <TouchableOpacity
        onPress={handleConfirm}
        className="h-14 bg-primary rounded-lg items-center justify-center mt-6 shadow-lg"
      >
        <Text className="text-white font-semibold">Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DateSelect;
