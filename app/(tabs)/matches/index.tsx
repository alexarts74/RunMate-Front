import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  ScrollView,
  Modal,
  Animated,
  Dimensions,
} from "react-native";
import { MatchesCarousel } from "@/components/matches/MatchesCarousel";
import RunningGroup from "@/components/group/RunningGroup";
import GetPremiumVersion from "@/components/GetPremiumVersion";
import { Ionicons } from "@expo/vector-icons";
import { EventsList } from "@/components/events/EventsList";
import { useAuth } from "@/context/AuthContext";

const { width } = Dimensions.get("window");

const HomepageScreen = () => {
  const [activeTab, setActiveTab] = useState<"matches" | "groups" | "events">(
    "matches"
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [eventsType, setEventsType] = useState<"all" | "my">("all");
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleTabChange = (tab: "matches" | "groups" | "events") => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setActiveTab(tab);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  const renderContent = () => {
    return (
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        {activeTab === "matches" ? (
          <>
            <View className="mb-8">
              <MatchesCarousel />
            </View>
          </>
        ) : activeTab === "groups" ? (
          <>
            <ScrollView>
              <View className="my-8 h-fit">
                <RunningGroup />
              </View>
              <View className="mb-16">
                <GetPremiumVersion />
              </View>
            </ScrollView>
          </>
        ) : (
          <EventsList eventsType={eventsType} />
        )}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        <View className="flex-row border-b border-gray-700">
          <Pressable
            onPress={() => handleTabChange("matches")}
            className={`flex-1 py-4 ${
              activeTab === "matches" ? "border-b-2 border-purple" : ""
            }`}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons
                name="football-outline"
                size={20}
                color={activeTab === "matches" ? "#8101f7" : "#ffffff"}
              />
              <Text
                className={`ml-2 font-semibold ${
                  activeTab === "matches" ? "text-purple" : "text-white"
                }`}
              >
                Matches
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => handleTabChange("groups")}
            className={`flex-1 py-4 ${
              activeTab === "groups" ? "border-b-2 border-purple" : ""
            }`}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons
                name="people-outline"
                size={20}
                color={activeTab === "groups" ? "#8101f7" : "#ffffff"}
              />
              <Text
                className={`ml-2 font-semibold ${
                  activeTab === "groups" ? "text-purple" : "text-white"
                }`}
              >
                Groups
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => setModalVisible(true)}
            className={`flex-1 py-4 ${
              activeTab === "events" ? "border-b-2 border-purple" : ""
            }`}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons
                name="calendar-outline"
                size={20}
                color={activeTab === "events" ? "#8101f7" : "#ffffff"}
              />
              <Text
                className={`ml-2 font-semibold ${
                  activeTab === "events" ? "text-purple" : "text-white"
                }`}
              >
                Events
              </Text>
            </View>
          </Pressable>
        </View>

        <View className="flex-1">{renderContent()}</View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-[#1e2429] m-5 p-5 rounded-2xl w-[80%]">
            <Text className="text-white text-xl font-bold mb-6 text-center">
              Sélectionner les events
            </Text>

            <Pressable
              onPress={() => {
                setEventsType("my");
                handleTabChange("events");
                setModalVisible(false);
              }}
              className="py-4 mb-3 bg-background rounded-xl"
            >
              <Text className="text-white text-lg text-center">Mes Events</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setEventsType("all");
                handleTabChange("events");
                setModalVisible(false);
              }}
              className="py-4 mb-6 bg-background rounded-xl"
            >
              <Text className="text-white text-lg text-center">
                Tous les Events
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setModalVisible(false)}
              className="bg-purple py-4 rounded-xl"
            >
              <Text className="text-white text-center font-bold">Fermer</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HomepageScreen;
