import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { groupService } from "@/service/api/group";
import { useRouter } from "expo-router";
import LoadingScreen from "@/components/LoadingScreen";
import { PremiumFeatureModal } from "@/components/common/PremiumFeatureModal";
import { useAuth } from "@/context/AuthContext";
import { GroupInfo } from "@/interface/Group";

type TabType = "my-groups" | "discover";

const ACCENT = "#F97316";

export default function AllGroupsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("my-groups");
  const [myGroups, setMyGroups] = useState<GroupInfo[]>([]);
  const [discoverGroups, setDiscoverGroups] = useState<GroupInfo[]>([]);
  const [filteredDiscoverGroups, setFilteredDiscoverGroups] = useState<GroupInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleFeatureAccess = (groupId: string) => {
    if (user?.user_type === "organizer" || user?.is_premium) {
      router.push(`/groups/${groupId}`);
      return true;
    } else {
      setShowPremiumModal(true);
      return false;
    }
  };

  const fetchMyGroups = async () => {
    if (user?.user_type !== "organizer" && !user?.is_premium) {
      setShowPremiumModal(true);
      return;
    }

    setIsLoading(true);
    try {
      const groupsData = await groupService.getGroups();
      setMyGroups(groupsData);
    } catch (error) {
      console.error("Erreur lors du chargement des groupes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDiscoverGroups = async () => {
    setIsLoading(true);
    try {
      const groupsData: any = await groupService.discoverGroups();
      setDiscoverGroups(groupsData);
      setFilteredDiscoverGroups(groupsData);
    } catch (error) {
      console.error("Erreur lors du chargement des groupes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "my-groups") {
      fetchMyGroups();
    } else {
      fetchDiscoverGroups();
    }
  }, [activeTab]);

  useEffect(() => {
    if ((user?.user_type === "organizer" || user?.is_premium) && activeTab === "my-groups") {
      setShowPremiumModal(false);
      fetchMyGroups();
    }
  }, [user?.is_premium, user?.user_type]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setFilteredDiscoverGroups(discoverGroups);
    } else {
      const filtered = discoverGroups.filter((group) =>
        group.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredDiscoverGroups(filtered);
    }
  };

  const renderGroupItem = ({ item }: { item: GroupInfo }) => (
    <Pressable
      className="bg-neutral-100 rounded-2xl overflow-hidden mb-3 mx-6"
      onPress={() => activeTab === "my-groups" ? handleFeatureAccess(item.id.toString()) : router.push(`/groups/${item.id.toString()}`)}
    >
      <Image
        source={
          item.cover_image
            ? { uri: item.cover_image }
            : require("@/assets/images/favicon.png")
        }
        className="w-full h-36"
        style={{ resizeMode: "cover" }}
      />

      <View className="p-4">
        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-neutral-900 font-nunito-bold text-lg flex-1 mr-2">
            {item.name}
          </Text>
          {item.is_admin && (item.pending_requests_count || 0) > 0 && (
            <View style={{ backgroundColor: ACCENT }} className="px-2 py-1 rounded-full">
              <Text className="text-white text-xs font-nunito-bold">
                {item.pending_requests_count} demande{(item.pending_requests_count || 0) > 1 ? "s" : ""}
              </Text>
            </View>
          )}
        </View>

        {item.description && activeTab === "discover" && (
          <Text className="text-neutral-500 text-sm mb-3" numberOfLines={2}>
            {item.description}
          </Text>
        )}

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-lg bg-white items-center justify-center mr-2">
              <Ionicons name="people" size={16} color={ACCENT} />
            </View>
            <Text className="text-neutral-500 font-nunito-medium text-sm">
              {item.members_count} membres
            </Text>
          </View>

          <Pressable
            className="px-4 py-2 rounded-xl"
            style={{ backgroundColor: item.is_member ? "#E5E5E5" : ACCENT }}
            onPress={() => activeTab === "my-groups" ? handleFeatureAccess(item.id.toString()) : router.push(`/groups/${item.id.toString()}`)}
          >
            <Text className={`font-nunito-bold text-sm ${item.is_member ? "text-neutral-600" : "text-white"}`}>
              {item.is_member ? "Voir" : "Découvrir"}
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center px-6 py-16">
      <View
        className="w-20 h-20 rounded-full items-center justify-center mb-6"
        style={{ backgroundColor: `${ACCENT}15` }}
      >
        <Ionicons name={activeTab === "my-groups" ? "people-outline" : "search-outline"} size={40} color={ACCENT} />
      </View>
      <Text className="text-neutral-900 font-nunito-bold text-xl text-center mb-2">
        Aucun groupe trouvé
      </Text>
      <Text className="text-neutral-500 text-sm font-nunito-medium text-center mb-6">
        {activeTab === "my-groups"
          ? "Rejoins un groupe pour courir avec d'autres"
          : "Essaie une autre recherche"}
      </Text>
      {activeTab === "my-groups" && (
        <View className="flex-row" style={{ gap: 12 }}>
          <Pressable
            className="rounded-2xl px-5 py-3 flex-row items-center"
            style={{ backgroundColor: ACCENT }}
            onPress={() => router.push("/groups/create")}
          >
            <Ionicons name="add" size={18} color="white" />
            <Text className="text-white font-nunito-bold text-sm ml-1">Créer</Text>
          </Pressable>
          <Pressable
            className="rounded-2xl px-5 py-3 flex-row items-center bg-neutral-100"
            onPress={() => setActiveTab("discover")}
          >
            <Ionicons name="search" size={18} color={ACCENT} />
            <Text className="font-nunito-bold text-sm ml-1" style={{ color: ACCENT }}>
              Explorer
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-neutral-100 items-center justify-center mr-3"
          >
            <Ionicons name="arrow-back" size={20} color="#525252" />
          </Pressable>
          <Text className="text-xl font-nunito-bold text-neutral-900">
            Groupes
          </Text>
        </View>

        {/* Tabs */}
        <View className="flex-row px-6 pb-4" style={{ gap: 8 }}>
          <Pressable
            onPress={() => setActiveTab("my-groups")}
            className="flex-1 py-3 rounded-xl"
            style={{ backgroundColor: activeTab === "my-groups" ? ACCENT : "#F5F5F5" }}
          >
            <Text
              className={`text-center font-nunito-bold text-sm ${
                activeTab === "my-groups" ? "text-white" : "text-neutral-600"
              }`}
            >
              Mes groupes
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("discover")}
            className="flex-1 py-3 rounded-xl"
            style={{ backgroundColor: activeTab === "discover" ? ACCENT : "#F5F5F5" }}
          >
            <Text
              className={`text-center font-nunito-bold text-sm ${
                activeTab === "discover" ? "text-white" : "text-neutral-600"
              }`}
            >
              Découvrir
            </Text>
          </Pressable>
        </View>

        {/* Search Bar */}
        {activeTab === "discover" && (
          <View className="px-6 pb-4">
            <View className="bg-neutral-100 flex-row items-center px-4 py-3 rounded-xl">
              <Ionicons name="search" size={18} color="#A3A3A3" />
              <TextInput
                className="flex-1 ml-3 font-nunito text-neutral-900 text-sm"
                placeholder="Rechercher un groupe..."
                value={searchQuery}
                onChangeText={handleSearch}
                placeholderTextColor="#A3A3A3"
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => handleSearch("")}>
                  <Ionicons name="close-circle" size={18} color="#A3A3A3" />
                </Pressable>
              )}
            </View>
          </View>
        )}

        {/* Content */}
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <FlatList
            data={activeTab === "my-groups" ? myGroups : filteredDiscoverGroups}
            renderItem={renderGroupItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
            ListEmptyComponent={renderEmpty}
          />
        )}
      </SafeAreaView>

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
        description="Les groupes de course seront bientôt disponibles dans la version premium de l'application."
      />
    </View>
  );
}
