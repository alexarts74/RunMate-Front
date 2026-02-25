import React, { useState } from "react";
import { View, TextInput, Text } from "react-native";
import { useThemeColors } from "@/constants/theme";

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
  const { colors } = useThemeColors();

  return (
    <View>
      <Text style={{ color: colors.text.primary }} className="text-sm font-semibold pl-2 mb-1">
        Distance habituelle (km)*
      </Text>
      <TextInput
        style={{
          backgroundColor: colors.glass.light,
          color: colors.text.primary,
          padding: 16,
          borderRadius: 12,
          marginBottom: 16,
          borderWidth: focusedInput === "usual_distance" ? 1 : 1,
          borderColor:
            focusedInput === "usual_distance"
              ? colors.primary.DEFAULT
              : colors.glass.border,
        }}
        placeholder="Ex: 10"
        placeholderTextColor={colors.text.tertiary}
        value={usualDistance}
        onChangeText={(value) => onChange("usual_distance", value)}
        onFocus={() => setFocusedInput("usual_distance")}
        onBlur={() => setFocusedInput(null)}
        keyboardType="numeric"
      />

      {showWeekly && (
        <>
          <Text style={{ color: colors.text.primary }} className="text-sm font-semibold pl-2 mb-1">
            Kilométrage hebdomadaire
          </Text>
          <TextInput
            style={{
              backgroundColor: colors.glass.light,
              color: colors.text.primary,
              padding: 16,
              borderRadius: 12,
              marginBottom: 16,
              borderWidth: focusedInput === "weekly_mileage" ? 1 : 1,
              borderColor:
                focusedInput === "weekly_mileage"
                  ? colors.primary.DEFAULT
                  : colors.glass.border,
            }}
            placeholder="Ex: 40"
            placeholderTextColor={colors.text.tertiary}
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
