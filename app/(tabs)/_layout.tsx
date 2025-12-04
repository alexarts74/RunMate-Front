// TabLayout.tsx
import { Tabs, useSegments } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useUnreadMessages } from "@/context/UnreadMessagesContext";
import { CreateModal } from "@/components/modals/CreateModal";
import { useAuth } from "@/context/AuthContext";

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
        color={focused ? "#FF6B4A" : "rgba(107, 75, 82, 0.5)"}
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
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const [activeTab, setActiveTab] = useState(0);
  const [previousTab, setPreviousTab] = useState(0);
  const indicatorPosition = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get("window").width;
  const tabBarWidth = screenWidth * 0.88;
  const isOrganizer = user?.user_type === "organizer";
  const numberOfTabs = isOrganizer ? 4 : 3;
  const tabWidth = tabBarWidth / numberOfTabs;

  // Détecter automatiquement l'onglet actif basé sur les segments de route
  useEffect(() => {
    const currentPath = segments.join("/");
    if (currentPath.includes("profile")) {
      setActiveTab(isOrganizer ? 3 : 2);
    } else if (currentPath.includes("messages")) {
      setActiveTab(1);
    } else if (currentPath.includes("create")) {
      if (isOrganizer) {
      setActiveTab(2);
      }
    } else if (currentPath.includes("matches") || currentPath === "") {
      setActiveTab(0);
    }
  }, [segments, isOrganizer]);

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
        intensity={15}
        tint="light"
        style={{
          flex: 1,
          borderRadius: 28,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            borderRadius: 28,
            borderWidth: 0,
            position: "relative",
            overflow: "hidden",
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
              backgroundColor: "rgba(255, 107, 74, 0.2)",
              shadowColor: "#FF6B4A",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 3,
            }}
          />
        </View>
      </BlurView>
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FF6B4A",
        tabBarInactiveTintColor: "rgba(107, 75, 82, 0.5)",
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 10,
          marginHorizontal: "6%",
          alignSelf: "center",
          width: "88%",
          maxWidth: "90%",
          backgroundColor: "transparent",
          borderTopWidth: 0,
          borderBottomWidth: 0,
          height: 60,
          paddingBottom: 0,
          paddingTop: 5,
          marginBottom: 0,
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
          fontFamily: "Nunito-Regular",
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
            backgroundColor: "#FF6B4A",
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
          href: isOrganizer ? "/create" : null, // Masquer l'onglet pour les runners
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
            setActiveTab(isOrganizer ? 3 : 2);
          },
        }}
      />
    </Tabs>
  );
}
