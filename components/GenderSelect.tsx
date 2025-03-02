import React from "react";
import { View, Text } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";

const genderOptions = [
  { key: "homme", value: "Homme" },
  { key: "femme", value: "Femme" },
  { key: "autre", value: "Autre" },
  { key: "non_precise", value: "Je préfère ne pas préciser" },
];

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function GenderSelect({ value, onChange }: Props) {
  return (
    <View>
      <SelectList
        setSelected={onChange}
        data={genderOptions}
        save="key"
        search={false}
        defaultOption={
          value
            ? {
                key: value,
                value: genderOptions.find((g) => g.key === value)?.value,
              }
            : undefined
        }
        placeholder="Sélectionnez votre genre"
        boxStyles={{
          backgroundColor: "#1e2429",
          borderColor: "#374151",
          padding: 12,
          borderRadius: 200,
        }}
        inputStyles={{ color: "white" }}
        dropdownStyles={{
          backgroundColor: "#1e2429",
          borderRadius: 12,
          marginTop: 4,
          borderColor: "#374151",
        }}
        dropdownTextStyles={{ color: "white" }}
        dropdownItemStyles={{
          borderBottomColor: "#374151",
        }}
      />
    </View>
  );
}
