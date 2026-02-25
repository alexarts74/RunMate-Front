import React from "react";
import { View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { useThemeColors, radii } from "@/constants/theme";

const genderOptions = [
  { key: "homme", value: "Homme" },
  { key: "femme", value: "Femme" },
  { key: "autre", value: "Autre" },
  { key: "non_precise", value: "Je préfère ne pas préciser" },
];

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function GenderSelect({ value, onChange }: Props) {
  const { colors, shadows } = useThemeColors();

  return (
    <View>
      <SelectList
        setSelected={onChange}
        data={genderOptions}
        save="key"
        search={false}
        defaultOption={
          value
            ? {
                key: value,
                value: genderOptions.find((g) => g.key === value)?.value,
              }
            : undefined
        }
        placeholder="Etes-vous ?"
        boxStyles={{
          backgroundColor: colors.glass.light,
          borderColor: colors.glass.border,
          borderWidth: 1,
          padding: 16,
          borderRadius: radii.md,
          ...shadows.sm,
        }}
        inputStyles={{
          color: colors.text.primary,
          fontFamily: "Nunito-Medium",
        }}
        dropdownStyles={{
          backgroundColor: colors.elevated,
          borderRadius: radii.md,
          marginTop: 4,
          borderColor: colors.glass.border,
          borderWidth: 1,
          ...shadows.md,
        }}
        dropdownTextStyles={{
          color: colors.text.primary,
          fontFamily: "Nunito-Medium",
        }}
        dropdownItemStyles={{
          borderBottomColor: colors.surface,
          borderBottomWidth: 1,
        }}
      />
    </View>
  );
}
