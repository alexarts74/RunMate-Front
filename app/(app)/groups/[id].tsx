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
import WarmBackground from "@/components/ui/WarmBackground";
import GlassCard from "@/components/ui/GlassCard";
import GlassButton from "@/components/ui/GlassButton";
import { useThemeColors } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";

export default function GroupDetailsScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [group, setGroup] = useState<GroupInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const { colors, shadows, gradients } = useThemeColors();

  // Admin State
  const [pendingRequests, setPendingRequests] = useState<JoinRequest[]>([]);
  const [showRequests, setShowRequests] = useState(false);

  const fetchGroupData = async () => {
    try {
      const groupData: any = await groupService.getGroupById(id as string);
      setGroup(groupData);

      if (groupData.is_admin) {
        fetchPendingRequests();
      }
    } catch (error) {
      console.error("Erreur:", error);
      Alert.alert("Erreur", "Impossible de charger les details du groupe");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const response = await groupService.getPendingRequests(id as string);
      setPendingRequests(response.requests || []);
    } catch (error) {
      console.error("Erreur chargement demandes:", error);
    }
  };

  useEffect(() => {
    fetchGroupData();
  }, [id]);

  const handleRequestToJoin = async () => {
    setIsActionLoading(true);
    try {
      await groupService.requestToJoin(id as string);
      Alert.alert("Succes", "Votre demande a ete envoyee aux administrateurs.");
      fetchGroupData();
    } catch (error: any) {
      Alert.alert("Information", error.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    Alert.alert(
      "Quitter le groupe",
      "Etes-vous sur de vouloir quitter ce groupe ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Quitter",
          style: "destructive",
          onPress: async () => {
            try {
              setIsActionLoading(true);
              await groupService.leaveGroup(id as string);
              Alert.alert("Succes", "Vous avez quitte le groupe.");
              router.back();
            } catch (error: any) {
              Alert.alert("Erreur", error.message);
            } finally {
              setIsActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleAcceptRequest = async (reqId: number, userId: number) => {
    try {
      await groupService.acceptRequest(id as string, userId);
      setPendingRequests((prev) => prev.filter((r) => r.id !== reqId));
      fetchGroupData();
      Alert.alert("Succes", "Membre accepte !");
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'accepter la demande");
    }
  };

  const handleDeclineRequest = async (reqId: number, userId: number) => {
    try {
      await groupService.declineRequest(id as string, userId);
      setPendingRequests((prev) => prev.filter((r) => r.id !== reqId));
      Alert.alert("Succes", "Demande refusee");
    } catch (error) {
      Alert.alert("Erreur", "Impossible de refuser la demande");
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!group) {
    return (
      <WarmBackground>
        <View className="flex-1 items-center justify-center">
          <Text style={{ color: colors.text.primary }}>Groupe non trouve</Text>
        </View>
      </WarmBackground>
    );
  }

  return (
    <WarmBackground>
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

          <LinearGradient
            colors={gradients.imageOverlay as unknown as [string, string, ...string[]]}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />

          {/* Back button */}
          <Pressable
            onPress={() => router.back()}
            className="absolute left-4 p-3 rounded-full"
            style={{
              top: insets.top + 8,
              backgroundColor: colors.glass.heavy,
              ...shadows.sm,
            }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.primary.DEFAULT} />
          </Pressable>

          {/* Titre et membres sur l'image */}
          <View className="absolute bottom-0 left-0 right-0 p-6">
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
          {/* Description Card */}
          {group.description && (
            <GlassCard variant="light" style={{ marginBottom: 16 }}>
              <View className="flex-row items-center mb-3">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: colors.primary.subtle }}
                >
                  <Ionicons name="information-circle" size={20} color={colors.text.secondary} />
                </View>
                <Text className="font-nunito-bold text-lg" style={{ color: colors.text.primary }}>
                  A propos
                </Text>
              </View>
              <Text className="font-nunito leading-6" style={{ color: colors.text.secondary }}>
                {group.description}
              </Text>
            </GlassCard>
          )}

          {/* ADMIN SECTION */}
          {group.is_admin && (
            <View className="mb-4">
              {/* Section Organisateur - Statistiques */}
              {user?.user_type === "organizer" && (
                <GlassCard variant="medium" style={{ marginBottom: 16 }}>
                  <View className="flex-row items-center mb-4">
                    <View
                      className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                      style={{ backgroundColor: colors.primary.subtle }}
                    >
                      <Ionicons name="stats-chart" size={20} color={colors.primary.DEFAULT} />
                    </View>
                    <Text className="font-nunito-bold text-lg" style={{ color: colors.text.primary }}>
                      Statistiques du groupe
                    </Text>
                  </View>

                  <View className="flex-row" style={{ gap: 12 }}>
                    <View
                      className="flex-1 p-4 rounded-xl"
                      style={{ backgroundColor: colors.glass.light }}
                    >
                      <Text className="font-nunito-medium text-xs mb-1" style={{ color: colors.text.secondary }}>
                        Membres
                      </Text>
                      <Text className="font-nunito-extrabold text-2xl" style={{ color: colors.text.primary }}>
                        {group.members_count || 0}
                      </Text>
                    </View>

                    <View
                      className="flex-1 p-4 rounded-xl"
                      style={{ backgroundColor: colors.glass.light }}
                    >
                      <Text className="font-nunito-medium text-xs mb-1" style={{ color: colors.text.secondary }}>
                        Demandes
                      </Text>
                      <Text className="font-nunito-extrabold text-2xl" style={{ color: colors.text.primary }}>
                        {pendingRequests.length}
                      </Text>
                    </View>
                  </View>

                  <View className="mt-4 flex-row" style={{ gap: 12 }}>
                    <GlassButton
                      title="Modifier"
                      variant="secondary"
                      size="sm"
                      icon={<Ionicons name="create-outline" size={18} color={colors.primary.DEFAULT} />}
                      onPress={() => {
                        Alert.alert("Modifier", "Fonctionnalite de modification a venir");
                      }}
                      style={{ flex: 1 }}
                    />

                    <Pressable
                      onPress={() => {
                        Alert.alert(
                          "Supprimer le groupe",
                          "Etes-vous sur de vouloir supprimer ce groupe ? Cette action est irreversible.",
                          [
                            { text: "Annuler", style: "cancel" },
                            {
                              text: "Supprimer",
                              style: "destructive",
                              onPress: () => {
                                Alert.alert("Info", "Fonctionnalite de suppression a venir");
                              },
                            },
                          ]
                        );
                      }}
                      className="flex-1 py-3 rounded-xl flex-row items-center justify-center"
                      style={{
                        backgroundColor: colors.elevated,
                        borderWidth: 2,
                        borderColor: colors.error,
                      }}
                    >
                      <Ionicons name="trash-outline" size={18} color={colors.error} style={{ marginRight: 6 }} />
                      <Text className="font-nunito-bold text-sm" style={{ color: colors.error }}>
                        Supprimer
                      </Text>
                    </Pressable>
                  </View>
                </GlassCard>
              )}

              <Pressable
                onPress={() => setShowRequests(!showRequests)}
                style={{
                  backgroundColor: colors.glass.light,
                  borderRadius: 16,
                  padding: 20,
                  ...shadows.sm,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View className="flex-row items-center flex-1">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: colors.primary.subtle }}
                  >
                    <Ionicons name="people-outline" size={20} color={colors.primary.DEFAULT} />
                  </View>
                  <Text className="font-nunito-bold text-base" style={{ color: colors.text.primary }}>
                    Demandes d'adhesion
                  </Text>
                </View>
                <View className="flex-row items-center">
                  {pendingRequests.length > 0 && (
                    <View
                      className="px-2.5 py-1 rounded-full mr-3"
                      style={{ backgroundColor: colors.error }}
                    >
                      <Text className="text-white text-xs font-nunito-bold">
                        {pendingRequests.length}
                      </Text>
                    </View>
                  )}
                  <Ionicons
                    name={showRequests ? "chevron-up" : "chevron-down"}
                    size={24}
                    color={colors.text.secondary}
                  />
                </View>
              </Pressable>

              {showRequests && (
                <GlassCard variant="light" style={{ marginTop: 12 }} noPadding>
                  {pendingRequests.length === 0 ? (
                    <View className="p-8 items-center">
                      <View
                        className="p-4 rounded-full mb-3"
                        style={{ backgroundColor: colors.primary.subtle }}
                      >
                        <Ionicons name="checkmark-circle" size={40} color={colors.text.secondary} />
                      </View>
                      <Text className="font-nunito text-center" style={{ color: colors.text.tertiary }}>
                        Aucune demande en attente
                      </Text>
                    </View>
                  ) : (
                    pendingRequests.map((req, index) => (
                      <View
                        key={req.id}
                        className="flex-row items-center p-4"
                        style={{
                          borderBottomWidth: index !== pendingRequests.length - 1 ? 1 : 0,
                          borderBottomColor: colors.glass.border,
                        }}
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
                          <Text className="font-nunito-bold" style={{ color: colors.text.primary }}>
                            {req.user.first_name} {req.user.last_name}
                          </Text>
                          {req.message && (
                            <Text
                              className="font-nunito text-xs mt-0.5"
                              style={{ color: colors.text.tertiary }}
                              numberOfLines={1}
                            >
                              {req.message}
                            </Text>
                          )}
                        </View>
                        <View className="flex-row ml-2">
                          <TouchableOpacity
                            onPress={() => handleDeclineRequest(req.id, req.user.id)}
                            className="p-2.5 rounded-full mr-2"
                            style={{ backgroundColor: 'rgba(212,115,110,0.15)' }}
                          >
                            <Ionicons name="close" size={20} color={colors.error} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleAcceptRequest(req.id, req.user.id)}
                            className="p-2.5 rounded-full"
                            style={{ backgroundColor: 'rgba(124,184,138,0.15)' }}
                          >
                            <Ionicons name="checkmark" size={20} color={colors.success} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  )}
                </GlassCard>
              )}
            </View>
          )}

          {/* MEMBER VIEW */}
          {group.is_member ? (
            <>
              {/* Chat Button */}
              <Pressable
                onPress={() => {
                  router.push({
                    pathname: "/chat/group/[id]",
                    params: {
                      id: id as string,
                      type: "group",
                      name: group.name,
                      image: group.cover_image || "https://via.placeholder.com/32",
                    },
                  });
                }}
                className="rounded-2xl p-5 flex-row items-center mb-4"
                style={{
                  backgroundColor: colors.primary.DEFAULT,
                  ...shadows.md,
                }}
              >
                <View className="w-14 h-14 bg-white/20 rounded-xl items-center justify-center mr-4">
                  <Ionicons name="chatbubbles" size={28} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-nunito-bold text-lg mb-0.5">
                    Conversation du groupe
                  </Text>
                  <Text className="text-white/80 font-nunito text-sm">
                    Rejoindre le chat
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="white" />
              </Pressable>

              {/* Members List */}
              {group.members && group.members.length > 0 && (
                <GlassCard variant="light" style={{ marginBottom: 16 }}>
                  <View className="flex-row items-center mb-4">
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: colors.primary.subtle }}
                    >
                      <Ionicons name="people" size={20} color={colors.text.secondary} />
                    </View>
                    <Text className="font-nunito-bold text-lg" style={{ color: colors.text.primary }}>
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
                            borderColor: colors.primary.light,
                          }}
                        />
                        <Text
                          className="font-nunito text-center text-xs"
                          style={{ color: colors.text.primary }}
                          numberOfLines={1}
                        >
                          {member.first_name}
                        </Text>
                      </View>
                    ))}
                  </View>
                </GlassCard>
              )}
            </>
          ) : (
            /* NON-MEMBER VIEW */
            <GlassCard variant="medium" style={{ marginBottom: 16 }}>
              <View className="items-center py-4">
                <View
                  className="p-6 rounded-full mb-4"
                  style={{ backgroundColor: colors.primary.subtle }}
                >
                  <Ionicons name="lock-closed" size={48} color={colors.text.secondary} />
                </View>
                <Text
                  className="font-nunito-bold text-xl text-center mb-2"
                  style={{ color: colors.text.primary }}
                >
                  Groupe Prive
                </Text>
                <Text
                  className="font-nunito text-center leading-6"
                  style={{ color: colors.text.tertiary }}
                >
                  Rejoignez ce groupe pour voir les membres et participer aux discussions.
                </Text>
              </View>
            </GlassCard>
          )}
        </View>
      </ScrollView>

      {/* Footer Action Button */}
      <View
        className="absolute bottom-0 left-0 right-0 px-4 py-4"
        style={{
          paddingBottom: Math.max(insets.bottom, 16) + 16,
          backgroundColor: colors.glass.heavy,
          borderTopWidth: 1,
          borderTopColor: colors.glass.border,
          ...shadows.md,
        }}
      >
        {group.is_member ? (
          <Pressable
            onPress={handleLeaveGroup}
            disabled={isActionLoading}
            className="w-full py-4 rounded-xl flex-row justify-center items-center"
            style={{
              backgroundColor: 'rgba(212,115,110,0.1)',
              borderWidth: 2,
              borderColor: colors.error,
              opacity: isActionLoading ? 0.5 : 1,
            }}
          >
            <Ionicons name="exit-outline" size={20} color={colors.error} style={{ marginRight: 8 }} />
            <Text className="font-nunito-bold text-base" style={{ color: colors.error }}>
              {isActionLoading ? "Chargement..." : "Quitter le groupe"}
            </Text>
          </Pressable>
        ) : group.has_pending_request ? (
          <View
            className="w-full py-4 rounded-xl flex-row justify-center items-center"
            style={{ backgroundColor: colors.glass.medium }}
          >
            <Ionicons
              name="time-outline"
              size={20}
              color={colors.text.tertiary}
              style={{ marginRight: 8 }}
            />
            <Text className="font-nunito-bold text-base" style={{ color: colors.text.secondary }}>
              Demande envoyee
            </Text>
          </View>
        ) : (
          <GlassButton
            title={isActionLoading ? "Envoi..." : "Demander a rejoindre"}
            onPress={handleRequestToJoin}
            disabled={isActionLoading || !group.can_join}
            icon={<Ionicons name="person-add" size={20} color="white" />}
            size="lg"
          />
        )}
      </View>
    </WarmBackground>
  );
}
