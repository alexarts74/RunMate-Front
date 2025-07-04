import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface MultiSelectProps {
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  label?: string;
}

export function MultiSelect({
  options,
  selectedValues,
  onChange,
  label,
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
      {label && <Text className="text-white text-sm mb-2">{label}</Text>}
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option);

          return (
            <Pressable
              key={option}
              onPress={() => toggleOption(option)}
              className={`flex-row items-center px-4 py-2 rounded-full border ${
                isSelected
                  ? "bg-purple border-purple"
                  : "bg-[#1e2429] border-gray-700"
              }`}
            >
              <Text
                className={`${
                  isSelected ? "text-white" : "text-white"
                } font-medium font-kanit mr-2`}
              >
                {option}
              </Text>
              <Ionicons
                name={isSelected ? "checkmark-circle" : "add-circle-outline"}
                size={16}
                color={isSelected ? "white" : "#8101f7"}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
