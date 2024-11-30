import { Stack } from "expo-router";
import React from "react";

export default function RunnerLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
          // Ou si vous voulez un header :
          // headerTitle: "Profil Runner",
          // headerStyle: { backgroundColor: "#12171b" },
          // headerTintColor: "#fff",
        }}
      />
    </Stack>
  );
}
