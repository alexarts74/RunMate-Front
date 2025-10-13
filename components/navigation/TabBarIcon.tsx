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
    <>
      {focused ? (
        <View
          style={{
            width: 72,
            height: 52,
            borderRadius: 24,
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 10,
            marginBottom: 1,
            paddingVertical: 6,
            paddingBottom: 16,
            paddingHorizontal: 8,
            shadowColor: "rgba(240, 194, 254, 0.2)",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.6,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <Ionicons
            size={24}
            style={[{ fontFamily: "Kanit" }, style]}
            {...rest}
          />
        </View>
      ) : (
        <Ionicons
          size={24}
          style={[{ marginBottom: 2, fontFamily: "Kanit" }, style]}
          {...rest}
        />
      )}
    </>
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
