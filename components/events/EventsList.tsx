import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
  StyleSheet,
} from "react-native";
import { eventService } from "@/service/api/event";
import { EventCard } from "./EventCard";
import { Event } from "@/interface/Event";
import LoadingScreen from "../LoadingScreen";
import { PremiumFeatureModal } from "../common/PremiumFeatureModal";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";

interface EventsListProps {
  eventsType: "all" | "my";
}

const distances = [
  { label: "Tous", value: 1000, icon: "🌍", id: "all" },
  { label: "5km", value: 5, icon: "🚶", id: "walk" },
  { label: "10km", value: 10, icon: "🏃", id: "run" },
  { label: "50km", value: 50, icon: "🚴", id: "bike" },
  { label: "200km", value: 200, icon: "🚗", id: "car" },
];

export const EventsList = ({ eventsType }: EventsListProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState<number>(5);
  const [error, setError] = useState<string | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  // Vérifier si l'utilisateur est premium et si la fonctionnalité nécessite le premium
  const isPremiumFeature = eventsType === "my";

  const handleFeatureAccess = () => {
    if (
      isPremiumFeature &&
      !(user && "is_premium" in user && user.is_premium)
    ) {
      setShowPremiumModal(true);
      return false;
    }
    return true;
  };

  const closeModal = () => {
    setShowPremiumModal(false);
    router.replace("/(tabs)/matches");
  };

  const loadEvents = async (selectedRadius: number = radius) => {
    if (!handleFeatureAccess()) return;

    setLoading(true);
    setError(null);
    try {
      if (eventsType === "my") {
        const response = await eventService.getMyEvents();
        const createdEvents = response.created.map((item) => ({
          ...item,
          is_creator: true,
          is_participant: false,
        }));
        const participatingEvents = response.participating.map((item) => ({
          ...item,
          is_creator: false,
          is_participant: true,
        }));
        setEvents([...createdEvents, ...participatingEvents]);
      } else {
        const response = await eventService.getAllEvents({
          radius: selectedRadius,
        });
        setEvents(response);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des événements:", error);
      setError("Impossible de charger les événements. Veuillez réessayer.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
  };

  useEffect(() => {
    loadEvents();
  }, [eventsType]);

  useEffect(() => {
    if (user?.is_premium) {
      setShowPremiumModal(false);
      loadEvents();
    }
  }, [user?.is_premium]);

  const DistanceFilter = () => (
    <View className="bg-background py-3">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 mt-4"
      >
        <View className="flex-row gap-2">
          {distances.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => {
                setRadius(item.value);
                loadEvents(item.value);
              }}
              className={`px-4 py-3 rounded-xl flex-row items-center gap-2 ${
                radius === item.value
                  ? "bg-[#1e2429] border border-purple"
                  : "bg-[#1e2429] border border-[#2a3137]"
              }`}
            >
              <Text className="text-base">{item.icon}</Text>
              <Text
                className={`${
                  radius === item.value ? "text-purple font-bold" : "text-white"
                } text-base`}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderContent = () => {
    if (loading && !refreshing) {
      return <LoadingScreen />;
    }

    if (error) {
      return (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-red-500 text-center mb-4">{error}</Text>
          <Pressable
            onPress={() => loadEvents()}
            className="bg-purple px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-bold">Réessayer</Text>
          </Pressable>
        </View>
      );
    }

    if (events.length === 0) {
      return (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-white text-center text-lg mb-2">
            Aucun événement disponible
          </Text>
          <Text className="text-gray-400 text-center">
            {radius === 1000
              ? "Aucun événement n'est disponible pour le moment."
              : `Aucun événement trouvé dans un rayon de ${radius}km.`}
          </Text>
        </View>
      );
    }

    return (
      <View className="p-4">
        {events.map((event, index) => (
          <EventCard
            key={`${event.id}-${index}`}
            event={event}
            onEventUpdate={loadEvents}
          />
        ))}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-background">
      <View
        style={[styles.container, showPremiumModal && styles.blurContainer]}
      >
        {eventsType === "all" && <DistanceFilter />}
        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#8101f7"
            />
          }
        >
          {renderContent()}
        </ScrollView>
      </View>
      <PremiumFeatureModal
        onUpgrade={() => {
          router.push("/premium");
          setShowPremiumModal(false);
        }}
        visible={showPremiumModal}
        onClose={closeModal}
        title="Fonctionnalité Premium"
        description="Cette fonctionnalité sera bientôt disponible dans la version premium de l'application. Restez à l'écoute pour plus d'informations !"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blurContainer: {
    opacity: 0.3,
  },
});
