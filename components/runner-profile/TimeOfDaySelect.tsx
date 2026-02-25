import React from "react";
import { View, Text } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { useThemeColors } from "@/constants/theme";

const timeOptions = [
  { key: "matin", value: "Matin (avant 12h)" },
  { key: "midi", value: "Midi (12h-14h)" },
  { key: "apres_midi", value: "Après-midi (14h-18h)" },
  { key: "soir", value: "Soir (après 18h)" },
  { key: "flexible", value: "Flexible" },
];

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function TimeOfDaySelect({ value, onChange }: Props) {
  const { colors } = useThemeColors();

  return (
    <View>
      <Text style={{ color: colors.text.primary }} className="text-sm font-semibold pl-2 mb-1">
        Moment préféré pour courir
      </Text>
      <SelectList
        setSelected={onChange}
        data={timeOptions}
        save="key"
        search={false}
        defaultOption={
          value
            ? {
                key: value,
                value: timeOptions.find((t) => t.key === value)?.value,
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
