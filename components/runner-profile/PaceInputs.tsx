import React, { useState } from "react";
import { View, TextInput, Text } from "react-native";

type Props = {
  actualPace: string;
  targetPace: string;
  onChange: (field: string, value: string) => void;
  showTarget: boolean;
};

export function PaceInputs({
  actualPace,
  targetPace,
  onChange,
  showTarget,
}: Props) {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  return (
    <View>
      <Text className="text-white text-sm font-semibold pl-2 mb-1">
        Allure actuelle (min/km)*
      </Text>
      <TextInput
        className={`bg-[#1e2429] text-white p-4 rounded-xl mb-4 ${
          focusedInput === "actual_pace" ? "border border-purple" : ""
        }`}
        placeholder="Ex: 5:30"
        placeholderTextColor="#394047"
        value={actualPace}
        onChangeText={(value) => onChange("actual_pace", value)}
        onFocus={() => setFocusedInput("actual_pace")}
        onBlur={() => setFocusedInput(null)}
      />

      {showTarget && (
        <>
          <Text className="text-white text-sm font-semibold pl-2 mb-1">
            Allure cible (min/km)
          </Text>
          <TextInput
            className={`bg-[#1e2429] text-white p-4 rounded-xl mb-4 ${
              focusedInput === "target_pace" ? "border border-purple" : ""
            }`}
            placeholder="Ex: 5:00"
            placeholderTextColor="#394047"
            value={targetPace}
            onChangeText={(value) => onChange("target_pace", value)}
            onFocus={() => setFocusedInput("target_pace")}
            onBlur={() => setFocusedInput(null)}
          />
        </>
      )}
    </View>
  );
}
