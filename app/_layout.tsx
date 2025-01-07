import { useFonts } from "expo-font";
import { Stack, useNavigation } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import "../globals.css";
import { StatusBar, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { StationsProvider } from "@/contexts/station-provider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StripeProvider } from "@stripe/stripe-react-native";
import SearchHeader from "./search/_components/search-header";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const navigation = useNavigation();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <StripeProvider
      merchantIdentifier="merchant.identifier"
      publishableKey="pk_test_51QQXt1EOf85LOQH5JbGWAzCrbipG9QGLZa8Go8rQLGmMQUczF1DsFAVdTlcdfSLfUhCkDtdTNNbeQ9GiIpGZtnm900a2iR3eyY"
    >
      <StationsProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar barStyle="light-content" backgroundColor="#fffffe" />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="search/search-results"
              options={{
                headerTitle: () => <SearchHeader />,
                headerStyle: {
                  backgroundColor: "#15203e",
                },
                headerTintColor: "white",
                headerShadowVisible: false,
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={24} color={"white"} />
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="checkout/index"
              options={{
                title: "Checkout",
                headerStyle: {
                  backgroundColor: "#15203e",
                },
                headerLargeTitle: true,
                headerLargeTitleShadowVisible: false,
                headerTintColor: "white",
                headerShadowVisible: false,
                headerLeft: () => (
                  <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="flex-row items-center gap-2"
                  >
                    <AntDesign name="left" size={24} color={"white"} />
                    <Text className="text-white font-medium text-lg">
                      Select trip
                    </Text>
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="profile/settings/index"
              options={{
                title: "Settings",
                headerStyle: {
                  backgroundColor: "#15203e",
                },
                headerTintColor: "white",
                headerShadowVisible: false,
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={24} color={"white"} />
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="profile/notifications/index"
              options={{
                title: "Notifications",
                headerStyle: {
                  backgroundColor: "#15203e",
                },
                headerTintColor: "white",
                headerShadowVisible: false,
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={24} color={"white"} />
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="profile/payment-methods/index"
              options={{
                title: "Payment Methods",
                headerStyle: {
                  backgroundColor: "#15203e",
                },
                headerTintColor: "white",
                headerShadowVisible: false,
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={24} color={"white"} />
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="booking-details/[id]/index"
              options={{
                title: "Booking Details",
                headerStyle: {
                  backgroundColor: "#15203e",
                },
                headerTintColor: "white",
                headerShadowVisible: false,
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={24} color={"white"} />
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="profile/support/index"
              options={{
                title: "Support",
                headerStyle: {
                  backgroundColor: "#15203e",
                },
                headerTintColor: "white",
                headerShadowVisible: false,
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={24} color={"white"} />
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="checkout/success/index"
              options={({ navigation }) => ({
                headerShown: false,
                gestureEnabled: false,
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={24} color="white" />
                  </TouchableOpacity>
                ),
                headerStyle: {
                  backgroundColor: "transparent",
                },
              })}
            />
            <Stack.Screen name="+not-found" />
            <Stack.Screen
              name="(modal)/from-select"
              options={{
                title: "Select From",
                headerStyle: {
                  backgroundColor: "#15203e",
                },
                headerTintColor: "white",
                headerShadowVisible: false,
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={24} color={"white"} />
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="(modal)/sign-in"
              options={{
                headerTitle: "",
                // presentation: "modal",
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={24} color={"#000"} />
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="(modal)/sign-up"
              options={{
                headerTitle: "",
                // presentation: "modal",
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={24} color={"#000"} />
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="(modal)/add-payment-method"
              options={{
                headerTitle: "Add New Card",
                presentation: "modal",
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="close" size={24} color={"#000"} />
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="profile/personal-information/index"
              options={{
                title: "Personal Information",
                headerStyle: {
                  backgroundColor: "#15203e",
                },
                headerTintColor: "white",
                headerShadowVisible: false,
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={24} color={"white"} />
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="(modal)/to-select"
              options={{
                title: "Select To",
                headerStyle: {
                  backgroundColor: "#15203e",
                },
                headerTintColor: "white",
                headerShadowVisible: false,
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={24} color={"white"} />
                  </TouchableOpacity>
                ),
              }}
            />
          </Stack>
        </GestureHandlerRootView>
      </StationsProvider>
    </StripeProvider>
  );
}
