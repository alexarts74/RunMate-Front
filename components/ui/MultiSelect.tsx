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
      {label && <Text className="text-gray-900 text-sm mb-2 font-kanit-bold">{label}</Text>}
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option);

          return (
            <Pressable
              key={option}
              onPress={() => toggleOption(option)}
              className={`flex-row items-center px-4 py-2.5 rounded-full border-2 ${
                isSelected
                  ? "bg-primary border-primary"
                  : "bg-white border-gray-200"
              }`}
              style={{
                shadowColor: isSelected ? "#FF6B4A" : "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isSelected ? 0.2 : 0.05,
                shadowRadius: 4,
                elevation: isSelected ? 3 : 1,
              }}
            >
              <Text
                className={`${
                  isSelected ? "text-white" : "text-gray-700"
                } font-kanit-bold text-sm mr-2`}
              >
                {option}
              </Text>
              <Ionicons
                name={isSelected ? "checkmark-circle" : "add-circle-outline"}
                size={16}
                color={isSelected ? "white" : "#FF6B4A"}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
