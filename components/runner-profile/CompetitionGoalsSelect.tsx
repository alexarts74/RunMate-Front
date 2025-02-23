import React from "react";
import { View, Text } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";

const competitionGoals = [
  { key: "5km", value: "Course 5km" },
  { key: "10km", value: "Course 10km" },
  { key: "semi_marathon", value: "Semi-marathon" },
  { key: "marathon", value: "Marathon" },
  { key: "trail", value: "Trail" },
  { key: "ultra_trail", value: "Ultra-trail" },
  { key: "course_locale", value: "Course locale" },
];

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function CompetitionGoalsSelect({ value, onChange }: Props) {
  return (
    <View>
      <Text className="text-white text-sm font-semibold pl-2 mb-1">
        Objectif de compétition
      </Text>
      <SelectList
        setSelected={onChange}
        data={competitionGoals}
        save="key"
        search={false}
        defaultOption={
          value
            ? {
                key: value,
                value: competitionGoals.find((g) => g.key === value)?.value,
              }
            : undefined
        }
        boxStyles={{
          backgroundColor: "#1e2429",
          borderColor: "transparent",
          padding: 12,
          borderRadius: 12,
        }}
        inputStyles={{ color: "white" }}
        dropdownStyles={{ backgroundColor: "#1e2429", borderRadius: 12 }}
        dropdownTextStyles={{ color: "white" }}
      />
    </View>
  );
}
