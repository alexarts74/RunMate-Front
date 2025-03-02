import { Tabs } from "expo-router";
import React, { useState } from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useUnreadMessages } from "@/context/UnreadMessagesContext";
import { CreateModal } from "@/components/modals/CreateModal";

function CreateActionButton({ focused }: { focused: boolean }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TabBarIcon
        name="add-outline"
        color={focused ? "#8101f7" : "#687076"}
        size={28}
        onPress={() => setModalVisible(true)}
      />
      <CreateModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}

export default function TabLayout() {
  const { unreadCount } = useUnreadMessages();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#8101f7",
        tabBarInactiveTintColor: "#687076",
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#1e2429",
          borderTopColor: "#374151",
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
          tabBarLabelStyle: {
            color: "#ffffff",
          },
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
            backgroundColor: "#8101f7",
            color: "#ffffff",
          },
          tabBarLabelStyle: {
            color: "#ffffff",
          },
        }}
      />
      <Tabs.Screen
        name="create/index"
        options={{
          title: "Create",
          tabBarIcon: ({ focused }) => <CreateActionButton focused={focused} />,
          tabBarLabelStyle: {
            color: "#ffffff",
          },
        }}
        listeners={{
          tabPress: (e) => {
            // Empêcher la navigation
            e.preventDefault();
          },
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
          tabBarLabelStyle: {
            color: "#ffffff",
          },
        }}
      />
    </Tabs>
  );
}
