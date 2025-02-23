import React from "react";
import { View, Text } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";

const frequencies = [
  { key: "1-2", value: "1-2 fois par semaine" },
  { key: "3-4", value: "3-4 fois par semaine" },
  { key: "5+", value: "5 fois ou plus par semaine" },
];

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function FrequencySelect({ value, onChange }: Props) {
  return (
    <View>
      <Text className="text-white text-sm font-semibold pl-2 mb-1">
        Fréquence de course*
      </Text>
      <SelectList
        setSelected={onChange}
        data={frequencies}
        save="key"
        search={false}
        defaultOption={
          value
            ? {
                key: value,
                value: frequencies.find((f) => f.key === value)?.value,
              }
            : undefined
        }
        boxStyles={{
          backgroundColor: "#1e2429",
          borderColor: "transparent",
          padding: 12,
        }}
        inputStyles={{ color: "white" }}
        dropdownStyles={{ backgroundColor: "#1e2429" }}
        dropdownTextStyles={{ color: "white" }}
      />
    </View>
  );
}
