import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { environment } from "@/environment";
import { Ticket } from "@/models/ticket";
import NoTicketsAvailable from "@/app/search/_components/no-tickets";
import TicketBlock from "@/app/search/_components/ticket";
import DateChanger from "@/app/search/_components/date-changer";
import useSearchStore, { useCheckoutStore, useLoadingStore } from "@/store";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import TicketDetails from "@/app/search/_components/ticket-details";
import { PrimaryButton } from "@/components/primary-button";
import moment from "moment-timezone";
import { ArrowRight } from "lucide-react-native"; // Make sure to install lucide-react-native

const SearchResults = () => {
  const params = useLocalSearchParams();
  const {
    selectedTicket,
    setSelectedTicket,
    setOutboundTicket,
    setReturnTicket,
    setIsSelectingReturn,
    isSelectingReturn,
  } = useCheckoutStore();
  const { tripType } = useSearchStore();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const {
    from: departureStation,
    to: arrivalStation,
    departureDate,
    returnDate,
    passengers,
  } = useSearchStore();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const { isLoading, setIsLoading } = useLoadingStore();
  const [noData, setNoData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [fetchingAvailableDates, setFetchingAvailableDates] = useState(false);

  const handlePresentModalPress = () => {
    bottomSheetModalRef.current?.present();
  };

  const fetchNextAvailableDates = useCallback(async () => {
    try {
      setFetchingAvailableDates(true);

      const currentDepartureStation = isSelectingReturn
        ? arrivalStation
        : departureStation;
      const currentArrivalStation = isSelectingReturn
        ? departureStation
        : arrivalStation;
      const currentDate = isSelectingReturn ? returnDate : departureDate;

      const response = await fetch(
        `${environment.apiurl}/ticket/search/find-nearest?` +
          `departureStation=${currentDepartureStation}&` +
          `arrivalStation=${currentArrivalStation}&` +
          `currentDate=${currentDate}&` +
          `adults=${passengers.adults}&` +
          `children=${passengers.children}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch available dates");
      }

      const data = await response.json();
      console.log({ availableDates: data.data.data });
      setAvailableDates(data.data.data || []);
    } catch (err) {
      console.error("Failed to fetch available dates:", err);
      setAvailableDates([]);
    } finally {
      setFetchingAvailableDates(false);
    }
  }, [
    isSelectingReturn,
    departureStation,
    arrivalStation,
    departureDate,
    returnDate,
    passengers,
  ]);

  const fetchTickets = useCallback(
    async (page: number, isLoadingMore = false) => {
      try {
        if (!isLoadingMore) {
          setIsLoading(true);
        }

        const currentDepartureStation = isSelectingReturn
          ? arrivalStation
          : departureStation;
        const currentArrivalStation = isSelectingReturn
          ? departureStation
          : arrivalStation;
        const currentDate = isSelectingReturn ? returnDate : departureDate;

        const response = await fetch(
          `${environment.apiurl}/ticket/search?` +
            `departureStation=${currentDepartureStation}&` +
            `arrivalStation=${currentArrivalStation}&` +
            `departureDate=${currentDate}&` +
            `adults=${passengers.adults}&` +
            `children=${passengers.children}&` +
            `page=${page}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch tickets");
        }

        const data = await response.json();
        const newTickets = data.data || [];
        if (newTickets.length === 0) {
          if (page === 1) {
            setNoData(true);
            fetchNextAvailableDates();
          }
          setHasMoreData(false);
        } else {
          setNoData(false);
          if (isLoadingMore) {
            setTickets((prevTickets) => [...prevTickets, ...newTickets]);
          } else {
            setTickets(newTickets);
          }
          setAvailableDates([]);
        }
      } catch (err) {
        console.error("Error fetching tickets:", err);
        if (page === 1) {
          setNoData(true);
          fetchNextAvailableDates();
        }
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [
      isSelectingReturn,
      departureStation,
      arrivalStation,
      departureDate,
      returnDate,
      passengers,
      fetchNextAvailableDates,
    ]
  );

  const navigateToDate = useCallback(
    (dateStr: string) => {
      if (isSelectingReturn) {
        useSearchStore.setState({ returnDate: dateStr });
      } else {
        useSearchStore.setState({ departureDate: dateStr });
      }

      setTickets([]);
      setCurrentPage(1);
      setHasMoreData(true);
      setNoData(false);
      setAvailableDates([]);

      fetchTickets(1);
    },
    [isSelectingReturn, fetchTickets]
  );

  const handleTicketSelection = useCallback(
    async (ticket: Ticket, isFromModal = false) => {
      if (!isFromModal) {
        setSelectedTicket(ticket);
        handlePresentModalPress();
        return;
      }

      if (isSelectingReturn) {
        setIsLoading(true);
        setReturnTicket(ticket);
        router.push("/checkout");
      } else {
        setOutboundTicket(ticket);

        if (tripType === "round-trip" && returnDate) {
          setIsLoading(true);
          setIsSelectingReturn(true);

          const returnParams = {
            departureStation: arrivalStation,
            arrivalStation: departureStation,
            departureDate: returnDate,
            returnDate: returnDate,
            adult: passengers.adults,
            children: passengers.children,
          };

          router.setParams(returnParams);

          setTickets([]);
          setCurrentPage(1);
          setHasMoreData(true);
          setNoData(false);
          setAvailableDates([]);

          await new Promise((resolve) => setTimeout(resolve, 100));

          try {
            const response = await fetch(
              `${environment.apiurl}/ticket/search?` +
                `departureStation=${returnParams.departureStation}&` +
                `arrivalStation=${returnParams.arrivalStation}&` +
                `departureDate=${returnParams.departureDate}&` +
                `adults=${returnParams.adult}&` +
                `children=${returnParams.children}&` +
                `page=1`
            );

            if (!response.ok) {
              throw new Error("Failed to fetch return tickets");
            }

            const data = await response.json();
            const newTickets = data.data || [];

            if (newTickets.length === 0) {
              setNoData(true);
              setHasMoreData(false);
              // Fetch next available dates when no return tickets are found
              fetchNextAvailableDates();
            } else {
              setNoData(false);
              setTickets(newTickets);
            }
          } catch (err) {
            console.error("Error fetching return tickets:", err);
            setNoData(true);
            // Fetch next available dates on error
            fetchNextAvailableDates();
          } finally {
            setIsLoading(false);
          }
        } else {
          router.push("/checkout");
        }
      }

      bottomSheetModalRef.current?.dismiss();
    },
    [
      isSelectingReturn,
      tripType,
      returnDate,
      departureStation,
      arrivalStation,
      passengers,
      fetchNextAvailableDates,
    ]
  );

  useEffect(() => {
    setTickets([]);
    setCurrentPage(1);
    setHasMoreData(true);
    setNoData(false);
    setAvailableDates([]);
    fetchTickets(1);
  }, [
    isSelectingReturn,
    departureStation,
    arrivalStation,
    departureDate,
    returnDate,
  ]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMoreData && !isLoading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchTickets(nextPage, true);
    }
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#15203e" />
      </View>
    );
  };

  const renderTicket = ({ item }: { item: Ticket }) => {
    const ticketDurations = tickets.map((t) => {
      const tDepartureDate = moment.utc(t.departure_date);
      const tArrivalTime = moment.utc(t.stops[t.stops.length - 1].arrival_time);
      return {
        ticket: t,
        durationMs: tArrivalTime.diff(tDepartureDate),
      };
    });

    const minDuration = Math.min(...ticketDurations.map((td) => td.durationMs));
    const fastestTickets = ticketDurations.filter(
      (td) => td.durationMs === minDuration
    );

    const isFastest =
      fastestTickets.length === 1 && fastestTickets[0].ticket === item;

    const ticketPrices = tickets.map((t) => ({
      ticket: t,
      price: t.stops[0].price,
    }));

    const minPrice = Math.min(...ticketPrices.map((tp) => tp.price));
    const cheapestTickets = ticketPrices.filter((tp) => tp.price === minPrice);

    const isCheapest =
      cheapestTickets.length === 1 && cheapestTickets[0].ticket === item;

    return (
      <TouchableOpacity onPress={() => handleTicketSelection(item)}>
        <TicketBlock
          ticket={item}
          isFastest={isFastest}
          isCheapest={isCheapest}
          onSelect={handleTicketSelection}
        />
      </TouchableOpacity>
    );
  };

  // Component for next available date - similar to your web implementation
  const NextAvailableDates = () => {
    if (fetchingAvailableDates) {
      return (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#15203e" />
        </View>
      );
    }

    if (availableDates.length === 0) {
      return <NoTicketsAvailable />;
    }

    const nextAvailableDate = availableDates[0];
    const formattedDate = moment(nextAvailableDate, "DD-MM-YYYY").format(
      "D MMM"
    );

    return (
      <View className="flex-1 items-center justify-center">
        {/* Illustration */}
        <View className="relative items-center justify-center mb-8">
          <Image
            source={require("@/assets/images/man-illustration.png")}
            style={{ width: 250, height: 250 }}
            resizeMode="contain"
          />
        </View>

        <View className="items-center mb-8">
          <Text className="text-2xl font-bold text-center mb-2">
            No tickets available
          </Text>
          <Text className="text-gray-500 text-center">
            We couldn't find any tickets for this date. Try a different date.
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigateToDate(nextAvailableDate)}
          className="bg-primary px-6 py-3 rounded-xl flex-row items-center"
        >
          <Text className="text-white font-medium mr-2">
            Next Available {formattedDate}
          </Text>
          <ArrowRight color="white" size={20} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-secondary/10">
      <StatusBar barStyle="light-content" />
      <DateChanger />
      {isLoading && !isLoadingMore ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#15203e" />
        </View>
      ) : noData ? (
        <NextAvailableDates />
      ) : (
        <FlatList
          data={tickets}
          renderItem={renderTicket}
          keyExtractor={(item) => item._id}
          className="p-4"
          contentContainerStyle={{ paddingBottom: 50 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}

      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={["75%"]}
          enableDismissOnClose
        >
          <BottomSheetView className="flex-1 bg-white p-4">
            {selectedTicket && <TicketDetails />}
            <View className="bg-white absolute bottom-4 w-full left-4">
              <PrimaryButton
                className="bg-primary w-full my-4"
                onPress={() => handleTicketSelection(selectedTicket!, true)}
              >
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
