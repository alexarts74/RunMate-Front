import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface MultiSelectProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export function MultiSelect({
  label,
  options,
  selectedValues,
  onChange,
}: MultiSelectProps) {
  const toggleOption = (option: string) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter((value) => value !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  return (
    <View>
      <Text className="text-white text-sm font-semibold mb-2">{label}</Text>

      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option);

          return (
            <Pressable
              key={option}
              onPress={() => toggleOption(option)}
              className={`flex-row items-center px-4 py-2 rounded-full border ${
                isSelected
                  ? "bg-green border-green"
                  : "bg-[#1e2429] border-[#2a3238]"
              }`}
            >
              <Text
                className={`${
                  isSelected ? "text-[#12171b]" : "text-white"
                } font-medium mr-2`}
              >
                {option}
              </Text>
              <Ionicons
                name={isSelected ? "checkmark-circle" : "add-circle-outline"}
                size={16}
                color={isSelected ? "#12171b" : "#b9f144"}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
