import React from "react";
import { View, Text, Pressable } from "react-native";

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
  const toggleDay = (key: string) => {
    const newAvailability = availability?.includes(key)
      ? availability.filter((day) => day !== key)
      : [...availability, key];
    handleChange("availability", newAvailability);
  };

  return (
    <View className="mb-4">
      <Text className="text-white text-sm font-semibold pl-2 mb-2">
        Vos disponibilités*
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {availabilityOptions.map((option) => (
          <Pressable
            key={option.key}
            onPress={() => toggleDay(option.key)}
            className={`px-4 py-2 rounded-full border ${
              availability.includes(option.key)
                ? "bg-green border-green"
                : "border-gray bg-[#12171b]"
            }`}
          >
            <Text
              className={`${
                availability.includes(option.key)
                  ? "text-[#12171b]"
                  : "text-white"
              }`}
            >
              {option.value}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
