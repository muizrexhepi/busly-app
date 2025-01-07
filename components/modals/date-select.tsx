import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { Calendar } from "react-native-calendars";
import { format, parse, isValid } from "date-fns";
import useSearchStore from "@/store";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";

const DateSelect = ({ parseDate }: { parseDate: any }) => {
  const { departureDate, setDepartureDate } = useSearchStore();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (departureDate) {
      const parsedDate = parse(departureDate, "dd-MM-yyyy", new Date());
      if (isValid(parsedDate)) {
        setSelectedDate(parsedDate);
      } else {
        setSelectedDate(undefined);
      }
    }
  }, [departureDate]);

  const handleConfirm = () => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, "dd-MM-yyyy");
      setDepartureDate(formattedDate);
      bottomSheetModalRef.current?.dismiss();
    } else {
      console.warn("No valid date selected.");
    }
  };

  const handleClear = () => {
    setSelectedDate(undefined);
    setDepartureDate("");
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <>
      <Pressable
        className="flex-1 bg-secondary/10 rounded-lg p-4"
        onPress={handlePresentModalPress}
      >
        <View className="flex-row items-center gap-3">
          <View className="w-8 h-8 rounded-full items-center justify-center">
            <Ionicons name="calendar" size={24} color="#666" />
          </View>
          <View className="flex-1">
            <Text className="text-gray-500 text-sm">Departure</Text>
            <Text className="text-black font-medium">
              {departureDate
                ? format(parseDate(departureDate), "EEE, MMM d")
                : "Select date"}
            </Text>
          </View>
        </View>
      </Pressable>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={["70%"]}
        enablePanDownToClose
        enableDismissOnClose
      >
        <BottomSheetView className="flex-1 p-4 bg-white">
          {/* Header */}
          <View className="mb-4">
            <Text className="text-xl font-semibold">Select Departure Date</Text>
            <Text className="text-gray-500 text-sm">
              Choose your preferred departure date for the trip.
            </Text>
          </View>

          {/* Calendar */}
          <Calendar
            onDayPress={(day: any) => {
              setSelectedDate(new Date(day.timestamp));
            }}
            initialDate={
              selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined
            }
            markedDates={
              selectedDate
                ? {
                    [format(selectedDate, "yyyy-MM-dd")]: {
                      selected: true,
                      selectedColor: "#15203e",
                    },
                  }
                : {}
            }
            minDate={new Date().toISOString()}
            theme={{
              selectedDayBackgroundColor: "#15203e",
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

          <View className="flex-row justify-between mt-6">
            <TouchableOpacity
              onPress={handleConfirm}
              className="h-14 flex-1 bg-primary rounded-lg items-center justify-center ml-2 shadow-lg"
            >
              <Text className="text-white font-semibold">Confirm</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};

export default DateSelect;
