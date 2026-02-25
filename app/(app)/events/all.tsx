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
import WarmBackground from "@/components/ui/WarmBackground";
import GlassButton from "@/components/ui/GlassButton";
import { useThemeColors } from "@/constants/theme";

const distances = [
  { label: "Tous", value: 1000, id: "all" },
  { label: "5km", value: 5, id: "walk" },
  { label: "10km", value: 10, id: "run" },
  { label: "50km", value: 50, id: "bike" },
  { label: "200km", value: 200, id: "car" },
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
  const { colors, shadows } = useThemeColors();

  const handleFeatureAccess = () => {
    if (user?.user_type === "organizer") {
      return true;
    }
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
      const eventsData = response.map((item: any) => item.event || item);
      setEvents(eventsData);
    } catch (error) {
      console.error("Erreur lors du chargement des evenements:", error);
      setError("Impossible de charger les evenements. Veuillez reessayer.");
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
    if (user?.user_type === "organizer" || user?.is_premium) {
      setShowPremiumModal(false);
      loadEvents();
    }
  }, [user?.is_premium, user?.user_type]);

  const DistanceFilter = () => (
    <View
      style={{
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.glass.border,
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}
      >
        {distances.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => {
              setRadius(item.value);
              loadEvents(item.value);
            }}
            className="px-4 py-2.5 rounded-xl"
            style={{
              backgroundColor:
                radius === item.value ? colors.primary.DEFAULT : colors.glass.light,
            }}
          >
            <Text
              className="font-nunito-bold text-sm"
              style={{
                color:
                  radius === item.value ? colors.text.inverse : colors.text.secondary,
              }}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

  const renderContent = () => {
    if (loading && !refreshing) {
      return <LoadingScreen />;
    }

    if (error) {
      return (
        <View className="flex-1 justify-center items-center p-6">
          <Text
            className="text-center mb-4 font-nunito-medium"
            style={{ color: colors.error }}
          >
            {error}
          </Text>
          <GlassButton
            title="Reessayer"
            onPress={() => loadEvents()}
          />
        </View>
      );
    }

    if (events.length === 0) {
      return (
        <View className="flex-1 justify-center items-center p-6">
          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-6"
            style={{ backgroundColor: colors.primary.subtle }}
          >
            <Ionicons name="calendar-outline" size={40} color={colors.primary.DEFAULT} />
          </View>
          <Text
            className="text-xl font-nunito-bold text-center mb-2"
            style={{ color: colors.text.primary }}
          >
            Aucun evenement
          </Text>
          <Text
            className="text-sm font-nunito-medium text-center"
            style={{ color: colors.text.secondary }}
          >
            {radius === 1000
              ? "Aucun evenement disponible pour le moment."
              : `Aucun evenement dans un rayon de ${radius}km.`}
          </Text>
        </View>
      );
    }

    return (
      <View className="px-6 pt-4">
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
    <WarmBackground>
      <SafeAreaView edges={["top"]}>
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: colors.glass.light }}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text.secondary} />
          </Pressable>
          <Text
            className="text-xl font-nunito-bold"
            style={{ color: colors.text.primary }}
          >
            Evenements
          </Text>
        </View>
      </SafeAreaView>

      <DistanceFilter />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.DEFAULT}
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
        title="Fonctionnalite Premium"
        description="Cette fonctionnalite sera bientot disponible dans la version premium."
      />
    </WarmBackground>
  );
}
