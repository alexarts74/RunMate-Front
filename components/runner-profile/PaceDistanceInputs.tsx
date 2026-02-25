import React, { useState } from "react";
import { TextInput, Text } from "react-native";
import { useThemeColors } from "@/constants/theme";

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
  const { colors } = useThemeColors();

  return (
    <>
      <Text style={{ color: colors.text.primary }} className="text-sm font-semibold pl-2 mb-1">
        Temps de course* (min/km)
      </Text>
      <TextInput
        style={{
          width: "100%",
          borderWidth: 1,
          borderColor:
            focusedInput === "pace"
              ? colors.primary.DEFAULT
              : colors.glass.border,
          borderRadius: 9999,
          padding: 16,
          marginBottom: 16,
          backgroundColor: colors.glass.light,
          color: colors.text.primary,
        }}
        placeholder="Allure actuelle (min/km)"
        placeholderTextColor={colors.text.tertiary}
        value={actual_pace}
        onChangeText={(value) => handleChange("actual_pace", value)}
        onFocus={() => setFocusedInput("pace")}
        onBlur={() => setFocusedInput(null)}
        keyboardType="numeric"
      />

      <Text style={{ color: colors.text.primary }} className="text-sm font-semibold pl-2 mb-1">
        Distance habituelle*
      </Text>
      <TextInput
        style={{
          width: "100%",
          borderWidth: 1,
          borderColor:
            focusedInput === "distance"
              ? colors.primary.DEFAULT
              : colors.glass.border,
          borderRadius: 9999,
          padding: 16,
          marginBottom: 16,
          backgroundColor: colors.glass.light,
          color: colors.text.primary,
        }}
        placeholder="Distance habituelle (km)"
        placeholderTextColor={colors.text.tertiary}
        value={usual_distance}
        onChangeText={(value) => handleChange("usual_distance", value)}
        onFocus={() => setFocusedInput("distance")}
        onBlur={() => setFocusedInput(null)}
        keyboardType="numeric"
      />
    </>
  );
}
