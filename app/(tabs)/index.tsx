import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import HomeBackground from "@/components/home/home-background";
import { SearchSection } from "../search/_components/search-section";

export default function HomeScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="bg-white min-h-screen relative gap-4 flex flex-col items-start justify-center">
        <HomeBackground />
        {/* <Header userProfileUrl="https://your-profile-image-url.jpg" /> */}

        <BottomSheetModalProvider>
          <SearchSection />
        </BottomSheetModalProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
