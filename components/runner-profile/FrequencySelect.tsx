import React from "react";
import { View, Text } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { useThemeColors } from "@/constants/theme";

const frequencies = [
  { key: "1-2", value: "1-2 fois par semaine" },
  { key: "3-4", value: "3-4 fois par semaine" },
  { key: "5+", value: "5 fois ou plus par semaine" },
];

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function FrequencySelect({ value, onChange }: Props) {
  const { colors } = useThemeColors();

  return (
    <View>
      <Text style={{ color: colors.text.primary }} className="text-sm font-semibold pl-2 mb-1">
        Fréquence de course*
      </Text>
      <SelectList
        setSelected={onChange}
        data={frequencies}
        save="key"
        search={false}
        defaultOption={
          value
            ? {
                key: value,
                value: frequencies.find((f) => f.key === value)?.value,
              }
            : undefined
        }
        boxStyles={{
          backgroundColor: colors.glass.light,
          borderColor: colors.glass.border,
          borderWidth: 1,
          padding: 12,
          borderRadius: 12,
        }}
        inputStyles={{ color: colors.text.primary }}
        dropdownStyles={{
          backgroundColor: colors.elevated,
          borderColor: colors.glass.border,
          borderWidth: 1,
          borderRadius: 12,
        }}
        dropdownItemStyles={{
          borderBottomColor: colors.glass.border,
          borderBottomWidth: 0.5,
          paddingVertical: 8,
        }}
        dropdownTextStyles={{ color: colors.text.secondary }}
      />
    </View>
  );
}
