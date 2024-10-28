import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import { format, parse, isValid } from "date-fns";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { AntDesign } from "@expo/vector-icons";
import useSearchStore from "@/store";

interface DateSelectProps {
  parseDate: (date: string) => Date;
}

const ReturnDateSelect: React.FC<DateSelectProps> = ({ parseDate }) => {
  const { departureDate, returnDate, setReturnDate, setTripType } =
    useSearchStore();
  const [selectedReturnDate, setSelectedReturnDate] = useState<
    Date | undefined
  >();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (returnDate) {
      const parsedDate = parse(returnDate, "dd-MM-yyyy", new Date());
      if (isValid(parsedDate)) {
        setSelectedReturnDate(parsedDate);
      }
    }
  }, [returnDate]);

  const handleConfirm = () => {
    if (selectedReturnDate) {
      setReturnDate(format(selectedReturnDate, "dd-MM-yyyy"));
      setTripType("round-trip");
      bottomSheetModalRef.current?.dismiss();
    } else {
      console.warn("No valid return date selected.");
    }
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const minReturnDate = departureDate
    ? format(parse(departureDate, "dd-MM-yyyy", new Date()), "yyyy-MM-dd")
    : undefined;

  return (
    <>
      <TouchableOpacity className="flex-1" onPress={handlePresentModalPress}>
        <View className="flex-row items-center gap-3">
          <View className="w-8 h-8 rounded-full bg-gray-50 items-center justify-center">
            <AntDesign name="calendar" size={18} color="#666" />
          </View>
          <View className="flex-1">
            <Text className="text-gray-500 text-sm">Return</Text>
            <Text
              className={`${
                returnDate ? "text-black font-medium" : "text-primary"
              }`}
            >
              {returnDate
                ? format(parseDate(returnDate), "EEE, MMM d")
                : "Add return"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={["70%"]}
        enablePanDownToClose
        enableDismissOnClose
        // backdropComponent={({ style }) => (
        //   <View style={[style, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]} />
        // )}
      >
        <BottomSheetView className="flex-1 p-4 bg-white">
          <View className="mb-4">
            <Text className="text-xl font-semibold">Select Return Date</Text>
            <Text className="text-gray-500 text-sm">
              Choose your preferred return date for the trip.
            </Text>
          </View>
          <Calendar
            onDayPress={(day: any) =>
              setSelectedReturnDate(new Date(day.timestamp))
            }
            initialDate={
              selectedReturnDate
                ? format(selectedReturnDate, "yyyy-MM-dd")
                : undefined
            }
            markedDates={
              selectedReturnDate
                ? {
                    [format(selectedReturnDate, "yyyy-MM-dd")]: {
                      selected: true,
                      selectedColor: "#007AFF",
                    },
                  }
                : {}
            }
            minDate={minReturnDate}
            theme={{
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
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};

export default ReturnDateSelect;
