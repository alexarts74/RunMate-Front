// TabLayout.tsx
import { Tabs } from "expo-router";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useUnreadMessages } from "@/context/UnreadMessagesContext";
import { CreateModal } from "@/components/modals/CreateModal";

function CreateActionButton({ focused }: { focused: boolean }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TabBarIcon
        name="add-circle"
        color={focused ? "#f0c2fe" : "rgba(255, 255, 255, 0.6)"}
        focused={focused}
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
        tabBarActiveTintColor: "#f0c2fe",
        tabBarInactiveTintColor: "rgba(255, 255, 255, 0.6)",
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 15,
          marginHorizontal: "6%",
          alignSelf: "center",
          width: "88%",
          maxWidth: "90%",
          backgroundColor: "transparent",
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
          shadowColor: "transparent",
          shadowOpacity: 0,
          elevation: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 1,
          height: 50,
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarBackground: () => (
          <View style={StyleSheet.absoluteFill}>
            <BlurView
              intensity={25}
              tint="systemChromeMaterialDark"
              style={{
                flex: 1,
                borderRadius: 28,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: "rgba(28, 28, 30, 0.72)",
                  borderRadius: 28,
                  borderWidth: 0.5,
                  borderColor: "rgba(255, 255, 255, 0.18)",
                }}
              />
            </BlurView>
          </View>
        ),
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: -2,
          fontFamily: "Kanit",
          textAlign: "center",
        },
      }}
    >
      <Tabs.Screen
        name="matches/index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
              focused={focused}
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
              name={focused ? "chatbubble-ellipses" : "chatbubbles-outline"}
              color={color}
              focused={focused}
            />
          ),
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: "#f0c2fe",
            color: "#ffffff",
            fontSize: 10,
            fontWeight: "700",
            borderRadius: 10,
            minWidth: 18,
            height: 18,
          },
        }}
      />
      <Tabs.Screen
        name="create/index"
        options={{
          title: "Create",
          tabBarIcon: ({ focused }) => <CreateActionButton focused={focused} />,
        }}
        listeners={{
          tabPress: (e) => {
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
              name={focused ? "person-circle" : "person-circle-outline"}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
