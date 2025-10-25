// TabLayout.tsx
import { Tabs } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { BlurView } from "expo-blur";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useUnreadMessages } from "@/context/UnreadMessagesContext";
import { CreateModal } from "@/components/modals/CreateModal";

function CreateActionButton({
  focused,
  onPress,
}: {
  focused: boolean;
  onPress?: () => void;
}) {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
    setModalVisible(true);
  };

  return (
    <>
      <TabBarIcon
        name="add-circle"
        color={focused ? "#126C52" : "rgba(255, 255, 255, 0.6)"}
        focused={focused}
        onPress={handlePress}
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
  const [activeTab, setActiveTab] = useState(0);
  const [previousTab, setPreviousTab] = useState(0);
  const indicatorPosition = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get("window").width;
  const tabBarWidth = screenWidth * 0.88;
  const tabWidth = tabBarWidth / 4;

  useEffect(() => {
    Animated.spring(indicatorPosition, {
      toValue: activeTab * tabWidth + (tabWidth - 76) / 2,
      useNativeDriver: false,
      tension: 150,
      friction: 8,
    }).start();
  }, [activeTab, indicatorPosition, tabWidth]);

  const tabBarBackground = () => (
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
            position: "relative",
          }}
        >
          <Animated.View
            style={{
              position: "absolute",
              top: 3,
              left: indicatorPosition,
              width: 76,
              height: 52,
              borderRadius: 27,
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              shadowColor: "rgba(240, 194, 254, 0.2)",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.6,
              shadowRadius: 2,
              elevation: 2,
            }}
          />
        </View>
      </BlurView>
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#126C52",
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
        tabBarBackground: tabBarBackground,
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
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="home-outline" color={color} focused={false} />
          ),
        }}
        listeners={{
          tabPress: () => {
            setPreviousTab(activeTab);
            setActiveTab(0);
          },
        }}
      />
      <Tabs.Screen
        name="messages/index"
        options={{
          title: "Messages",
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name="chatbubbles-outline"
              color={color}
              focused={false}
            />
          ),
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: "#126C52",
            color: "#ffffff",
            fontSize: 10,
            fontWeight: "700",
            borderRadius: 10,
            minWidth: 18,
            height: 18,
          },
        }}
        listeners={{
          tabPress: () => {
            setPreviousTab(activeTab);
            setActiveTab(1);
          },
        }}
      />
      <Tabs.Screen
        name="create/index"
        options={{
          title: "Create",
          tabBarIcon: () => (
            <CreateActionButton
              focused={activeTab === 2}
              onPress={() => {
                setActiveTab(2);
              }}
            />
          ),
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
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name="person-circle-outline"
              color={color}
              focused={false}
            />
          ),
        }}
        listeners={{
          tabPress: () => {
            setPreviousTab(activeTab);
            setActiveTab(3);
          },
        }}
      />
    </Tabs>
  );
}
