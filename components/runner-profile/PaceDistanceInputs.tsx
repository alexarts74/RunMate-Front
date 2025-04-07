import React, { useState } from "react";
import { TextInput, Text } from "react-native";

type Props = {
  actual_pace: string;
  usual_distance: string;
  handleChange: (field: string, value: string) => void;
};

export function PaceDistanceInputs({
  actual_pace,
  usual_distance,
  handleChange,
}: Props) {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  return (
    <>
      <Text className="text-white text-sm font-semibold pl-2 mb-1">
        Temps de course* (min/km)
      </Text>
      <TextInput
        className={`w-full border rounded-full p-4 mb-4 bg-[#12171b] text-white ${
          focusedInput === "pace" ? "border-purple" : "border-gray"
        }`}
        placeholder="Allure actuelle (min/km)"
        placeholderTextColor="#394047"
        value={actual_pace}
        onChangeText={(value) => handleChange("actual_pace", value)}
        onFocus={() => setFocusedInput("pace")}
        onBlur={() => setFocusedInput(null)}
        keyboardType="numeric"
      />

      <Text className="text-white text-sm font-semibold pl-2 mb-1">
        Distance habituelle*
      </Text>
      <TextInput
        className={`w-full border rounded-full p-4 mb-4 bg-[#12171b] text-white ${
          focusedInput === "distance" ? "border-purple" : "border-gray"
        }`}
        placeholder="Distance habituelle (km)"
        placeholderTextColor="#394047"
        value={usual_distance}
        onChangeText={(value) => handleChange("usual_distance", value)}
        onFocus={() => setFocusedInput("distance")}
        onBlur={() => setFocusedInput(null)}
        keyboardType="numeric"
      />
    </>
  );
}
