import React from "react";
import { View, Text, Pressable } from "react-native";

const activityOptions = [
  { key: "etirements", value: "Étirements" },
  { key: "recuperation", value: "Récupération active" },
  { key: "nutrition", value: "Nutrition post-course" },
  { key: "analyse", value: "Analyse de performance" },
  { key: "social", value: "Partage sur les réseaux" },
  { key: "repos", value: "Repos complet" },
];

type Props = {
  value: string[];
  onChange: (value: string[]) => void;
};

export function PostRunActivitiesSelect({ value, onChange }: Props) {
  const toggleActivity = (activity: string) => {
    if (value.includes(activity)) {
      onChange(value.filter((a) => a !== activity));
    } else {
      onChange([...value, activity]);
    }
  };

  return (
    <View>
      <Text className="text-white text-sm font-semibold pl-2 mb-2">
        Activités post-course
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {activityOptions.map((activity) => (
          <Pressable
            key={activity.key}
            onPress={() => toggleActivity(activity.key)}
            className={`py-2 px-4 rounded-full ${
              value.includes(activity.key)
                ? "bg-purple"
                : "bg-[#1e2429] border border-[#2a3238]"
            }`}
          >
            <Text
              className={
                value.includes(activity.key) ? "text-[#12171b]" : "text-white"
              }
            >
              {activity.value}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
