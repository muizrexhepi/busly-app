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
    <StationsProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" backgroundColor="#fffffe" />
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
                backgroundColor: "#080e2c",
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
            name="checkout/checkout"
            options={{
              title: "Checkout",
              headerStyle: {
                backgroundColor: "#080e2c",
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
          <Stack.Screen name="+not-found" />
          <Stack.Screen
            name="(modal)/from-select"
            options={{
              title: "Select From",
              headerStyle: {
                backgroundColor: "#080e2c",
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
                backgroundColor: "#080e2c",
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
  );
}
