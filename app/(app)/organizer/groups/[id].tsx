import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { groupService } from "@/service/api/group";
import LoadingScreen from "@/components/LoadingScreen";
import { GroupInfo, JoinRequest } from "@/interface/Group";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";

export default function OrganizerGroupDetailsScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [group, setGroup] = useState<GroupInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Admin State
  const [pendingRequests, setPendingRequests] = useState<JoinRequest[]>([]);
  const [showRequests, setShowRequests] = useState(false);

  const fetchGroupData = async () => {
    try {
      console.log("🏢 [OrganizerGroupDetails] Chargement du groupe:", id);
      const groupData: any = await groupService.getGroupById(id as string);
      console.log("🏢 [OrganizerGroupDetails] Groupe reçu:", groupData);
      setGroup(groupData);

      if (groupData.is_admin) {
        fetchPendingRequests();
      }
    } catch (error) {
      console.error("🏢 [OrganizerGroupDetails] Erreur:", error);
      Alert.alert("Erreur", "Impossible de charger les détails du groupe");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const response = await groupService.getPendingRequests(id as string);
      console.log("🏢 [OrganizerGroupDetails] Demandes en attente:", response.requests?.length || 0);
      setPendingRequests(response.requests || []);
    } catch (error) {
      console.error("🏢 [OrganizerGroupDetails] Erreur chargement demandes:", error);
    }
  };

  useEffect(() => {
    fetchGroupData();
  }, [id]);

  const handleAcceptRequest = async (reqId: number, userId: number) => {
    try {
      await groupService.acceptRequest(id as string, userId);
      setPendingRequests((prev) => prev.filter((r) => r.id !== reqId));
      fetchGroupData();
      Alert.alert("Succès", "Membre accepté !");
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'accepter la demande");
    }
  };

  const handleDeclineRequest = async (reqId: number, userId: number) => {
    try {
      await groupService.declineRequest(id as string, userId);
      setPendingRequests((prev) => prev.filter((r) => r.id !== reqId));
      Alert.alert("Succès", "Demande refusée");
    } catch (error) {
      Alert.alert("Erreur", "Impossible de refuser la demande");
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!group) {
    return (
      <View className="flex-1 bg-fond items-center justify-center">
        <Text className="text-gray-900">Groupe non trouvé</Text>
      </View>
    );
  }

  // Vérifier que l'utilisateur est bien admin
  if (!group.is_admin) {
    return (
      <View className="flex-1 bg-fond items-center justify-center px-6">
        <Ionicons name="lock-closed" size={64} color="#FF6B4A" />
        <Text className="text-gray-900 font-nunito-bold text-xl mt-4 text-center">
          Accès restreint
        </Text>
        <Text className="text-gray-600 font-nunito-medium text-center mt-2">
          Vous n'êtes pas administrateur de ce groupe.
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="bg-primary px-6 py-3 rounded-full mt-6"
        >
          <Text className="text-white font-nunito-bold">Retour</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-fond">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header Image avec gradient overlay */}
        <View className="relative h-72">
          <Image
            source={
              group.cover_image
                ? { uri: group.cover_image }
                : require("@/assets/images/favicon.png")
            }
            className="w-full h-full"
            style={{ resizeMode: "cover" }}
          />
          
          <View 
            className="absolute inset-0"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }}
          />
          
          <Pressable
            onPress={() => router.back()}
            className="absolute left-4 bg-white/90 p-3 rounded-full"
            style={{ top: insets.top + 8 }}
          >
            <Ionicons name="arrow-back" size={24} color="#FF6B4A" />
          </Pressable>

          <View className="absolute bottom-0 left-0 right-0 p-6">
            <View className="flex-row items-center mb-2">
              <View className="bg-primary px-3 py-1 rounded-full mr-2">
                <Text className="text-white font-nunito-bold text-xs">Votre groupe</Text>
              </View>
            </View>
            <Text className="text-white font-nunito-bold text-3xl mb-2">
              {group.name}
            </Text>
            <View className="flex-row items-center">
              <View className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full flex-row items-center">
                <Ionicons name="people" size={16} color="white" />
                <Text className="text-white font-nunito-medium text-sm ml-2">
                  {group.members_count} membres
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="px-4 pt-6">
          {/* Statistiques */}
          {user?.user_type === "organizer" && (
            <View className="bg-white rounded-2xl p-5 mb-4"
              style={{
                shadowColor: "#FF6B4A",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center mr-3">
                  <Ionicons name="stats-chart" size={20} color="#FF6B4A" />
                </View>
                <Text className="text-gray-900 font-nunito-bold text-lg">
                  Statistiques du groupe
                </Text>
              </View>
              
              <View className="flex-row" style={{ gap: 12 }}>
                <View className="flex-1 bg-tertiary p-4 rounded-xl">
                  <Text className="text-gray-600 font-nunito-medium text-xs mb-1">
                    Membres
                  </Text>
                  <Text className="text-gray-900 font-nunito-extrabold text-2xl">
                    {group.members_count || 0}
                  </Text>
                </View>
                
                <View className="flex-1 bg-tertiary p-4 rounded-xl">
                  <Text className="text-gray-600 font-nunito-medium text-xs mb-1">
                    Demandes
                  </Text>
                  <Text className="text-gray-900 font-nunito-extrabold text-2xl">
                    {pendingRequests.length}
                  </Text>
                </View>
              </View>

              <View className="mt-4 flex-row" style={{ gap: 12 }}>
                <Pressable
                  onPress={() => {
                    Alert.alert("Modifier", "Fonctionnalité de modification à venir");
                  }}
                  className="flex-1 bg-white border-2 border-primary py-3 rounded-xl flex-row items-center justify-center"
                >
                  <Ionicons name="create-outline" size={18} color="#FF6B4A" style={{ marginRight: 6 }} />
                  <Text className="text-primary font-nunito-bold text-sm">
                    Modifier
                  </Text>
                </Pressable>
                
                <Pressable
                  onPress={() => {
                    Alert.alert(
                      "Supprimer le groupe",
                      "Êtes-vous sûr de vouloir supprimer ce groupe ? Cette action est irréversible.",
                      [
                        { text: "Annuler", style: "cancel" },
                        {
                          text: "Supprimer",
                          style: "destructive",
                          onPress: () => {
                            Alert.alert("Info", "Fonctionnalité de suppression à venir");
                          },
                        },
                      ]
                    );
                  }}
                  className="flex-1 bg-white border-2 border-red-500 py-3 rounded-xl flex-row items-center justify-center"
                >
                  <Ionicons name="trash-outline" size={18} color="#EF4444" style={{ marginRight: 6 }} />
                  <Text className="text-red-500 font-nunito-bold text-sm">
                    Supprimer
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Description Card */}
          {group.description && (
            <View className="bg-white rounded-2xl p-5 mb-4" style={{
              shadowColor: "#A78BFA",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}>
              <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 rounded-full bg-tertiary items-center justify-center mr-3">
                  <Ionicons name="information-circle" size={20} color="#A78BFA" />
                </View>
                <Text className="text-gray-900 font-nunito-bold text-lg">
                  À propos
                </Text>
              </View>
              <Text className="text-gray-600 font-nunito leading-6">
                {group.description}
              </Text>
            </View>
          )}

          {/* Demandes d'adhésion */}
          <Pressable
            onPress={() => setShowRequests(!showRequests)}
            className="bg-white rounded-2xl p-5 flex-row items-center justify-between mb-4"
            style={{
              shadowColor: "#FF6B4A",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                <Ionicons name="people-outline" size={20} color="#FF6B4A" />
              </View>
              <Text className="text-gray-900 font-nunito-bold text-base">
                Demandes d'adhésion
              </Text>
            </View>
            <View className="flex-row items-center">
              {pendingRequests.length > 0 && (
                <View className="bg-red-500 px-2.5 py-1 rounded-full mr-3">
                  <Text className="text-white text-xs font-nunito-bold">
                    {pendingRequests.length}
                  </Text>
                </View>
              )}
              <Ionicons
                name={showRequests ? "chevron-up" : "chevron-down"}
                size={24}
                color="#A78BFA"
              />
            </View>
          </Pressable>

          {showRequests && (
            <View className="mb-4 bg-white rounded-2xl overflow-hidden" style={{
              shadowColor: "#A78BFA",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 2,
            }}>
              {pendingRequests.length === 0 ? (
                <View className="p-8 items-center">
                  <View className="bg-tertiary p-4 rounded-full mb-3">
                    <Ionicons name="checkmark-circle" size={40} color="#A78BFA" />
                  </View>
                  <Text className="text-gray-500 font-nunito text-center">
                    Aucune demande en attente
                  </Text>
                </View>
              ) : (
                pendingRequests.map((req, index) => (
                  <View
                    key={req.id}
                    className={`flex-row items-center p-4 ${
                      index !== pendingRequests.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <Image
                      source={
                        req.user.profile_image
                          ? { uri: req.user.profile_image }
                          : require("@/assets/images/favicon.png")
                      }
                      className="w-12 h-12 rounded-full mr-3"
                    />
                    <View className="flex-1">
                      <Text className="text-gray-900 font-nunito-bold">
                        {req.user.first_name} {req.user.last_name}
                      </Text>
                      {req.message && (
                        <Text
                          className="text-gray-500 font-nunito text-xs mt-0.5"
                          numberOfLines={1}
                        >
                          {req.message}
                        </Text>
                      )}
                    </View>
                    <View className="flex-row ml-2">
                      <TouchableOpacity
                        onPress={() => handleDeclineRequest(req.id, req.user.id)}
                        className="bg-red-50 p-2.5 rounded-full mr-2"
                      >
                        <Ionicons name="close" size={20} color="#EF4444" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleAcceptRequest(req.id, req.user.id)}
                        className="bg-green-50 p-2.5 rounded-full"
                      >
                        <Ionicons name="checkmark" size={20} color="#10B981" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}

          {/* Membres */}
          {group.members && group.members.length > 0 && (
            <View className="bg-white rounded-2xl p-5 mb-4" style={{
              shadowColor: "#A78BFA",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}>
              <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 rounded-full bg-tertiary items-center justify-center mr-3">
                  <Ionicons name="people" size={20} color="#A78BFA" />
                </View>
                <Text className="text-gray-900 font-nunito-bold text-lg">
                  Membres ({group.members.length})
                </Text>
              </View>
              <View className="flex-row flex-wrap -mx-2">
                {group.members.map((member) => (
                  <View key={member.id} className="w-1/4 px-2 mb-4 items-center">
                    <Image
                      source={
                        member.profile_image
                          ? { uri: member.profile_image }
                          : require("@/assets/images/favicon.png")
                      }
                      className="w-16 h-16 rounded-full mb-2"
                      style={{
                        borderWidth: 2,
                        borderColor: '#E9D5FF',
                      }}
                    />
                    <Text
                      className="text-gray-900 font-nunito text-center text-xs"
                      numberOfLines={1}
                    >
                      {member.first_name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

