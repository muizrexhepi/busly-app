import { useFonts } from "expo-font";
import { Stack, useNavigation } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import "../globals.css";
import { StatusBar, TouchableOpacity, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { StationsProvider } from "@/contexts/station-provider";
import useSearchStore from "@/store";
import { format } from "date-fns";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StripeProvider } from "@stripe/stripe-react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const navigation = useNavigation();
  const { fromCity, toCity, departureDate } = useSearchStore();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  if (!loaded) {
    return null;
  }

  const formatDepartureDate = (dateString: any) => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split("-");
    return format(new Date(`${year}-${month}-${day}`), "EEE, MMM d");
  };

  return (
    <StripeProvider
      merchantIdentifier="merchant.identifier"
      publishableKey="pk_test_51K1DdaDAZApOs2EVXCiMmQnlAa9TIqCpnuhrDrpiKqdTGuGlNvbbyYnaEPgl2m0Qg2WfBC6r6j2wfP2jLdDwPdnm00D2bcqz6v"
    >
      <StationsProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar barStyle="light-content" backgroundColor="#fffffe" />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="search/search-results"
              options={{
                headerTitle: () => (
                  <View style={{ alignItems: "center" }}>
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      {`${capitalize(fromCity)} to ${capitalize(toCity)}`}
                    </Text>
                    <Text style={{ color: "#bbbbbb" }}>
                      {formatDepartureDate(departureDate)}
                    </Text>
                  </View>
                ),
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
                gestureEnabled: false, // This disables the swipe-back gesture
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
                presentation: "modal",
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="close" size={24} color={"#000"} />
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
