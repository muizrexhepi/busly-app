import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { useCallback, useEffect } from "react";
import useSearchStore, { useCheckoutStore } from "@/store";
import DateSelector from "@/components/date-select-block";
import PassengerSelect from "@/components/modals/passengers-select";
import { SecondaryButton } from "@/components/secondary-button";

export const SearchSection = () => {
  const {
    tripType,
    setTripType,
    from,
    to,
    fromCity,
    toCity,
    departureDate,
    returnDate,
    passengers,
    resetSearch,
  } = useSearchStore();

  const { resetCheckout } = useCheckoutStore();

  const handleSearch = useCallback(() => {
    const searchParams = new URLSearchParams({
      departureStation: from,
      arrivalStation: to,
      departureDate: departureDate || "",
      adult: passengers.adults.toString(),
      children: passengers.children.toString(),
    });

    if (returnDate && tripType === "round-trip") {
      searchParams.append("returnDate", returnDate);
    }

    router.push(`/search/search-results?${searchParams.toString()}`);
  }, [from, to, departureDate, returnDate, passengers, tripType]);

  useEffect(() => {
    resetSearch();
    resetCheckout();
  }, []);

  const formatPassengers = () => {
    const adults = passengers.adults;
    const children = passengers.children;
    const adultLabel = adults === 1 ? "Adult" : "Adults";
    const childLabel = children === 1 ? "Child" : "Children";

    const parts = [];
    if (adults > 0) parts.push(`${adults} ${adultLabel}`);
    if (children > 0) parts.push(`${children} ${childLabel}`);

    return parts.join(", ");
  };

  const parseDate = (dateString: string) => {
    const [day, month, year] = dateString.split("-");
    return new Date(`${year}-${month}-${day}`);
  };

  const passengerDescription = formatPassengers();

  return (
    <View className="rounded-2xl border-neutral-700/10 border-t px-4 py-6 flex flex-col gap-3 w-full bg-white">
      <View className="flex gap-2">
        <Pressable
          className="flex-row items-center h-16 bg-secondary/10 rounded-xl px-4"
          onPress={() => router.push("/(modal)/from-select")}
          accessibilityRole="button"
          accessibilityLabel="Select departure location"
        >
          <View className="flex-row items-center gap-3 flex-1">
            <FontAwesome6 name="location-crosshairs" size={24} color="#666" />
            <View>
              <Text className="text-gray-500 text-sm">From</Text>
              <Text className="text-black font-medium capitalize">
                {fromCity || "Select departure"}
              </Text>
            </View>
          </View>
        </Pressable>

        <Pressable
          className="flex-row items-center h-16 bg-secondary/10 rounded-xl px-4"
          onPress={() => router.push("/(modal)/to-select")}
          accessibilityRole="button"
          accessibilityLabel="Select arrival location"
        >
          <View className="flex-row items-center gap-3 flex-1">
            <MaterialIcons name="place" size={24} color="#666" />
            <View>
              <Text className="text-gray-500 text-sm">To</Text>
              <Text className="text-black font-medium capitalize">
                {toCity || "Select destination"}
              </Text>
            </View>
          </View>
        </Pressable>
        <DateSelector
          departureDate={departureDate}
          returnDate={returnDate}
          tripType={tripType}
          parseDate={parseDate}
          setTripType={setTripType}
        />

        <PassengerSelect passengerDescription={passengerDescription} />
      </View>

      <SecondaryButton
        className="h-16 bg-primary items-center flex flex-row justify-center"
        onPress={handleSearch}
      >
        <Text className="text-white text-center font-semibold text-lg">
          Search
        </Text>
      </SecondaryButton>
    </View>
  );
};
