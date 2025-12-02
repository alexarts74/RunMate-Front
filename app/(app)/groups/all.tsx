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
    if (user?.is_premium) {
      router.push(`/groups/${groupId}`);
      return true;
    } else {
      setShowPremiumModal(true);
      return false;
    }
  };

  const fetchMyGroups = async () => {
    if (!user?.is_premium) {
      setShowPremiumModal(true);
      return;
    }

    setIsLoading(true);
    try {
      const groupsData = await groupService.getGroups();
      console.log("myGroupsData", groupsData.length);
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
    if (user?.is_premium && activeTab === "my-groups") {
      setShowPremiumModal(false);
      fetchMyGroups();
    }
  }, [user?.is_premium]);

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

  const renderMyGroupItem = ({ item }: { item: GroupInfo }) => (
    <Pressable
      className="bg-white rounded-2xl overflow-hidden mb-4 mx-4"
      style={{
        shadowColor: "#A78BFA",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
      }}
      onPress={() => handleFeatureAccess(item.id.toString())}
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
        <View className="flex-row justify-between items-start mb-3">
          <Text className="text-gray-900 font-nunito-bold text-xl flex-1 mr-2">
            {item.name}
          </Text>
          {item.is_admin && (item.pending_requests_count || 0) > 0 && (
            <View className="bg-red-500 px-2 py-1 rounded-full">
              <Text className="text-white text-xs font-bold">
                {item.pending_requests_count} demande{(item.pending_requests_count || 0) > 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-lg bg-tertiary items-center justify-center mr-2">
              <Ionicons name="people" size={16} color="#A78BFA" />
            </View>
            <Text className="text-gray-600 font-nunito-medium text-sm">
              {item.members_count} membres
            </Text>
          </View>

          <Pressable
            className="bg-secondary px-5 py-2.5 rounded-xl"
            onPress={() => handleFeatureAccess(item.id.toString())}
          >
            <Text className="text-white font-nunito-bold text-sm">
              Voir le groupe
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );

  const renderDiscoverGroupItem = ({ item }: { item: GroupInfo }) => (
    <Pressable
      className="bg-white rounded-2xl overflow-hidden mb-4 mx-4"
      style={{
        shadowColor: "#A78BFA",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
      }}
      onPress={() => router.push(`/groups/${item.id.toString()}`)}
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
        <Text className="text-gray-900 font-nunito-bold text-xl mb-2">
          {item.name}
        </Text>
        
        {item.description && (
          <Text className="text-gray-500 text-sm mb-3" numberOfLines={2}>
            {item.description}
          </Text>
        )}

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-lg bg-tertiary items-center justify-center mr-2">
              <Ionicons name="people" size={16} color="#A78BFA" />
            </View>
            <Text className="text-gray-600 font-nunito-medium text-sm">
              {item.members_count} membres
            </Text>
          </View>

          <Pressable
            className={`px-5 py-2.5 rounded-xl ${item.is_member ? 'bg-gray-200' : 'bg-secondary'}`}
            onPress={() => router.push(`/groups/${item.id.toString()}`)}
          >
            <Text className={`${item.is_member ? 'text-gray-600' : 'text-white'} font-nunito-bold text-sm`}>
              {item.is_member ? "Voir" : "Découvrir"}
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );

  const renderMyGroupsEmpty = () => (
    <View className="flex-1 items-center justify-center px-6 py-10">
      <View className="bg-tertiary p-8 rounded-full mb-6">
        <Ionicons name="fitness" size={60} color="#A78BFA" />
      </View>
      <Text className="text-gray-900 font-nunito-bold text-2xl text-center mb-3">
        Aucun groupe trouvé
      </Text>
      <Text className="text-gray-500 text-base font-nunito-medium text-center mb-8">
        Les groupes de course vous permettent de rencontrer d'autres
        coureurs et de participer à des événements ensemble.
      </Text>
      <View className="flex-row space-x-4">
        <Pressable
          className="bg-secondary rounded-full px-6 py-3 flex-row items-center mb-4 mr-3"
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
          <Text className="text-white font-nunito-bold">
            Créer
          </Text>
        </Pressable>
        
        <Pressable
          className="bg-white border border-secondary rounded-full px-6 py-3 flex-row items-center mb-4"
          onPress={() => setActiveTab("discover")}
        >
          <Ionicons
            name="search"
            size={20}
            color="#A78BFA"
            style={{ marginRight: 8 }}
          />
          <Text className="text-secondary font-nunito-bold">
            Explorer
          </Text>
        </Pressable>
      </View>
    </View>
  );

  const renderDiscoverEmpty = () => (
    <View className="flex-1 items-center justify-center px-6 py-10 mt-10">
      <View className="bg-tertiary p-8 rounded-full mb-6">
        <Ionicons name="search" size={60} color="#A78BFA" />
      </View>
      <Text className="text-gray-900 font-nunito-bold text-2xl text-center mb-3">
        Aucun groupe trouvé
      </Text>
      <Text className="text-gray-500 text-base font-nunito-medium text-center">
        Essayez une autre recherche ou créez votre propre groupe !
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-fond">
      <SafeAreaView className="bg-fond" edges={['top']}>
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center border-b border-gray-200">
          <Pressable onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="#FF6B4A" />
          </Pressable>
          <Text className="text-2xl font-nunito-extrabold text-gray-900">
            Groupes de course
          </Text>
        </View>

        {/* Tabs */}
        <View className="flex-row px-4 pt-4 pb-2">
          <Pressable
            onPress={() => setActiveTab("my-groups")}
            className={`flex-1 py-3 rounded-xl mr-2 ${
              activeTab === "my-groups" ? "bg-secondary" : "bg-white border border-gray-200"
            }`}
            style={
              activeTab === "my-groups"
                ? {
                    shadowColor: "#A78BFA",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 3,
                  }
                : {}
            }
          >
            <Text
              className={`text-center font-nunito-bold ${
                activeTab === "my-groups" ? "text-white" : "text-gray-600"
              }`}
            >
              Mes groupes
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("discover")}
            className={`flex-1 py-3 rounded-xl ml-2 ${
              activeTab === "discover" ? "bg-secondary" : "bg-white border border-gray-200"
            }`}
            style={
              activeTab === "discover"
                ? {
                    shadowColor: "#A78BFA",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 3,
                  }
                : {}
            }
          >
            <Text
              className={`text-center font-nunito-bold ${
                activeTab === "discover" ? "text-white" : "text-gray-600"
              }`}
            >
              Découvrir
            </Text>
          </Pressable>
        </View>

        {/* Search Bar for Discover Tab */}
        {activeTab === "discover" && (
          <View className="px-4 py-3">
            <View className="bg-white flex-row items-center px-4 py-3 rounded-xl border border-gray-200">
              <Ionicons name="search" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-3 font-nunito text-gray-900"
                placeholder="Rechercher un groupe..."
                value={searchQuery}
                onChangeText={handleSearch}
                placeholderTextColor="#9CA3AF"
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => handleSearch("")}>
                  <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                </Pressable>
              )}
            </View>
          </View>
        )}
      </SafeAreaView>

      {/* Content */}
      <View className="flex-1">
        {isLoading ? (
          <LoadingScreen />
        ) : activeTab === "my-groups" ? (
          <FlatList
            data={myGroups}
            renderItem={renderMyGroupItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
            ListEmptyComponent={renderMyGroupsEmpty}
          />
        ) : (
          <FlatList
            data={filteredDiscoverGroups}
            renderItem={renderDiscoverGroupItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
            ListEmptyComponent={renderDiscoverEmpty}
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
