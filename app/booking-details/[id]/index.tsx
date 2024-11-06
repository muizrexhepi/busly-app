import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Modal,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { Booking } from "@/models/booking";
import { getBookingByIdWithChargeData } from "@/actions/bookings";
import { openBrowserAsync } from "expo-web-browser";
import QRCode from "react-native-qrcode-svg";
import { environment } from "@/environment";

const InfoBlock = ({
  desc,
  title,
  href,
}: {
  desc: string;
  title: string;
  href?: string;
}) => (
  <View className="flex-row justify-between items-center mt-2">
    <View className="flex-1">
      <Text className="text-xs text-primary/70">{desc}</Text>
      <Text className="font-bold text-primary">{title}</Text>
    </View>
    {href && (
      <TouchableOpacity
        onPress={() => {
          /* Handle navigation */
        }}
      >
        <Ionicons name="chevron-forward" size={20} color="#0000EE" />
      </TouchableOpacity>
    )}
  </View>
);

const BookingDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const [booking, setBooking] = useState<Booking>();
  const [loading, setLoading] = useState<boolean>(false);
  const [showQRModal, setShowQRModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true);
      try {
        const data = await getBookingByIdWithChargeData(id, true);
        setBooking(data);
      } catch (error) {
        console.log({ error });
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const departureDate = moment(booking?.departure_date).format("MMM D, YYYY");

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-primary/70/10">
        <ActivityIndicator size="large" color="#15203e" />
      </View>
    );
  }

  if (!booking) {
    return (
      <View className="flex-1 justify-center items-center bg-primary/70/10">
        <Text className="text-primary text-lg">Something went wrong</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-secondary/10">
      <View className="flex gap-3">
        <View className="bg-white p-4">
          <View className="flex-row items-center mb-4 justify-between">
            <Text className="text-2xl font-semibold text-primary">
              Trip Information
            </Text>
          </View>
          <View className="space-y-4">
            <View className="flex-row justify-between">
              <View className="flex-row items-center">
                <Ionicons
                  name="location"
                  size={20}
                  color="#15203e"
                  className="mr-2"
                />
                <View>
                  <Text className="font-bold capitalize text-primary">
                    {booking?.labels?.from_city}
                  </Text>
                  <Text className="text-xs text-primary/70">
                    {booking?.destinations?.departure_station_label}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center">
                <Ionicons
                  name="location"
                  size={20}
                  color="#15203e"
                  className="mr-2"
                />
                <View>
                  <Text className="font-bold capitalize text-primary text-right">
                    {booking?.labels?.to_city}
                  </Text>
                  <Text className="text-xs text-primary/70 text-right">
                    {booking?.destinations?.arrival_station_label}
                  </Text>
                </View>
              </View>
            </View>
            <View className="flex-row justify-between">
              <View className="flex-row items-center">
                <Ionicons
                  name="calendar"
                  size={20}
                  color="#15203e"
                  className="mr-2"
                />
                <Text className="text-primary">{departureDate}</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons
                  name="time"
                  size={20}
                  color="#15203e"
                  className="mr-2"
                />
                <Text className="text-primary">
                  {moment.utc(booking?.departure_date).format("HH:mm")}
                </Text>
              </View>
            </View>
            <InfoBlock
              desc="Operated by"
              title={booking?.operator?.name}
              href={booking?.operator?._id}
            />
          </View>
        </View>

        <View className="bg-white p-4">
          <View className="flex-row items-center mb-4">
            <Text className="text-2xl font-semibold text-primary">
              Passenger Information
            </Text>
          </View>
          {booking?.passengers?.map((passenger, index) => (
            <React.Fragment key={index}>
              {index > 0 && <View className="h-px bg-primary/70/20 my-4" />}
              <View>
                <Text className="text-base font-bold mb-2 text-primary">
                  Passenger {index + 1}
                </Text>
                <View className="space-y-2">
                  <View className="flex-row justify-between">
                    <Text className="font-bold text-primary">Full Name:</Text>
                    <Text className="text-primary/70">
                      {passenger?.full_name}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="font-bold text-primary">Email:</Text>
                    <Text className="text-primary/70">{passenger?.email}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="font-bold text-primary">Phone:</Text>
                    <Text className="text-primary/70">{passenger?.phone}</Text>
                  </View>
                </View>
              </View>
            </React.Fragment>
          ))}
        </View>

        <View className="bg-white p-4">
          <View className="flex-row items-center mb-4">
            <Text className="text-2xl font-semibold text-primary">
              Payment Information
            </Text>
          </View>
          <View className="space-y-4">
            <View className="flex-row justify-between items-center">
              <Text className="font-bold text-primary">Total Price:</Text>
              <Text className="text-2xl font-bold text-primary">
                ${booking?.price?.toFixed(2)}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-primary">Payment Status:</Text>
              <View
                className={`px-2 py-1 rounded-full ${
                  booking?.is_paid ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    booking?.is_paid ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {booking?.is_paid ? "Paid" : "Unpaid"}
                </Text>
              </View>
            </View>
            {booking?.charge && (
              <View className="space-y-2">
                <Text className="font-bold text-primary">Charge Details:</Text>
                <View className="space-y-2">
                  {booking?.metadata.deposited_money.used && (
                    <View className="flex-row justify-between">
                      <Text className="text-primary">
                        Amount Used From Deposit:
                      </Text>
                      <Text className="text-primary/70">
                        $
                        {(
                          booking?.metadata?.deposited_money?.amount_in_cents /
                          100
                        ).toFixed(2)}
                      </Text>
                    </View>
                  )}
                  <View className="flex-row justify-between">
                    <Text className="text-primary">Amount Charged:</Text>
                    <Text className="text-primary/70">
                      ${(booking?.charge?.amount / 100).toFixed(2)}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-primary">Currency:</Text>
                    <Text className="text-primary/70">
                      {booking?.charge?.currency.toUpperCase()}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-primary">Card:</Text>
                    <Text className="text-primary/70">
                      {booking?.charge.payment_method_details.card.brand.toUpperCase()}{" "}
                      **** {booking?.charge.payment_method_details.card.last4}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>

        <View className="bg-white p-4">
          <View className="flex-row items-center mb-4">
            <Text className="text-2xl font-semibold text-primary">
              Contact Information
            </Text>
          </View>
          <View className="space-y-2">
            <View className="flex-row items-center">
              <Ionicons
                name="mail"
                size={20}
                color="#15203e"
                className="mr-2"
              />
              <Text className="text-primary/70">
                {booking?.passengers[0].email}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons
                name="call"
                size={20}
                color="#15203e"
                className="mr-2"
              />
              <Text className="text-primary/70">
                {booking?.passengers[0].phone}
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-white p-4 pb-10">
          <Text className="text-2xl font-semibold mb-4 text-primary">
            Booking Metadata
          </Text>
          <View className="space-y-2">
            <View>
              <Text className="text-xs text-primary/70">Charge ID:</Text>
              <Text className="font-mono text-xs bg-primary/70/10 p-2 rounded text-primary">
                {booking?.charge?.id}
              </Text>
            </View>
            <View>
              <Text className="text-xs text-primary/70">
                Payment Intent ID:
              </Text>
              <Text className="font-mono text-xs bg-primary/70/10 p-2 rounded text-primary">
                {booking?.metadata.payment_intent_id}
              </Text>
            </View>
            <View className="flex-row justify-between items-center gap-4">
              {booking?.charge?.receipt_url && (
                <TouchableOpacity
                  className="bg-primary rounded-lg p-3 items-center mt-4 flex-1"
                  onPress={() => {
                    openBrowserAsync(booking?.charge?.receipt_url!);
                  }}
                >
                  <Text className="text-white font-bold">View Receipt</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                className="bg-primary rounded-lg p-3 items-center mt-4 flex-1"
                onPress={() => setShowQRModal(true)}
              >
                <Text className="text-white font-bold">View QR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <Modal visible={showQRModal} transparent>
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-lg p-6 items-center">
            <Text className="text-lg font-bold mb-4">Booking QR Code</Text>
            <QRCode
              value={`${environment.base_url}/authorize-booking?id=${booking?._id}`}
              size={200}
            />
            <TouchableOpacity
              className="bg-primary rounded-lg px-4 py-2 mt-4"
              onPress={() => setShowQRModal(false)}
            >
              <Text className="text-white font-bold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default BookingDetailsScreen;
