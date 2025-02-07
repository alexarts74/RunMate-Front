import { Tabs } from "expo-router";
import React from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useUnreadMessages } from "@/context/UnreadMessagesContext";
import { router } from "expo-router";
import { View } from "react-native";

function CreateActionButton({ focused }: { focused: boolean }) {
  return (
    <TabBarIcon
      name="add-outline"
      color={focused ? "#b9f144" : "#394047"}
      size={28}
    />
  );
}

export default function TabLayout() {
  const { unreadCount } = useUnreadMessages();

  // console.log("unreadCount", unreadCount);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#b9f144",
        tabBarInactiveTintColor: "#394047",
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#12171b",
          borderTopColor: "#394047",
          height: 80,
          paddingBottom: 28,
          paddingTop: 0,
        },
      }}
    >
      <Tabs.Screen
        name="matches/index"
        options={{
          title: "Matches",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="messages/index"
        options={{
          title: "Messages",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "chatbubble" : "chatbubble-outline"}
              color={color}
            />
          ),
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: "#b9f144",
            color: "#12171b",
          },
        }}
      />
      <Tabs.Screen
        name="create/index"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <View
              className={`p-3 rounded-full ${focused ? "bg-[#1e2429]" : ""}`}
            >
              <CreateActionButton focused={focused} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "person" : "person-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
