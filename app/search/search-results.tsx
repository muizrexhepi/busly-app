import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  StatusBar,
  Button,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { environment } from "@/environment";

import { Ticket } from "@/models/ticket";
import NoTicketsAvailable from "@/components/search/no-tickets";
import TicketBlock from "@/components/search/ticket";
import DateChanger from "@/components/search/date-changer";
import { useCheckoutStore, useLoadingStore } from "@/store";
import {
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import TicketDetails from "@/components/search/ticket-details";
import { PrimaryButton } from "@/components/primary-button";

const SearchResults = () => {
  const params = useLocalSearchParams();
  const { selectedTicket, setSelectedTicket } = useCheckoutStore();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const {
    departureStation,
    arrivalStation,
    departureDate,
    returnDate,
    adult,
    children,
  } = params;

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const { isLoading, setIsLoading } = useLoadingStore();
  const [noData, setNoData] = useState(false);

  const fetchTickets = async () => {
    if (!departureStation || !arrivalStation) {
      return;
    }

    try {
      const response = await fetch(
        `${environment.apiurl}/ticket/search?departureStation=${departureStation}&arrivalStation=${arrivalStation}&departureDate=${departureDate}&adults=${adult}&children=${children}&page=1`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }

      const data = await response.json();
      const newTickets = data.data || [];

      if (newTickets.length === 0) {
        setNoData(true);
      } else {
        setNoData(false);
        setTickets(newTickets);
      }
    } catch (err) {
      setNoData(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [departureStation, arrivalStation, departureDate, adult, children]);

  const renderTicket = ({ item }: { item: Ticket }) => (
    <TouchableOpacity
      onPress={(e) => {
        setSelectedTicket(item);
        handlePresentModalPress();
      }}
    >
      <TicketBlock ticket={item} />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const handlePresentModalPress = () => {
    bottomSheetModalRef.current?.present();
  };

  return (
    <View className="flex-1 bg-secondary/5">
      <StatusBar barStyle="light-content" />
      <DateChanger />
      {noData ? (
        <NoTicketsAvailable />
      ) : (
        <FlatList
          data={tickets}
          renderItem={renderTicket}
          keyExtractor={(item) => item._id}
          className="p-4"
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={["75%"]}
          enableDismissOnClose
        >
          <BottomSheetView className="flex-1 bg-white p-4">
            {selectedTicket && <TicketDetails />}
            <View className="bg-white absolute bottom-4 w-full left-4">
              <PrimaryButton className="bg-primary w-full my-4">
                <Text className="text-white text-center font-medium text-lg">
                  Continue
                </Text>
              </PrimaryButton>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </View>
  );
};

export default SearchResults;
