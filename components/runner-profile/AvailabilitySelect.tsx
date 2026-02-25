import React from "react";
import { View, Text, Pressable } from "react-native";
import { useThemeColors } from "@/constants/theme";

const availabilityOptions = [
  { key: "monday", value: "Lundi" },
  { key: "tuesday", value: "Mardi" },
  { key: "wednesday", value: "Mercredi" },
  { key: "thursday", value: "Jeudi" },
  { key: "friday", value: "Vendredi" },
  { key: "saturday", value: "Samedi" },
  { key: "sunday", value: "Dimanche" },
];

type Props = {
  availability: string[];
  handleChange: (field: string, value: string[]) => void;
};

export function AvailabilitySelect({ availability, handleChange }: Props) {
  const { colors } = useThemeColors();

  const toggleDay = (key: string) => {
    const newAvailability = availability?.includes(key)
      ? availability.filter((day) => day !== key)
      : [...availability, key];
    handleChange("availability", newAvailability);
  };

  return (
    <View className="mb-4">
      <Text style={{ color: colors.text.primary }} className="text-sm font-semibold pl-2 mb-2">
        Vos disponibilités*
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {availabilityOptions.map((option) => (
          <Pressable
            key={option.key}
            onPress={() => toggleDay(option.key)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 9999,
              borderWidth: 1,
              backgroundColor: availability.includes(option.key)
                ? colors.primary.subtle
                : colors.glass.light,
              borderColor: availability.includes(option.key)
                ? colors.primary.DEFAULT
                : colors.glass.border,
            }}
          >
            <Text
              style={{
                color: availability.includes(option.key)
                  ? colors.primary.dark
                  : colors.text.secondary,
              }}
            >
              {option.value}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
