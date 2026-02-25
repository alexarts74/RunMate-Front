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
import WarmBackground from "@/components/ui/WarmBackground";
import GlassButton from "@/components/ui/GlassButton";
import { useThemeColors } from "@/constants/theme";

type TabType = "my-groups" | "discover";

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
  const { colors, shadows } = useThemeColors();

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
      className="rounded-2xl overflow-hidden mb-3 mx-6"
      style={{ backgroundColor: colors.glass.light }}
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
          <Text
            className="font-nunito-bold text-lg flex-1 mr-2"
            style={{ color: colors.text.primary }}
          >
            {item.name}
          </Text>
          {item.is_admin && (item.pending_requests_count || 0) > 0 && (
            <View
              className="px-2 py-1 rounded-full"
              style={{ backgroundColor: colors.primary.DEFAULT }}
            >
              <Text className="text-white text-xs font-nunito-bold">
                {item.pending_requests_count} demande{(item.pending_requests_count || 0) > 1 ? "s" : ""}
              </Text>
            </View>
          )}
        </View>

        {item.description && activeTab === "discover" && (
          <Text
            className="text-sm mb-3"
            style={{ color: colors.text.secondary }}
            numberOfLines={2}
          >
            {item.description}
          </Text>
        )}

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View
              className="w-8 h-8 rounded-lg items-center justify-center mr-2"
              style={{ backgroundColor: colors.elevated }}
            >
              <Ionicons name="people" size={16} color={colors.primary.DEFAULT} />
            </View>
            <Text className="font-nunito-medium text-sm" style={{ color: colors.text.secondary }}>
              {item.members_count} membres
            </Text>
          </View>

          <Pressable
            className="px-4 py-2 rounded-xl"
            style={{
              backgroundColor: item.is_member ? colors.glass.medium : colors.primary.DEFAULT,
            }}
            onPress={() => activeTab === "my-groups" ? handleFeatureAccess(item.id.toString()) : router.push(`/groups/${item.id.toString()}`)}
          >
            <Text
              className="font-nunito-bold text-sm"
              style={{ color: item.is_member ? colors.text.secondary : colors.text.inverse }}
            >
              {item.is_member ? "Voir" : "Decouvrir"}
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
        style={{ backgroundColor: colors.primary.subtle }}
      >
        <Ionicons
          name={activeTab === "my-groups" ? "people-outline" : "search-outline"}
          size={40}
          color={colors.primary.DEFAULT}
        />
      </View>
      <Text
        className="font-nunito-bold text-xl text-center mb-2"
        style={{ color: colors.text.primary }}
      >
        Aucun groupe trouve
      </Text>
      <Text
        className="text-sm font-nunito-medium text-center mb-6"
        style={{ color: colors.text.secondary }}
      >
        {activeTab === "my-groups"
          ? "Rejoins un groupe pour courir avec d'autres"
          : "Essaie une autre recherche"}
      </Text>
      {activeTab === "my-groups" && (
        <View className="flex-row" style={{ gap: 12 }}>
          <GlassButton
            title="Creer"
            onPress={() => router.push("/groups/create")}
            icon={<Ionicons name="add" size={18} color="white" />}
            size="sm"
          />
          <GlassButton
            title="Explorer"
            variant="secondary"
            onPress={() => setActiveTab("discover")}
            icon={<Ionicons name="search" size={18} color={colors.primary.DEFAULT} />}
            size="sm"
          />
        </View>
      )}
    </View>
  );

  return (
    <WarmBackground>
      <SafeAreaView className="flex-1" edges={["top"]}>
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
            Groupes
          </Text>
        </View>

        {/* Tabs */}
        <View className="flex-row px-6 pb-4" style={{ gap: 8 }}>
          <Pressable
            onPress={() => setActiveTab("my-groups")}
            className="flex-1 py-3 rounded-xl"
            style={{
              backgroundColor:
                activeTab === "my-groups" ? colors.primary.DEFAULT : colors.glass.light,
            }}
          >
            <Text
              className="text-center font-nunito-bold text-sm"
              style={{
                color:
                  activeTab === "my-groups" ? colors.text.inverse : colors.text.secondary,
              }}
            >
              Mes groupes
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("discover")}
            className="flex-1 py-3 rounded-xl"
            style={{
              backgroundColor:
                activeTab === "discover" ? colors.primary.DEFAULT : colors.glass.light,
            }}
          >
            <Text
              className="text-center font-nunito-bold text-sm"
              style={{
                color:
                  activeTab === "discover" ? colors.text.inverse : colors.text.secondary,
              }}
            >
              Decouvrir
            </Text>
          </Pressable>
        </View>

        {/* Search Bar */}
        {activeTab === "discover" && (
          <View className="px-6 pb-4">
            <View
              className="flex-row items-center px-4 py-3 rounded-xl"
              style={{
                backgroundColor: colors.glass.light,
                borderWidth: 1,
                borderColor: colors.glass.border,
              }}
            >
              <Ionicons name="search" size={18} color={colors.text.tertiary} />
              <TextInput
                className="flex-1 ml-3 font-nunito text-sm"
                placeholder="Rechercher un groupe..."
                value={searchQuery}
                onChangeText={handleSearch}
                placeholderTextColor={colors.text.tertiary}
                style={{ color: colors.text.primary }}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => handleSearch("")}>
                  <Ionicons name="close-circle" size={18} color={colors.text.tertiary} />
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
        title="Fonctionnalite Premium"
        description="Les groupes de course seront bientot disponibles dans la version premium de l'application."
      />
    </WarmBackground>
  );
}
