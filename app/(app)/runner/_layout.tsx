import { Stack } from "expo-router";
import React from "react";

export default function RunnerLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="filters"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="runner-profile/index"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
