// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
import { type IconProps } from "@expo/vector-icons/build/createIconSet";
import { type ComponentProps } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { View, TouchableOpacity } from "react-native";

interface TabBarIconProps
  extends IconProps<ComponentProps<typeof Ionicons>["name"]> {
  focused?: boolean;
  onPress?: () => void;
}

export function TabBarIcon({
  style,
  focused,
  onPress,
  ...rest
}: TabBarIconProps) {
  const IconComponent = (
    <Ionicons
      size={24}
      style={[{ marginBottom: 2, fontFamily: "Kanit" }, style]}
      {...rest}
    />
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {IconComponent}
      </TouchableOpacity>
    );
  }

  return IconComponent;
}
