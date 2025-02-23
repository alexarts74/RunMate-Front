import React, { useState } from "react";
import { View, TextInput, Text } from "react-native";

type Props = {
  usualDistance: string;
  weeklyMileage: string;
  onChange: (field: string, value: string) => void;
  showWeekly: boolean;
};

export function DistanceInputs({
  usualDistance,
  weeklyMileage,
  onChange,
  showWeekly,
}: Props) {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  return (
    <View>
      <Text className="text-white text-sm font-semibold pl-2 mb-1">
        Distance habituelle (km)*
      </Text>
      <TextInput
        className={`bg-[#1e2429] text-white p-4 rounded-xl mb-4 ${
          focusedInput === "usual_distance" ? "border border-green" : ""
        }`}
        placeholder="Ex: 10"
        placeholderTextColor="#394047"
        value={usualDistance}
        onChangeText={(value) => onChange("usual_distance", value)}
        onFocus={() => setFocusedInput("usual_distance")}
        onBlur={() => setFocusedInput(null)}
        keyboardType="numeric"
      />

      {showWeekly && (
        <>
          <Text className="text-white text-sm font-semibold pl-2 mb-1">
            Kilométrage hebdomadaire
          </Text>
          <TextInput
            className={`bg-[#1e2429] text-white p-4 rounded-xl mb-4 ${
              focusedInput === "weekly_mileage" ? "border border-green" : ""
            }`}
            placeholder="Ex: 40"
            placeholderTextColor="#394047"
            value={weeklyMileage}
            onChangeText={(value) => onChange("weekly_mileage", value)}
            onFocus={() => setFocusedInput("weekly_mileage")}
            onBlur={() => setFocusedInput(null)}
            keyboardType="numeric"
          />
        </>
      )}
    </View>
  );
}
