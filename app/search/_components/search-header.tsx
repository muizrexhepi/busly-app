import React from "react";
import { View, Text } from "react-native";
import useSearchStore, { useCheckoutStore } from "@/store";
import { useLocalSearchParams } from "expo-router";
import { format } from "date-fns";

const SearchHeader = ({ navigation }: any) => {
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const formatDepartureDate = (dateString: any) => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split("-");
    return format(new Date(`${year}-${month}-${day}`), "EEE, MMM d");
  };

  const { fromCity, toCity, departureDate, returnDate } = useSearchStore();
  const { isSelectingReturn } = useCheckoutStore();

  const displayFromCity = isSelectingReturn ? toCity : fromCity;
  const displayToCity = isSelectingReturn ? fromCity : toCity;
  const displayDate = isSelectingReturn ? returnDate : departureDate;

  return (
    <View className="items-center">
      <Text className="text-white font-medium text-xl">
        {`${capitalize(displayFromCity)} to ${capitalize(displayToCity)}`}
      </Text>
      {/* <Text className="text-[#bbbbbb]">{formatDepartureDate(displayDate)}</Text> */}
    </View>
  );
};

export default SearchHeader;
