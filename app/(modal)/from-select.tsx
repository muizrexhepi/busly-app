import React, { useState } from "react";
import {
  TextInput,
  FlatList,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import DismissKeyboard from "@/components/dismiss-keyboard";
import { AntDesign } from "@expo/vector-icons";
import { useStations } from "@/contexts/station-provider";
import { MapPin } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import useSearchStore from "@/store";
import { Station } from "@/models/station";

const FromStationSelect = () => {
  const navigation = useNavigation();
  const { stations, loading, error } = useStations();
  const [searchQuery, setSearchQuery] = useState<string>(
    useSearchStore.getState().fromCity || ""
  );

  const filteredStations = stations.filter((station) =>
    station.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStationSelect = (station: Station) => {
    useSearchStore.getState().setFrom(station._id!);
    useSearchStore.getState().setFromCity(station.city!);
    navigation.goBack();
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-500">Failed to load stations</Text>
      </View>
    );
  }

  return (
    <DismissKeyboard>
      <View className="flex-1 bg-white">
        <View className="bg-primary p-4">
          <View className="relative">
            <TextInput
              placeholder="Search stations..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="border border-neutral-100 rounded-lg p-3 h-14 bg-white placeholder:text-black/60"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <AntDesign name="closecircle" size={20} color="#007BFF" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <FlatList
          data={filteredStations}
          keyExtractor={(item) => item._id!.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="py-4 mx-4 shadow-md border-b border-neutral-200 flex-row items-center gap-4"
              onPress={() => handleStationSelect(item)}
            >
              <MapPin className="w-5 h-5 text-primary" />
              <View>
                <Text className="text-black font-semibold capitalize">
                  {item.city}
                </Text>
                <Text className="text-black/70 font-medium">{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>
    </DismissKeyboard>
  );
};

export default FromStationSelect;
