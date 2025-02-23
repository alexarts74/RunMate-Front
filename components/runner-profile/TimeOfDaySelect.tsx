import React from "react";
import { View, Text } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";

const timeOptions = [
  { key: "matin", value: "Matin (avant 12h)" },
  { key: "midi", value: "Midi (12h-14h)" },
  { key: "apres_midi", value: "Après-midi (14h-18h)" },
  { key: "soir", value: "Soir (après 18h)" },
  { key: "flexible", value: "Flexible" },
];

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function TimeOfDaySelect({ value, onChange }: Props) {
  return (
    <View>
      <Text className="text-white text-sm font-semibold pl-2 mb-1">
        Moment préféré pour courir
      </Text>
      <SelectList
        setSelected={onChange}
        data={timeOptions}
        save="key"
        search={false}
        defaultOption={
          value
            ? {
                key: value,
                value: timeOptions.find((t) => t.key === value)?.value,
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
