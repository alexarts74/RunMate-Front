import React from "react";
import { SelectList } from "react-native-dropdown-select-list";
import { View, Text } from "react-native";
import { useThemeColors } from "@/constants/theme";

const objectiveOptions = [
  {
    key: "5km_sous_25min",
    value: "5km sous 25min",
  },
  {
    key: "10km_sous_50min",
    value: "10km sous 50min",
  },
  {
    key: "premier_semi_marathon",
    value: "Premier semi-marathon",
  },
  {
    key: "premier_marathon",
    value: "Premier marathon",
  },
  {
    key: "preparation_trail",
    value: "Préparation trail",
  },
  {
    key: "ameliorer_endurance",
    value: "Améliorer son endurance",
  },
  {
    key: "perdre_du_poids",
    value: "Perdre du poids",
  },
  {
    key: "course_reguliere",
    value: "Course régulière",
  },
];

type Props = {
  handleChange: (field: string, value: string) => void;
};

export function ObjectiveSelect({ handleChange }: Props) {
  const { colors } = useThemeColors();

  return (
    <View>
      <Text style={{ color: colors.text.primary }} className="text-sm font-semibold pl-2 mb-1">
        Objectif
      </Text>

      <SelectList
        setSelected={(selectedValue: string) => {
          // selectedValue sera la clé (key) car save="key"
          handleChange("objective", selectedValue);
        }}
        data={objectiveOptions}
        save="key"
        placeholder="Votre objectif"
        boxStyles={{
          borderWidth: 1,
          borderColor: colors.glass.border,
          borderRadius: 100,
          padding: 16,
          marginBottom: 2,
          backgroundColor: colors.glass.light,
        }}
        dropdownStyles={{
          borderWidth: 1,
          borderColor: colors.glass.border,
          borderRadius: 8,
          backgroundColor: colors.elevated,
        }}
        inputStyles={{ color: colors.text.primary }}
        dropdownTextStyles={{ color: colors.text.secondary }}
        search={false}
      />
    </View>
  );
}
