import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { eventService } from "@/service/api/event";
import { EventCard } from "@/components/events/EventCard";
import { Event } from "@/interface/Event";
import LoadingScreen from "@/components/LoadingScreen";
import { PremiumFeatureModal } from "@/components/common/PremiumFeatureModal";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const distances = [
  { label: "Tous", value: 1000, icon: "🌍", id: "all" },
  { label: "5km", value: 5, icon: "🚶", id: "walk" },
  { label: "10km", value: 10, icon: "🏃", id: "run" },
  { label: "50km", value: 50, icon: "🚴", id: "bike" },
  { label: "200km", value: 200, icon: "🚗", id: "car" },
];

export default function AllEventsScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState<number>(10);
  const [error, setError] = useState<string | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleFeatureAccess = () => {
    if (!(user && "is_premium" in user && user.is_premium)) {
      setShowPremiumModal(true);
      return false;
    }
    return true;
  };

  const loadEvents = async (selectedRadius: number = radius) => {
    if (!handleFeatureAccess()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await eventService.getAllEvents({
        radius: selectedRadius,
      });
      // Extraire les événements de la structure {event: {...}}
      const eventsData = response.map((item: any) => item.event || item);
      setEvents(eventsData);
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
  }, []);

  useEffect(() => {
    if (user?.is_premium) {
      setShowPremiumModal(false);
      loadEvents();
    }
  }, [user?.is_premium]);

  const DistanceFilter = () => (
    <View className="bg-white py-3 border-b border-gray-200">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4"
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
                  ? "bg-primary"
                  : "bg-tertiary"
              }`}
              style={{
                shadowColor: radius === item.value ? "#FF6B4A" : "#A78BFA",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text className="text-base">{item.icon}</Text>
              <Text
                className={`${
                  radius === item.value ? "text-white font-kanit-bold" : "text-gray-700 font-kanit-medium"
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
          <Text className="text-red-500 text-center mb-4 font-kanit-medium">{error}</Text>
          <Pressable
            onPress={() => loadEvents()}
            className="bg-primary px-6 py-3 rounded-xl"
            style={{
              shadowColor: "#FF6B4A",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text className="text-white font-kanit-bold">Réessayer</Text>
          </Pressable>
        </View>
      );
    }

    if (events.length === 0) {
      return (
        <View className="flex-1 justify-center items-center p-4">
          <View className="bg-tertiary p-8 rounded-full mb-6">
            <Ionicons name="calendar-outline" size={60} color="#FF6B4A" />
          </View>
          <Text className="text-gray-900 text-center text-lg mb-2 mt-4 font-kanit-bold">
            Aucun événement disponible
          </Text>
          <Text className="text-gray-500 text-center font-kanit-medium">
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
    <View className="flex-1 bg-fond">
      <SafeAreaView className="bg-fond" edges={['top']}>
        <View className="px-6 py-4 flex-row items-center border-b border-gray-200">
          <Pressable onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="#FF6B4A" />
          </Pressable>
          <Text className="text-2xl font-kanit-bold text-gray-900">
            Événements
          </Text>
        </View>
      </SafeAreaView>

      <DistanceFilter />

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FF6B4A"
          />
        }
      >
        {renderContent()}
      </ScrollView>

      <PremiumFeatureModal
        onUpgrade={() => {
          router.push("/premium");
          setShowPremiumModal(false);
        }}
        visible={showPremiumModal}
        onClose={() => {
          setShowPremiumModal(false);
          router.back();
        }}
        title="Fonctionnalité Premium"
        description="Cette fonctionnalité sera bientôt disponible dans la version premium de l'application. Restez à l'écoute pour plus d'informations !"
      />
    </View>
  );
}
