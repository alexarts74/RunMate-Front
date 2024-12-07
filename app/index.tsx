import { View } from "react-native";
import React from "react";
import WelcomePage from "@/components/WelcomePage";


export default function HomeScreen() {

  return (
    <View className="flex-1 justify-center items-center bg-[#12171b]">
      <WelcomePage />
    </View>
  );
}
