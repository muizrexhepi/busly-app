import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import { format, parse, isValid } from "date-fns";
import { AntDesign } from "@expo/vector-icons";

type ReturnDateSelectProps = {
  initialDate: string | null; // Accept the initial date for comparison
  returnDate: string | null;
  onReturnDateSelect: (date: string) => void;
  onClose: () => void;
  title?: string;
};

const ReturnDateSelect = ({
  initialDate,
  returnDate,
  onReturnDateSelect,
  onClose,
  title,
}: ReturnDateSelectProps) => {
  const [selectedReturnDate, setSelectedReturnDate] = useState<
    Date | undefined
  >(undefined);

  // Effect to parse the return date prop and set the selected return date
  useEffect(() => {
    if (returnDate) {
      const parsedDate = parse(returnDate, "dd-MM-yyyy", new Date());
      if (isValid(parsedDate)) {
        setSelectedReturnDate(parsedDate);
      }
    }
  }, [returnDate]);

  // Handle the return date selection and confirmation
  const handleConfirm = () => {
    if (selectedReturnDate) {
      onReturnDateSelect(format(selectedReturnDate, "dd-MM-yyyy"));
    }
    onClose();
  };

  // Get the minimum date allowed for return, based on the initial date
  const minReturnDate = initialDate
    ? format(
        new Date(parse(initialDate, "dd-MM-yyyy", new Date())),
        "yyyy-MM-dd"
      )
    : undefined;

  return (
    <View className="flex-1 px-4 h-full bg-white">
      <View className="flex-row justify-between items-center py-4 border-b border-gray-200">
        <Text className="text-xl font-semibold">
          {title || "Select Return Date"}
        </Text>
        <TouchableOpacity onPress={onClose}>
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Calendar
        onDayPress={(day: any) => {
          setSelectedReturnDate(new Date(day.timestamp));
        }}
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
        minDate={minReturnDate} // Set minimum date for return based on the initial date
      />

      <TouchableOpacity
        onPress={handleConfirm}
        className="h-14 bg-primary rounded-lg items-center justify-center mt-4"
      >
        <Text className="text-white font-semibold">Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReturnDateSelect;
