import React, { useState } from "react";
import { View, TextInput, Text } from "react-native";
import { useThemeColors } from "@/constants/theme";

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
  const { colors } = useThemeColors();

  return (
    <View>
      <Text style={{ color: colors.text.primary }} className="text-sm font-semibold pl-2 mb-1">
        Allure actuelle (min/km)*
      </Text>
      <TextInput
        style={{
          backgroundColor: colors.glass.light,
          color: colors.text.primary,
          padding: 16,
          borderRadius: 12,
          marginBottom: 16,
          borderWidth: focusedInput === "actual_pace" ? 1 : 1,
          borderColor:
            focusedInput === "actual_pace"
              ? colors.primary.DEFAULT
              : colors.glass.border,
        }}
        placeholder="Ex: 5:30"
        placeholderTextColor={colors.text.tertiary}
        value={actualPace}
        onChangeText={(value) => onChange("actual_pace", value)}
        onFocus={() => setFocusedInput("actual_pace")}
        onBlur={() => setFocusedInput(null)}
      />

      {showTarget && (
        <>
          <Text style={{ color: colors.text.primary }} className="text-sm font-semibold pl-2 mb-1">
            Allure cible (min/km)
          </Text>
          <TextInput
            style={{
              backgroundColor: colors.glass.light,
              color: colors.text.primary,
              padding: 16,
              borderRadius: 12,
              marginBottom: 16,
              borderWidth: focusedInput === "target_pace" ? 1 : 1,
              borderColor:
                focusedInput === "target_pace"
                  ? colors.primary.DEFAULT
                  : colors.glass.border,
            }}
            placeholder="Ex: 5:00"
            placeholderTextColor={colors.text.tertiary}
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
