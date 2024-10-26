import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { environment } from "@/environment";

import { Ticket } from "@/models/ticket";
import NoTicketsAvailable from "@/components/search/no-tickets";
import TicketBlock from "@/components/search/ticket";

const SearchResults = () => {
  const params = useLocalSearchParams();

  console.log({ params });

  const {
    departureStation,
    arrivalStation,
    departureDate,
    returnDate,
    adult,
    children,
  } = params;

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
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
      console.log({ response: newTickets });

      if (newTickets.length === 0) {
        setNoData(true);
      } else {
        setTickets(newTickets);
      }
    } catch (err) {
      setNoData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [departureStation, arrivalStation, departureDate, adult, children]);

  const renderTicket = ({ item }: { item: Ticket }) => (
    <TicketBlock ticket={item} />
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-[#f9fbfb]">
      {noData ? (
        <NoTicketsAvailable />
      ) : (
        <FlatList
          data={tickets}
          renderItem={renderTicket}
          keyExtractor={(item) => item._id}
        />
      )}
    </View>
  );
};

export default SearchResults;
