import { Stack } from "expo-router";
import { useAppTheme } from "@/utils/theme-helper";

export default function AuthLayout() {
  const { card, text } = useAppTheme();
  
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
        }} 
      />
    </Stack>
  );
}