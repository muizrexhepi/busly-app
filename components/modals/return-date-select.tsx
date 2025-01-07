import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { Calendar } from "react-native-calendars";
import { format, parse, isValid } from "date-fns";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import useSearchStore from "@/store";
import { AntDesign, Ionicons } from "@expo/vector-icons";

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
      setReturnDate(null);
      setTripType("one-way");
      bottomSheetModalRef.current?.dismiss();
    }
  };

  const handleRemoveReturnDate = () => {
    setReturnDate(null);
    setTripType("one-way");
    bottomSheetModalRef.current?.dismiss();
  };

  const handlePresentModalPress = useCallback(() => {
    setTripType("round-trip");
    bottomSheetModalRef.current?.present();
  }, []);

  const minReturnDate = departureDate
    ? format(parse(departureDate, "dd-MM-yyyy", new Date()), "yyyy-MM-dd")
    : undefined;

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
          {returnDate && (
            <TouchableOpacity onPress={handleRemoveReturnDate}>
              <AntDesign name="close" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </Pressable>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={["70%"]}
        index={1}
        enablePanDownToClose
        enableDismissOnClose
      >
        <BottomSheetView className="flex-1 p-4 bg-white">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-semibold">Select Return Date</Text>
            {returnDate && (
              <TouchableOpacity onPress={handleRemoveReturnDate}>
                <AntDesign name="close" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
          <Text className="text-gray-500 text-sm">
            Choose your preferred return date for the trip.
          </Text>
          <Calendar
            onDayPress={(day: any) =>
              setSelectedReturnDate(new Date(day.timestamp))
            }
            initialDate={
              selectedReturnDate
                ? format(selectedReturnDate, "yyyy-MM-dd")
                : minReturnDate
            }
            markedDates={
              selectedReturnDate
                ? {
                    [format(selectedReturnDate, "yyyy-MM-dd")]: {
                      selected: true,
                      selectedColor: "#15203e",
                    },
                  }
                : {}
            }
            minDate={minReturnDate}
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
