import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Button,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Booking } from "@/models/booking";
import moment from "moment-timezone";

const formatDate = (date: any) => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (time: any) => {
  return moment.utc(time).format("hh:mm A");
};

const BookingCard = ({ booking }: { booking: Booking }) => {
  const isUpcoming = moment.utc(booking.departure_date).isAfter(moment());
  const bookingStatus = isUpcoming ? "upcoming" : "completed";

  return (
    <TouchableOpacity
      className="bg-white rounded-lg p-4 mb-4"
      onPress={() => router.push(`/booking-details/${booking._id}`)}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold text-primary capitalize">
          {booking.labels.from_city} to {booking.labels.to_city}
        </Text>
        <View
          className={`px-2 py-1 rounded-full ${
            bookingStatus === "upcoming"
              ? "bg-blue-100"
              : bookingStatus === "completed"
              ? "bg-green-100"
              : "bg-red-100"
          }`}
        >
          <Text
            className={`text-xs font-medium ${
              bookingStatus === "upcoming"
                ? "text-blue-800"
                : bookingStatus === "completed"
                ? "text-green-800"
                : "text-red-800"
            }`}
          >
            {bookingStatus.charAt(0).toUpperCase() + bookingStatus.slice(1)}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center">
        <Ionicons name="calendar-outline" size={16} color="#15203e" />
        <Text className="ml-2 text-sm text-primary">
          {formatDate(booking.departure_date)}
        </Text>
        <Ionicons
          name="time-outline"
          size={16}
          color="#15203e"
          className="ml-4"
        />
        <Text className="ml-2 text-sm text-primary">
          {formatTime(booking.departure_date)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default function MyBookingsTab() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    async function fetchBookings() {
      const savedBookings = await AsyncStorage.getItem("noUserBookings");
      const parsedBookings = savedBookings ? JSON.parse(savedBookings) : [];
      console.log({ buchungen: parsedBookings });

      setBookings(parsedBookings);
    }

    fetchBookings();
  }, []);

  return (
    <View className="flex-1 bg-secondary/10">
      <View className="w-full bg-primary p-6 pt-20">
        <Text className="text-2xl text-white font-bold mb-2">My Bookings</Text>
        <Text className="text-base text-white/90">
          View and manage your bus ticket bookings
        </Text>
      </View>
      <FlatList
        data={bookings}
        renderItem={({ item }) => <BookingCard booking={item} />}
        keyExtractor={(item) => item._id}
        contentContainerClassName="p-4"
        ListEmptyComponent={
          <View className="items-center justify-center py-8">
            <Ionicons name="bus-outline" size={48} color="#15203e" />
            <Text className="mt-4 text-lg text-primary text-center">
              You don't have any bookings yet.
            </Text>
            <TouchableOpacity
              className="mt-4 bg-primary rounded-lg px-6 py-3"
              onPress={() => router.push("/")}
            >
              <Text className="text-white font-bold">Book a Trip</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}
