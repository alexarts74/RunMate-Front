import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  ScrollView,
  Modal,
} from "react-native";
import { MatchesCarousel } from "@/components/matches/MatchesCarousel";
import RunningGroup from "@/components/group/RunningGroup";
import GetPremiumVersion from "@/components/GetPremiumVersion";
import { Ionicons } from "@expo/vector-icons";
import { EventsList } from "@/components/events/EventsList";
import { useAuth } from "@/context/AuthContext";

const HomepageScreen = () => {
  const [activeTab, setActiveTab] = useState<"matches" | "groups" | "events">(
    "matches"
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [eventsType, setEventsType] = useState<"all" | "my">("all");

  const { user } = useAuth();
  console.log("👤 User Data:", {
    running_type: user?.runner_profile?.running_type,
    user_id: user?.id,
    name: `${user?.first_name} ${user?.last_name}`,
    location: {
      city: user?.city,
      department: user?.department,
    },
  });

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        <View className="flex-row border-b border-gray-700">
          <Pressable
            onPress={() => setActiveTab("matches")}
            className={`flex-1 py-4 ${
              activeTab === "matches" ? "border-b-2 border-purple" : ""
            }`}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons
                name="football-outline"
                size={20}
                color={activeTab === "matches" ? "#8101f7" : "#687076"}
              />
              <Text
                className={`ml-2 font-semibold ${
                  activeTab === "matches" ? "text-purple" : "text-gray-400"
                }`}
              >
                Matches
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("groups")}
            className={`flex-1 py-4 ${
              activeTab === "groups" ? "border-b-2 border-purple" : ""
            }`}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons
                name="people-outline"
                size={20}
                color={activeTab === "groups" ? "#8101f7" : "#687076"}
              />
              <Text
                className={`ml-2 font-semibold ${
                  activeTab === "groups" ? "text-purple" : "text-gray-400"
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
                color={activeTab === "events" ? "#8101f7" : "#687076"}
              />
              <Text
                className={`ml-2 font-semibold ${
                  activeTab === "events" ? "text-purple" : "text-gray-400"
                }`}
              >
                Events
              </Text>
            </View>
          </Pressable>
        </View>

        <View className="flex-1">
          {activeTab === "matches" ? (
            <>
              <View className="mb-8">
                <MatchesCarousel />
              </View>
              {/* <GetPremiumVersion /> */}
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
        </View>
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
                setActiveTab("events");
                setModalVisible(false);
              }}
              className="py-4 mb-3 bg-background rounded-xl"
            >
              <Text className="text-white text-lg text-center">Mes Events</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setEventsType("all");
                setActiveTab("events");
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
