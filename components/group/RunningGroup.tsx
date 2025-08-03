import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { groupService } from "@/service/api/group";
import { useRouter, useFocusEffect } from "expo-router";
import LoadingScreen from "../LoadingScreen";
import { PremiumFeatureModal } from "../common/PremiumFeatureModal";
import { useAuth } from "@/context/AuthContext";

type RunningGroupType = {
  id: string;
  name: string;
  members_count: number;
  location: string;
  upcoming_events: any[];
  level: string;
  cover_image: string | null;
  max_members: number;
};

const RunningGroup = () => {
  const [groups, setGroups] = useState<RunningGroupType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleFeatureAccess = (groupId: string) => {
    if (user?.is_premium) {
      router.push(`/groups/${groupId}`);
      return true;
    } else {
      setShowPremiumModal(true);
      return false;
    }
  };

  const fetchGroups = async () => {
    if (!user?.is_premium) {
      setShowPremiumModal(true);
      return;
    }

    setIsLoading(true);
    try {
      const groupsData = await groupService.getGroups();
      setGroups(groupsData);
    } catch (error) {
      console.error("Erreur lors du chargement des groupes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchGroups();
    }, [])
  );

  const closeModal = () => {
    setShowPremiumModal(false);
    router.replace("/");
  };

  const onUpgrade = () => {
    router.push("/premium");
    setShowPremiumModal(false);
  };

  useEffect(() => {
    if (user?.is_premium) {
      setShowPremiumModal(false);
      fetchGroups();
    }
  }, [user?.is_premium]);

  const renderGroup = ({ item }: { item: RunningGroupType }) => (
    <Pressable
      className="bg-[#1e2429] rounded-xl overflow-hidden mb-3 mx-4 border border-gray-700"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
      onPress={() => handleFeatureAccess(item.id)}
    >
      <Image
        source={
          item.cover_image
            ? { uri: item.cover_image }
            : require("@/assets/images/favicon.png")
        }
        className="w-full h-32"
        style={{ resizeMode: "cover" }}
      />

      <View className="p-4">
        <Text className="text-white font-bold text-lg mb-2">{item.name}</Text>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="people" size={16} color="#8101f7" />
            <Text className="text-gray-300 text-sm ml-2">
              {item.members_count} membres
            </Text>
          </View>

          <Pressable
            className="bg-[#2a3238] px-4 py-2 rounded-lg"
            onPress={() => handleFeatureAccess(item.id)}
          >
            <Text className="text-white font-semibold">Voir le groupe</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View className="bg-background flex-1">
      <View
        style={[styles.container, showPremiumModal && styles.blurContainer]}
      >
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <FlatList
            data={groups}
            renderItem={renderGroup}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={() => (
              <View className="flex-1 items-center justify-center px-6 py-10">
                <View className="bg-[#2a3238]/30 p-8 rounded-full mb-6">
                  <Ionicons name="fitness" size={60} color="#8101f7" />
                </View>
                <Text className="text-white font-kanit text-2xl font-bold text-center mb-3">
                  Aucun groupe trouvé
                </Text>
                <Text className="text-gray-400 text-base font-kanit text-center mb-8">
                  Les groupes de course vous permettent de rencontrer d'autres
                  coureurs et de participer à des événements ensemble.
                </Text>
                <Pressable
                  className="bg-[#8101f7] rounded-full px-6 py-3 flex-row items-center"
                  onPress={() => router.push("/")}
                >
                  <Ionicons
                    name="people"
                    size={20}
                    color="white"
                    style={{ marginRight: 8 }}
                  />
                  <Text className="text-white font-kanit font-semibold">
                    Explorer les groupes
                  </Text>
                </Pressable>
              </View>
            )}
          />
        )}
      </View>
      <PremiumFeatureModal
        onUpgrade={onUpgrade}
        visible={showPremiumModal}
        onClose={closeModal}
        title="Fonctionnalité Premium"
        description="Les groupes de course seront bientôt disponibles dans la version premium de l'application. Stay tuned !"
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

export default RunningGroup;
