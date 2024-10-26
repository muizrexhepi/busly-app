import { SearchSection } from "@/components/search-section";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function HomeScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="bg-white min-h-screen p-8 flex flex-col items-center justify-center">
        <SearchSection />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
