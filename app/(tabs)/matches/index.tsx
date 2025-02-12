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

const HomepageScreen = () => {
  const [activeTab, setActiveTab] = useState<"matches" | "groups" | "events">(
    "matches"
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [eventsType, setEventsType] = useState<"all" | "my">("all");

  return (
    <SafeAreaView className="flex-1 bg-[#12171b]">
      <View className="flex-1">
        <View className="flex-row border-b border-[#2a3238]">
          <Pressable
            onPress={() => setActiveTab("matches")}
            className={`flex-1 py-4 ${
              activeTab === "matches" ? "border-b-2 border-green" : ""
            }`}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons
                name="football-outline"
                size={20}
                color={activeTab === "matches" ? "#b9f144" : "#fff"}
              />
              <Text
                className={`ml-2 font-semibold ${
                  activeTab === "matches" ? "text-green" : "text-white"
                }`}
              >
                Matches
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("groups")}
            className={`flex-1 py-4 ${
              activeTab === "groups" ? "border-b-2 border-green" : ""
            }`}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons
                name="people-outline"
                size={20}
                color={activeTab === "groups" ? "#b9f144" : "#fff"}
              />
              <Text
                className={`ml-2 font-semibold ${
                  activeTab === "groups" ? "text-green" : "text-white"
                }`}
              >
                Groups
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => setModalVisible(true)}
            className={`flex-1 py-4 ${
              activeTab === "events" ? "border-b-2 border-green" : ""
            }`}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons
                name="calendar-outline"
                size={20}
                color={activeTab === "events" ? "#b9f144" : "#fff"}
              />
              <Text
                className={`ml-2 font-semibold ${
                  activeTab === "events" ? "text-green" : "text-white"
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
              <GetPremiumVersion />
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
          <View className="bg-background m-5 p-5 rounded-2xl w-[80%] bg-[#12171b]">
            <Text className="text-white text-xl font-bold mb-6 text-center">
              Sélectionner les events
            </Text>

            <Pressable
              onPress={() => {
                setEventsType("my");
                setActiveTab("events");
                setModalVisible(false);
              }}
              className="py-4 mb-3 bg-[#2a3238] rounded-xl"
            >
              <Text className="text-white text-lg text-center">Mes Events</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setEventsType("all");
                setActiveTab("events");
                setModalVisible(false);
              }}
              className="py-4 mb-6 bg-[#2a3238] rounded-xl"
            >
              <Text className="text-white text-lg text-center">
                Tous les Events
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setModalVisible(false)}
              className="bg-green py-4 rounded-xl"
            >
              <Text className="text-black text-center font-bold">Fermer</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HomepageScreen;
