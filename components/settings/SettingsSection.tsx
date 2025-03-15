import { View, Text, Pressable, Switch } from "react-native";
import React from "react";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";

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
    <StyledView className="space-y-4">
      <StyledView className="bg-[#1e2429] rounded-xl overflow-hidden">
        {items.map((item, index) => (
          <StyledPressable
            key={item.title}
            className={`flex-row items-center justify-between p-4 ${
              index !== items.length - 1 ? "border-b border-gray-800" : ""
            }`}
            onPress={item.onToggle}
          >
            <StyledView className="flex-row items-center space-x-3 flex-1">
              <Ionicons name={item.icon} size={24} color="#8101f7" />
              <StyledView className="flex-1">
                <StyledText className="text-white font-semibold">
                  {item.title}
                </StyledText>
                {item.description && (
                  <StyledText className="text-gray-400 text-sm">
                    {item.description}
                  </StyledText>
                )}
              </StyledView>
            </StyledView>
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: "#2a3238", true: "#8101f7" }}
              thumbColor="#fff"
            />
          </StyledPressable>
        ))}
      </StyledView>

      {description && (
        <StyledText className="text-gray-400 text-sm px-5">
          {description}
        </StyledText>
      )}
    </StyledView>
  );
}
