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
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import { useStations } from "@/contexts/station-provider";
import useSearchStore from "@/store";
import { Station } from "@/models/station";
import { RECENT_STATIONS } from "@/constants/data";
import useRecentStations from "@/hooks/use-recent-stations";
import { useNavigation } from "expo-router";

const FromStationSelect = () => {
  const navigation = useNavigation();
  const { stations, loading, error } = useStations();
  const { recentStations, updateRecentStations } = useRecentStations(
    RECENT_STATIONS.FROM
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    useSearchStore.getState().fromCity || ""
  );

  const displayData =
    searchQuery.length > 0 || recentStations.length < 1
      ? stations.filter((station) =>
          station.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : recentStations;

  const handleStationSelect = (station: Station) => {
    useSearchStore.getState().setFrom(station._id!);
    useSearchStore.getState().setFromCity(station.city!);
    navigation.goBack();
    updateRecentStations(station);
  };

  const renderStationItem = ({ item }: { item: Station }) => (
    <TouchableOpacity
      className="py-4 mx-4 shadow-md border-b border-neutral-200 flex-row items-center gap-4"
      onPress={() => handleStationSelect(item)}
    >
      <FontAwesome6 name="location-crosshairs" size={24} color="#666" />
      <View>
        <Text className="text-black font-semibold capitalize">{item.city}</Text>
        <Text className="text-black/70 font-medium">{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#15203e" />
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
                <AntDesign name="closecircle" size={20} color="#15203e" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <FlatList
          keyboardDismissMode="on-drag"
          data={displayData}
          keyExtractor={(item) => item._id!.toString()}
          renderItem={renderStationItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListHeaderComponent={() => (
            <View className="w-full px-4 py-2 bg-secondary/10">
              <Text className="text-primary font-medium">
                {searchQuery.length > 0 || recentStations.length < 1
                  ? "Search Results"
                  : "Recent Stations"}
              </Text>
            </View>
          )}
        />
      </View>
    </DismissKeyboard>
  );
};

export default FromStationSelect;
