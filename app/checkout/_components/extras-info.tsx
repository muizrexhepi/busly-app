import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "@/lib/utils";
import { useCheckoutStore } from "@/store";
import { Check } from "lucide-react-native";

interface FlexFeature {
  name: string;
  value: "premium" | "basic" | "no_flex";
  price: number;
  features: string[];
}

const flexFeatures: FlexFeature[] = [
  {
    name: "Premium Flex",
    value: "premium",
    price: 4,
    features: [
      "Cancel your ticket anytime",
      "Change your booking for free",
      "Reschedule without fees",
    ],
  },
  {
    name: "Basic Flex",
    value: "basic",
    price: 2,
    features: ["Cancel up to 24h before", "One free change"],
  },
  {
    name: "No Flex",
    value: "no_flex",
    price: 0,
    features: [],
  },
];

const TravelFlex = () => {
  const { selectedFlex, setSelectedFlex, setFlexPrice } = useCheckoutStore();

  const handleFlexSelection = (flex: FlexFeature) => {
    setSelectedFlex(flex.value);
    setFlexPrice(flex.price);
  };

  return (
    <View className="flex flex-col gap-4">
      {flexFeatures.map((flex, index) => (
        <TouchableOpacity
          key={flex.value}
          className={cn(
            "rounded-xl border p-4",
            selectedFlex === flex.value
              ? "border-emerald-700 bg-emerald-50"
              : "border-gray-300"
          )}
          onPress={() => handleFlexSelection(flex)}
        >
          <View
            className={cn("flex flex-row justify-between items-center mb-2", {
              "mb-0": index === 2,
            })}
          >
            <Text className="font-semibold text-lg text-black">
              {flex.name}
            </Text>
            <Text className="font-semibold text-lg text-emerald-700">
              {flex.price > 0 ? `+ ${flex.price}€` : "Free"}
            </Text>
          </View>
          {flex.features.length > 0 && (
            <View className="flex flex-col gap-1">
              {flex.features.map((feature, index) => (
                <View
                  key={index}
                  className="flex flex-row items-center gap-2 mb-1"
                >
                  <Check size={16} color="#047857" />
                  <Text className="text-base text-gray-600">{feature}</Text>
                </View>
              ))}
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const Extras = () => {
  return (
    <View className="flex flex-col rounded-xl bg-white p-4 gap-4">
      <View className="flex flex-row items-center gap-4">
        <View className="flex items-center justify-center w-10 h-10 bg-emerald-100 border border-emerald-800 rounded-xl">
          <Text className="text-emerald-800 font-semibold">2</Text>
        </View>
        <Text className="text-[#353535] font-medium text-2xl">Add Extras</Text>
      </View>
      <Text className="text-base text-gray-600">
        Add flexibility to your booking with our travel protection options
      </Text>
      <TravelFlex />
    </View>
  );
};

export default Extras;
