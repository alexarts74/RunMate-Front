import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import { MatchesCarousel } from "@/components/matches/MatchesCarousel";
import RunningGroup from "@/components/group/RunningGroup";
import { Ionicons } from "@expo/vector-icons";
import { EventsList } from "@/components/events/EventsList";
import { useAuth } from "@/context/AuthContext";
import { PremiumFeatureModal } from "@/components/common/PremiumFeatureModal";
import { EventsSelectionModal } from "@/components/events/EventsSelectionModal";
import { router } from "expo-router";

const HomepageScreen = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"matches" | "groups" | "events">(
    "matches"
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
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

  // Vérification premium pour l'accès aux événements
  const handleEventsTab = () => {
    if (user?.is_premium) {
      setModalVisible(true);
    } else {
      setShowPremiumModal(true);
    }
  };

  // Gestion de la fermeture de la modale premium
  const closePremiumModal = () => {
    setShowPremiumModal(false);
    // Rester sur l'onglet en cours ou revenir à l'onglet Matches
    if (activeTab !== "matches") {
      handleTabChange("matches");
    }
  };

  // Gestion de la sélection du type d'événements
  const handleSelectEventsType = (type: "all" | "my") => {
    setEventsType(type);
    handleTabChange("events");
    setModalVisible(false);
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
              {/* <View className="mb-16">
                <GetPremiumVersion />
              </View> */}
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
                className={`ml-2 font-kanit font-semibold ${
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
                className={`ml-2 font-kanit font-semibold ${
                  activeTab === "groups" ? "text-purple" : "text-white"
                }`}
              >
                Groups
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={handleEventsTab}
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
                className={`ml-2 font-kanit font-semibold ${
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

      {/* Utilisation du composant EventsSelectionModal */}
      <EventsSelectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectEventsType={handleSelectEventsType}
      />

      {/* Modale premium pour les utilisateurs non premium */}
      <PremiumFeatureModal
        onUpgrade={() => {
          router.push("/premium");
          setShowPremiumModal(false);
        }}
        visible={showPremiumModal}
        onClose={closePremiumModal}
        title="Fonctionnalité Premium"
        description="Les événements seront bientôt disponibles dans la version premium de l'application. Restez à l'écoute pour plus d'informations !"
      />
    </SafeAreaView>
  );
};

export default HomepageScreen;
