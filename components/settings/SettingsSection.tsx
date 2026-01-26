import { View, Text, Pressable, Switch } from "react-native";
import React from "react";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";

const ACCENT = "#F97316";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

type SettingItem = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  value: boolean;
  onToggle: () => void;
};

type SettingsSectionProps = {
  items: SettingItem[];
  description?: string;
};

export default function SettingsSection({
  items,
  description,
}: SettingsSectionProps) {
  return (
    <StyledView className="space-y-4 pt-4">
      <StyledView className="bg-white rounded-2xl overflow-hidden"
        style={{
          shadowColor: ACCENT,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        {items.map((item, index) => (
          <StyledPressable
            key={item.title}
            className={`flex-row items-center justify-between p-5 ${
              index !== items.length - 1 ? "border-b border-gray-100" : ""
            }`}
            onPress={item.onToggle}
          >
            <StyledView className="flex-row items-center space-x-4 flex-1">
              <View className="w-10 h-10 rounded-xl bg-tertiary items-center justify-center">
                <Ionicons name={item.icon} size={20} color={ACCENT} />
              </View>
              <StyledView className="flex-1">
                <StyledText className="text-gray-900 font-nunito-bold">
                  {item.title}
                </StyledText>
                {item.description && (
                  <StyledText className="text-gray-500 text-sm font-nunito-medium mt-1">
                    {item.description}
                  </StyledText>
                )}
              </StyledView>
            </StyledView>
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: "#E5E7EB", true: ACCENT }}
              thumbColor="#fff"
              ios_backgroundColor="#E5E7EB"
            />
          </StyledPressable>
        ))}
      </StyledView>

      {description && (
        <StyledText className="text-gray-500 text-sm px-6 font-nunito-medium">
          {description}
        </StyledText>
      )}
    </StyledView>
  );
}
