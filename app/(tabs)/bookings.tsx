import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Booking } from "@/models/booking";
import moment from "moment-timezone";
import { BackgroundGradient } from "@/components/linear-gradient";

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
    <View className="flex-1 bg-gray-50">
      *{" "}
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
          <View className="items-center justify-center py-12 px-4">
            {/* <Image
              source={require('../assets/empty-bookings.png')} // Make sure to add this image
              className="w-48 h-48 mb-6"
              resizeMode="contain"
            /> */}
            <Text className="text-2xl font-semibold text-gray-800 text-center mb-2">
              No Bookings Yet
            </Text>
            <Text className="text-base text-gray-600 text-center mb-8">
              Your booked trips will appear here. Start your journey today!
            </Text>
            <BackgroundGradient>
              <TouchableOpacity
                className="rounded-full px-8 py-3 shadow-md"
                onPress={() => router.push("/")}
              >
                <Text className="text-white font-bold text-lg">
                  Book a Trip
                </Text>
              </TouchableOpacity>
            </BackgroundGradient>
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => router.push("/retrieve-booking")}
            >
              <Ionicons name="search-outline" size={20} color="#4b5563" />
              <Text className="ml-2 text-gray-600 font-semibold">
                Retrieve a Booking
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}
