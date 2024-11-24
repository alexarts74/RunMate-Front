import React from "react";
import { TextInput } from "react-native";

type Props = {
  actual_pace: string;
  usual_distance: string;
  handleChange: (field: string, value: string) => void;
};

export function PaceDistanceInputs({
  actual_pace,
  usual_distance,
  handleChange,
}: Props) {
  return (
    <>
      <TextInput
        className="w-full border border-gray-700 rounded-lg p-4 mb-4 bg-gray-900 text-white"
        placeholder="Allure actuelle (min/km)"
        placeholderTextColor="#9CA3AF"
        value={actual_pace}
        onChangeText={(value) => handleChange("actual_pace", value)}
        keyboardType="numeric"
      />

      <TextInput
        className="w-full border border-gray-700 rounded-lg p-4 mb-4 bg-gray-900 text-white"
        placeholder="Distance habituelle (km)"
        placeholderTextColor="#9CA3AF"
        value={usual_distance}
        onChangeText={(value) => handleChange("usual_distance", value)}
        keyboardType="numeric"
      />
    </>
  );
}
