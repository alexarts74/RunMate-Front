import React from "react";
import { View, Text, Pressable } from "react-native";
import { useThemeColors } from "@/constants/theme";

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
  const { colors } = useThemeColors();

  const toggleActivity = (activity: string) => {
    if (value.includes(activity)) {
      onChange(value.filter((a) => a !== activity));
    } else {
      onChange([...value, activity]);
    }
  };

  return (
    <View>
      <Text style={{ color: colors.text.primary }} className="text-sm font-semibold pl-2 mb-2">
        Activités post-course
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {activityOptions.map((activity) => (
          <Pressable
            key={activity.key}
            onPress={() => toggleActivity(activity.key)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 9999,
              borderWidth: 1,
              backgroundColor: value.includes(activity.key)
                ? colors.primary.subtle
                : colors.glass.light,
              borderColor: value.includes(activity.key)
                ? colors.primary.DEFAULT
                : colors.glass.border,
            }}
          >
            <Text
              style={{
                color: value.includes(activity.key)
                  ? colors.primary.dark
                  : colors.text.secondary,
              }}
            >
              {activity.value}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
