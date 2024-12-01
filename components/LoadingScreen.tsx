import { useAuth } from "@/context/AuthContext";
import React from "react";
import { Text } from "react-native";

export default function LoadingScreen() {
  const { isLoading } = useAuth();
  return <Text>Loading...</Text>;
}
