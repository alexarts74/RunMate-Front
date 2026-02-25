import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors, typography, radii } from "@/constants/theme";

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
  const { colors, shadows } = useThemeColors();

  const toggleOption = (option: string) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter((value) => value !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  return (
    <View>
      {label && (
        <Text style={[styles.label, { color: colors.text.primary }]}>
          {label}
        </Text>
      )}
      <View style={styles.optionsRow}>
        {options.map((option) => {
          const isSelected = selectedValues.includes(option);

          return (
            <Pressable
              key={option}
              onPress={() => toggleOption(option)}
              style={[
                styles.option,
                isSelected
                  ? {
                      backgroundColor: colors.primary.DEFAULT,
                      borderColor: colors.primary.DEFAULT,
                      ...shadows.md,
                    }
                  : {
                      backgroundColor: colors.glass.light,
                      borderColor: colors.glass.border,
                      ...shadows.sm,
                    },
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: isSelected ? "#FFFFFF" : colors.text.secondary },
                ]}
              >
                {option}
              </Text>
              <Ionicons
                name={isSelected ? "checkmark-circle" : "add-circle-outline"}
                size={16}
                color={isSelected ? "#FFFFFF" : colors.primary.DEFAULT}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: typography.label.fontFamily,
    fontSize: typography.label.fontSize,
    marginBottom: 8,
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radii.full,
    borderWidth: 2,
  },
  optionText: {
    fontFamily: typography.label.fontFamily,
    fontSize: typography.caption.fontSize,
    marginRight: 8,
  },
});
