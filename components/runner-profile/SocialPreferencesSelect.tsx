import React from "react";
import { View, Text, Pressable } from "react-native";

const socialOptions = [
  { key: "solo", value: "Course en solo" },
  { key: "groupe", value: "Course en groupe" },
  { key: "club", value: "Club de course" },
  { key: "evenements", value: "Événements sociaux" },
  { key: "coaching", value: "Coaching personnalisé" },
];

type Props = {
  value: string[];
  onChange: (value: string[]) => void;
};

export function SocialPreferencesSelect({ value, onChange }: Props) {
  const toggleOption = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((o) => o !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <View>
      <Text className="text-white text-sm font-semibold pl-2 mb-2">
        Préférences sociales
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {socialOptions.map((option) => (
          <Pressable
            key={option.key}
            onPress={() => toggleOption(option.key)}
            className={`py-2 px-4 rounded-full ${
              value.includes(option.key)
                ? "bg-green"
                : "bg-[#1e2429] border border-[#2a3238]"
            }`}
          >
            <Text
              className={
                value.includes(option.key) ? "text-[#12171b]" : "text-white"
              }
            >
              {option.value}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
