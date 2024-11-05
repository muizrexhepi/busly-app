import React, { useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import * as Notifications from "expo-notifications";
import { cn } from "@/lib/utils";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

Notifications.scheduleNotificationAsync({
  content: {
    title: "Look at that notification",
    body: "I'm so proud of myself!",
  },
  trigger: null,
});

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<boolean>(false);

  const requestNotificationPermission = async () => {
    Alert.alert(
      "Enable Notifications",
      "Would you like to receive notifications for updates and alerts?",
      [
        {
          text: "Don't Allow",
          onPress: () => setNotifications(false),
          style: "cancel",
        },
        {
          text: "Allow",
          onPress: async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status === "granted") {
              setNotifications(true);
              Alert.alert(
                "Notifications enabled",
                "You will now receive updates and alerts."
              );
            } else {
              setNotifications(false);
              Alert.alert(
                "Permission required",
                "Enable notifications in settings to stay updated."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-secondary/5">
      {/* Header Section */}
      <Pressable
        onPress={requestNotificationPermission}
        className="bg-white p-4 "
      >
        <View className="flex-row justify-between items-center">
          <Text className="text-3xl font-bold text-primary">Notifications</Text>
          <Text className="text-lg font-medium text-secondary">
            {notifications ? "ON" : "OFF"}
          </Text>
        </View>
        <Text className="text-base text-primary mt-2">
          To stay updated on the latest schedules, discounts, and alerts, please
          enable <Text className="text-secondary/80">notifications</Text>.
        </Text>
      </Pressable>

      {/* Special Offers Section */}
      <View
        className={cn("p-4 bg-white mt-2.5", {
          "opacity-50": !notifications,
        })}
      >
        <Text className="text-xl font-semibold text-primary mb-2">
          Get special offers
        </Text>
        <Text className="text-base text-primary/60">
          Receive exclusive discounts and promotions for your bus bookings.
        </Text>
      </View>

      {/* Live Updates Section */}
      <View
        className={cn("p-4 bg-white mt-2.5", {
          "opacity-50": !notifications,
        })}
      >
        <Text className="text-xl font-semibold text-primary mb-2">
          Live updates for your trip
        </Text>
        <Text className="text-base text-primary/60">
          Stay informed about any changes to your bus schedule or seat
          availability.
        </Text>
      </View>
    </View>
  );
};

export default NotificationsPage;
