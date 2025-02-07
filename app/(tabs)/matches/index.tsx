import React, { useState } from "react";
import { View, Text, Pressable, SafeAreaView, ScrollView } from "react-native";
import { MatchesCarousel } from "@/components/matches/MatchesCarousel";
import RunningGroup from "@/components/group/RunningGroup";
import GetPremiumVersion from "@/components/GetPremiumVersion";
import { Ionicons } from "@expo/vector-icons";
import { EventsList } from "@/components/events/EventsList";

const HomepageScreen = () => {
  const [activeTab, setActiveTab] = useState<"matches" | "groups" | "events">(
    "matches"
  );

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
            onPress={() => setActiveTab("events")}
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
            <EventsList />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomepageScreen;
