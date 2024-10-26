import { Text, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { SecondaryButton } from "./secondary-button";
import { AntDesign } from "@expo/vector-icons";
import { useCallback } from "react";
import { format } from "date-fns";
import useSearchStore from "@/store";

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
    <View className="rounded-3xl border-secondary/70 border p-4 flex flex-col gap-3 w-full bg-white">
      <View className="flex-row gap-4 pb-2">
        <TouchableOpacity
          onPress={() => handleTripTypeChange("one-way")}
          className={`px-3 py-1 rounded-full ${
            tripType === "one-way" ? "bg-secondary/30" : ""
          }`}
        >
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
        <TouchableOpacity
          onPress={() => handleTripTypeChange("round-trip")}
          className={`px-3 py-1 rounded-full ${
            tripType === "round-trip" ? "bg-secondary/30" : ""
          }`}
        >
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
              <AntDesign name="pushpin" size={18} color="#666" />
            </View>
            <View>
              <Text className="text-gray-500 text-sm">From</Text>
              <Text className="text-black font-medium">
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
              <AntDesign name="pushpin" size={18} color="#666" />
            </View>
            <View>
              <Text className="text-gray-500 text-sm">To</Text>
              <Text className="text-black font-medium">
                {toCity || "Select destination"}
              </Text>
            </View>
          </View>
        </SecondaryButton>

        <SecondaryButton
          className="flex-row items-center h-16"
          onPress={() => router.push("/(modal)/date-select")}
        >
          <View className="flex-row items-center gap-3 flex-1">
            <View className="w-8 h-8 rounded-full bg-gray-50 items-center justify-center">
              <AntDesign name="calendar" size={18} color="#666" />
            </View>
            <View>
              <Text className="text-gray-500 text-sm">Date</Text>
              <Text className="text-black font-medium">
                {departureDate
                  ? format(parseDate(departureDate), "EEE, MMM d")
                  : "Select date"}
              </Text>
            </View>
            {tripType === "round-trip" && (
              <TouchableOpacity
                className="ml-auto"
                onPress={() => router.push("/(modal)/return-date-select")}
              >
                <Text className="text-primary">
                  {returnDate
                    ? format(new Date(returnDate), "EEE, MMM d")
                    : "Add return"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </SecondaryButton>

        <SecondaryButton
          className="flex-row items-center h-16"
          onPress={() => router.push("/(modal)/passengers-select")}
        >
          <View className="flex-row items-center gap-3 flex-1">
            <View className="w-8 h-8 rounded-full bg-gray-50 items-center justify-center">
              <AntDesign name="user" size={18} color="gray" />
            </View>
            <View>
              <Text className="text-gray-500 text-sm">Passengers</Text>
              <Text className="text-black font-medium">
                {passengerDescription || "Select passengers"}
              </Text>
            </View>
          </View>
        </SecondaryButton>
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
