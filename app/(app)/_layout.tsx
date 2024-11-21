import { TabActions } from "@react-navigation/native";
import { Slot } from "expo-router";
import React from "react";
import TabLayout from "../(tabs)/_layout";

export default function AppLayout() {
  return (
    <Slot
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
