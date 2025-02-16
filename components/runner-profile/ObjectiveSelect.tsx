import React from "react";
import { SelectList } from "react-native-dropdown-select-list";
import { View, Text } from "react-native";
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
  return (
    <View>
      <Text className="text-white text-sm font-semibold pl-2 mb-1">
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
          borderColor: "#394047",
          borderRadius: 100,
          padding: 16,
          marginBottom: 2,
          backgroundColor: "#12171b",
        }}
        dropdownStyles={{
          borderWidth: 1,
          borderColor: "#394047",
          borderRadius: 8,
          backgroundColor: "#12171b",
        }}
        inputStyles={{ color: "#fff" }}
        dropdownTextStyles={{ color: "#fff" }}
        search={false}
      />
    </View>
  );
}
