import { View } from "react-native";
import { useAuth } from "@/context/AuthContext";
import React from "react";
import WelcomePage from "@/components/WelcomePage";

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <View className="flex-1 justify-center items-center bg-black">
      <WelcomePage />
    </View>
  );
}
