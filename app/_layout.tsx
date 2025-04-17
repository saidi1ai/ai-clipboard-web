import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { useAppTheme } from "@/utils/theme-helper";
import { useAuthStore } from "@/store/auth-store";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// This function handles authentication state and redirects
function useProtectedRoute(user: any) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    
    // If the user is not signed in and the initial segment is not in the auth group,
    // redirect to the sign-in page.
    if (!user && !inAuthGroup && segments[0] !== undefined) {
      router.replace("/auth");
    } else if (user && inAuthGroup) {
      // Redirect away from auth group if the user is signed in
      router.replace("/");
    }
  }, [user, segments]);
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <RootLayoutNav />
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  const { card, text } = useAppTheme();
  const { user } = useAuthStore();
  
  // Use the custom hook to handle protected routes
  useProtectedRoute(user);
  
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="item/[id]" 
        options={{ 
          headerShown: true,
          headerStyle: { backgroundColor: card },
          headerTitleStyle: { color: text },
        }} 
      />
      <Stack.Screen 
        name="prompt-editor" 
        options={{ 
          headerShown: true,
          headerStyle: { backgroundColor: card },
          headerTitleStyle: { color: text },
        }} 
      />
      <Stack.Screen 
        name="profile" 
        options={{ 
          headerShown: true,
          headerStyle: { backgroundColor: card },
          headerTitleStyle: { color: text },
        }} 
      />
      <Stack.Screen 
        name="subscription" 
        options={{ 
          headerShown: true,
          headerStyle: { backgroundColor: card },
          headerTitleStyle: { color: text },
        }} 
      />
    </Stack>
  );
}