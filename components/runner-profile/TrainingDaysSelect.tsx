import React from "react";
import { View, Text, Pressable } from "react-native";
import { useThemeColors } from "@/constants/theme";

const daysOptions = [
  { key: "lundi", value: "Lundi" },
  { key: "mardi", value: "Mardi" },
  { key: "mercredi", value: "Mercredi" },
  { key: "jeudi", value: "Jeudi" },
  { key: "vendredi", value: "Vendredi" },
  { key: "samedi", value: "Samedi" },
  { key: "dimanche", value: "Dimanche" },
];

type Props = {
  value: string[];
  onChange: (value: string[]) => void;
};

export function TrainingDaysSelect({ value, onChange }: Props) {
  const { colors } = useThemeColors();

  const toggleDay = (day: string) => {
    if (value.includes(day)) {
      onChange(value.filter((d) => d !== day));
    } else {
      onChange([...value, day]);
    }
  };

  return (
    <View>
      <Text style={{ color: colors.text.primary }} className="text-sm font-semibold pl-2 mb-2">
        Jours d'entraînement préférés
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {daysOptions.map((day) => (
          <Pressable
            key={day.key}
            onPress={() => toggleDay(day.key)}
            style={{
              backgroundColor: value.includes(day.key)
                ? colors.primary.subtle
                : colors.glass.light,
              borderColor: value.includes(day.key)
                ? colors.primary.DEFAULT
                : colors.glass.border,
              borderWidth: 1,
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 9999,
            }}
          >
            <Text
              style={{
                color: value.includes(day.key)
                  ? colors.primary.dark
                  : colors.text.secondary,
              }}
            >
              {day.value}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
