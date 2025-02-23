import React from "react";
import { View, Text, Pressable } from "react-native";

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
  const toggleDay = (day: string) => {
    if (value.includes(day)) {
      onChange(value.filter((d) => d !== day));
    } else {
      onChange([...value, day]);
    }
  };

  return (
    <View>
      <Text className="text-white text-sm font-semibold pl-2 mb-2">
        Jours d'entraînement préférés
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {daysOptions.map((day) => (
          <Pressable
            key={day.key}
            onPress={() => toggleDay(day.key)}
            className={`py-2 px-4 rounded-full ${
              value.includes(day.key)
                ? "bg-green"
                : "bg-[#1e2429] border border-[#2a3238]"
            }`}
          >
            <Text
              className={
                value.includes(day.key) ? "text-[#12171b]" : "text-white"
              }
            >
              {day.value}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
