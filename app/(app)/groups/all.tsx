import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { groupService } from "@/service/api/group";
import { useRouter } from "expo-router";
import LoadingScreen from "@/components/LoadingScreen";
import { PremiumFeatureModal } from "@/components/common/PremiumFeatureModal";
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

export default function AllGroupsScreen() {
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

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (user?.is_premium) {
      setShowPremiumModal(false);
      fetchGroups();
    }
  }, [user?.is_premium]);

  const renderGroup = ({ item }: { item: RunningGroupType }) => (
    <Pressable
      className="bg-white rounded-2xl overflow-hidden mb-4 mx-4"
      style={{
        shadowColor: "#A78BFA",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
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
        className="w-full h-40"
        style={{ resizeMode: "cover" }}
      />

      <View className="p-5">
        <Text className="text-gray-900 font-kanit-bold text-xl mb-3">
          {item.name}
        </Text>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-lg bg-tertiary items-center justify-center mr-2">
              <Ionicons name="people" size={16} color="#A78BFA" />
            </View>
            <Text className="text-gray-600 font-kanit-medium text-sm">
              {item.members_count} membres
            </Text>
          </View>

          <Pressable
            className="bg-secondary px-5 py-2.5 rounded-xl"
            onPress={() => handleFeatureAccess(item.id)}
          >
            <Text className="text-white font-kanit-bold text-sm">
              Voir le groupe
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View className="flex-1 bg-fond">
      <SafeAreaView className="bg-fond" edges={['top']}>
        <View className="px-6 py-4 flex-row items-center border-b border-gray-200">
          <Pressable onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="#FF6B4A" />
          </Pressable>
          <Text className="text-2xl font-kanit-bold text-gray-900">
            Groupes de course
          </Text>
        </View>
      </SafeAreaView>

      <View className="flex-1">
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <FlatList
            data={groups}
            renderItem={renderGroup}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
            ListEmptyComponent={() => (
              <View className="flex-1 items-center justify-center px-6 py-10">
                <View className="bg-tertiary p-8 rounded-full mb-6">
                  <Ionicons name="fitness" size={60} color="#A78BFA" />
                </View>
                <Text className="text-gray-900 font-kanit-bold text-2xl text-center mb-3">
                  Aucun groupe trouvé
                </Text>
                <Text className="text-gray-500 text-base font-kanit-medium text-center mb-8">
                  Les groupes de course vous permettent de rencontrer d'autres
                  coureurs et de participer à des événements ensemble.
                </Text>
                <Pressable
                  className="bg-secondary rounded-full px-6 py-3 flex-row items-center"
                  style={{
                    shadowColor: "#A78BFA",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                  onPress={() => router.push("/groups/create")}
                >
                  <Ionicons
                    name="add-circle"
                    size={20}
                    color="white"
                    style={{ marginRight: 8 }}
                  />
                  <Text className="text-white font-kanit-bold">
                    Créer un groupe
                  </Text>
                </Pressable>
              </View>
            )}
          />
        )}
      </View>

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
        description="Les groupes de course seront bientôt disponibles dans la version premium de l'application. Stay tuned !"
      />
    </View>
  );
}
