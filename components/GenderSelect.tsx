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
        placeholder="Etes-vous ?"
        boxStyles={{
          backgroundColor: "#ffffff",
          borderColor: "#E5E7EB",
          borderWidth: 2,
          padding: 16,
          borderRadius: 9999,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
        }}
        inputStyles={{ 
          color: "#111827",
          fontFamily: "Nunito-Medium",
        }}
        dropdownStyles={{
          backgroundColor: "#ffffff",
          borderRadius: 16,
          marginTop: 4,
          borderColor: "#E5E7EB",
          borderWidth: 2,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 5,
        }}
        dropdownTextStyles={{ 
          color: "#111827",
          fontFamily: "Nunito-Medium",
        }}
        dropdownItemStyles={{
          borderBottomColor: "#F3F4F6",
          borderBottomWidth: 1,
        }}
      />
    </View>
  );
}
