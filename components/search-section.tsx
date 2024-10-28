import { Text, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { SecondaryButton } from "./secondary-button";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useCallback, useRef } from "react";
import useSearchStore from "@/store";
import DateSelector from "./date-select-block";
import PassengerSelect from "./modals/passengers-select";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

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
    setReturnDate,
  } = useSearchStore();

  const handleTripTypeChange = useCallback(
    (type: "one-way" | "round-trip") => {
      setTripType(type);
      if (type === "one-way") {
        setReturnDate(null);
      }
    },
    [setTripType, setReturnDate]
  );
  const passengerSelectModalRef = useRef<BottomSheetModal>(null);

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

  console.log({ datqafrom: departureDate });

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
    <View className="rounded-3xl border-neutral-700/10 border px-4 py-6 flex flex-col gap-3 w-full bg-white">
      <View className="flex-row gap-4 pb-2">
        <TouchableOpacity onPress={() => handleTripTypeChange("one-way")}>
          <Text
            className={`${
              tripType === "one-way"
                ? "text-primary font-medium"
                : "text-gray-500"
            }`}
          >
            One-way
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTripTypeChange("round-trip")}>
          <Text
            className={`${
              tripType === "round-trip"
                ? "text-primary font-medium"
                : "text-gray-500"
            }`}
          >
            Round trip
          </Text>
        </TouchableOpacity>
      </View>

      <View className="gap-3">
        <SecondaryButton
          className="flex-row items-center h-16"
          onPress={() => router.push("/(modal)/from-select")}
        >
          <View className="flex-row items-center gap-3 flex-1">
            <View className="w-8 h-8 rounded-full bg-gray-50 items-center justify-center">
              <MaterialIcons name="place" size={18} color="#666" />
            </View>
            <View>
              <Text className="text-gray-500 text-sm">From</Text>
              <Text className="text-black font-medium capitalize">
                {fromCity || "Select departure"}
              </Text>
            </View>
          </View>
        </SecondaryButton>

        <SecondaryButton
          className="flex-row items-center h-16"
          onPress={() => router.push("/(modal)/to-select")}
        >
          <View className="flex-row items-center gap-3 flex-1">
            <View className="w-8 h-8 rounded-full bg-gray-50 items-center justify-center">
              <MaterialIcons name="place" size={18} color="#666" />
            </View>
            <View>
              <Text className="text-gray-500 text-sm">To</Text>
              <Text className="text-black font-medium capitalize">
                {toCity || "Select destination"}
              </Text>
            </View>
          </View>
        </SecondaryButton>
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
        <Text className="text-white text-center font-semibold">Search</Text>
      </SecondaryButton>
    </View>
  );
};
