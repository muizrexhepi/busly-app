import { SearchSection } from "@/components/search-section";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Header from "@/components/header";
import MapBackground from "@/components/home/map-background";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function HomeScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="bg-white min-h-screen relative p-4 gap-4 flex flex-col items-start justify-start">
        <MapBackground />
        <Header userProfileUrl="https://your-profile-image-url.jpg" />

        <BottomSheetModalProvider>
          <SearchSection />
        </BottomSheetModalProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
