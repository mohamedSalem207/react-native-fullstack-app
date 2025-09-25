import { Slot } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";
// import { StatusBar, useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  // const scheme = useColorScheme();

  return (
    <>
      {/* <StatusBar
        barStyle={scheme === "dark" ? "light-content" : "dark-content"}
      /> */}

      <StatusBar style="dark" />

      <ClerkProvider
        publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
        tokenCache={tokenCache}
      >
        <SafeAreaProvider>
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: COLORS.background,
            }}
          >
            <Slot />
          </SafeAreaView>
        </SafeAreaProvider>
      </ClerkProvider>
    </>
  );
}
