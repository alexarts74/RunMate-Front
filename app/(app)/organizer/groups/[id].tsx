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

export default function OrganizerGroupDetailsScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { colors, shadows, gradients } = useThemeColors();
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
      <WarmBackground>
        <View className="flex-1 items-center justify-center">
          <Text className="font-nunito-medium" style={{ color: colors.text.primary }}>
            Groupe non trouvé
          </Text>
        </View>
      </WarmBackground>
    );
  }

  // Vérifier que l'utilisateur est bien admin
  if (!group.is_admin) {
    return (
      <WarmBackground>
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="lock-closed" size={64} color={colors.primary.DEFAULT} />
          <Text
            className="font-nunito-bold text-xl mt-4 text-center"
            style={{ color: colors.text.primary }}
          >
            Accès restreint
          </Text>
          <Text
            className="font-nunito-medium text-center mt-2"
            style={{ color: colors.text.secondary }}
          >
            Vous n'êtes pas administrateur de ce groupe.
          </Text>
          <GlassButton
            title="Retour"
            onPress={() => router.back()}
            style={{ marginTop: 24 }}
          />
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

          <View className="absolute bottom-0 left-0 right-0 p-6">
            <View className="flex-row items-center mb-2">
              <View
                className="px-3 py-1 rounded-full mr-2"
                style={{ backgroundColor: colors.primary.DEFAULT }}
              >
                <Text className="text-white font-nunito-bold text-xs">Votre groupe</Text>
              </View>
            </View>
            <Text className="text-white font-nunito-bold text-3xl mb-2">
              {group.name}
            </Text>
            <View className="flex-row items-center">
              <View
                className="px-3 py-1.5 rounded-full flex-row items-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
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
            <GlassCard variant="medium" style={{ marginBottom: 16 }}>
              <View className="flex-row items-center mb-4">
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                  style={{ backgroundColor: colors.primary.subtle }}
                >
                  <Ionicons name="stats-chart" size={20} color={colors.primary.DEFAULT} />
                </View>
                <Text
                  className="font-nunito-bold text-lg"
                  style={{ color: colors.text.primary }}
                >
                  Statistiques du groupe
                </Text>
              </View>

              <View className="flex-row" style={{ gap: 12 }}>
                <View
                  className="flex-1 p-4 rounded-xl"
                  style={{ backgroundColor: colors.glass.light }}
                >
                  <Text
                    className="font-nunito-medium text-xs mb-1"
                    style={{ color: colors.text.secondary }}
                  >
                    Membres
                  </Text>
                  <Text
                    className="font-nunito-extrabold text-2xl"
                    style={{ color: colors.text.primary }}
                  >
                    {group.members_count || 0}
                  </Text>
                </View>

                <View
                  className="flex-1 p-4 rounded-xl"
                  style={{ backgroundColor: colors.glass.light }}
                >
                  <Text
                    className="font-nunito-medium text-xs mb-1"
                    style={{ color: colors.text.secondary }}
                  >
                    Demandes
                  </Text>
                  <Text
                    className="font-nunito-extrabold text-2xl"
                    style={{ color: colors.text.primary }}
                  >
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
                    Alert.alert("Modifier", "Fonctionnalité de modification à venir");
                  }}
                  style={{ flex: 1 }}
                />

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
                <Text
                  className="font-nunito-bold text-lg"
                  style={{ color: colors.text.primary }}
                >
                  À propos
                </Text>
              </View>
              <Text
                className="font-nunito leading-6"
                style={{ color: colors.text.secondary }}
              >
                {group.description}
              </Text>
            </GlassCard>
          )}

          {/* Demandes d'adhésion */}
          <Pressable
            onPress={() => setShowRequests(!showRequests)}
            style={{
              backgroundColor: colors.glass.medium,
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: colors.glass.border,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              ...shadows.sm,
            }}
          >
            <View className="flex-row items-center flex-1">
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: colors.primary.subtle }}
              >
                <Ionicons name="people-outline" size={20} color={colors.primary.DEFAULT} />
              </View>
              <Text
                className="font-nunito-bold text-base"
                style={{ color: colors.text.primary }}
              >
                Demandes d'adhésion
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
            <GlassCard variant="light" noPadding style={{ marginBottom: 16 }}>
              {pendingRequests.length === 0 ? (
                <View className="p-8 items-center">
                  <View
                    className="p-4 rounded-full mb-3"
                    style={{ backgroundColor: colors.glass.light }}
                  >
                    <Ionicons name="checkmark-circle" size={40} color={colors.text.secondary} />
                  </View>
                  <Text
                    className="font-nunito text-center"
                    style={{ color: colors.text.tertiary }}
                  >
                    Aucune demande en attente
                  </Text>
                </View>
              ) : (
                pendingRequests.map((req, index) => (
                  <View
                    key={req.id}
                    className="flex-row items-center p-4"
                    style={
                      index !== pendingRequests.length - 1
                        ? { borderBottomWidth: 1, borderBottomColor: colors.glass.border }
                        : undefined
                    }
                  >
                    <Image
                      source={
                        req.user.profile_image
                          ? { uri: req.user.profile_image }
                          : require("@/assets/images/favicon.png")
                      }
                      className="w-12 h-12 rounded-full mr-3"
                      style={{ borderWidth: 2, borderColor: colors.glass.border }}
                    />
                    <View className="flex-1">
                      <Text
                        className="font-nunito-bold"
                        style={{ color: colors.text.primary }}
                      >
                        {req.user.first_name} {req.user.last_name}
                      </Text>
                      {req.message && (
                        <Text
                          className="font-nunito text-xs mt-0.5"
                          numberOfLines={1}
                          style={{ color: colors.text.tertiary }}
                        >
                          {req.message}
                        </Text>
                      )}
                    </View>
                    <View className="flex-row ml-2">
                      <TouchableOpacity
                        onPress={() => handleDeclineRequest(req.id, req.user.id)}
                        className="p-2.5 rounded-full mr-2"
                        style={{ backgroundColor: 'rgba(212,115,110,0.1)' }}
                      >
                        <Ionicons name="close" size={20} color={colors.error} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleAcceptRequest(req.id, req.user.id)}
                        className="p-2.5 rounded-full"
                        style={{ backgroundColor: colors.primary.subtle }}
                      >
                        <Ionicons name="checkmark" size={20} color={colors.primary.DEFAULT} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </GlassCard>
          )}

          {/* Membres */}
          {group.members && group.members.length > 0 && (
            <GlassCard variant="light" style={{ marginBottom: 16 }}>
              <View className="flex-row items-center mb-4">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: colors.primary.subtle }}
                >
                  <Ionicons name="people" size={20} color={colors.text.secondary} />
                </View>
                <Text
                  className="font-nunito-bold text-lg"
                  style={{ color: colors.text.primary }}
                >
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
                      numberOfLines={1}
                      style={{ color: colors.text.primary }}
                    >
                      {member.first_name}
                    </Text>
                  </View>
                ))}
              </View>
            </GlassCard>
          )}
        </View>
      </ScrollView>
    </WarmBackground>
  );
}
