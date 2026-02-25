import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { groupService } from "@/service/api/group";
import { useRouter, useFocusEffect } from "expo-router";
import LoadingScreen from "../LoadingScreen";
import { PremiumFeatureModal } from "../common/PremiumFeatureModal";
import { useAuth } from "@/context/AuthContext";
import { useThemeColors, radii, typography } from "@/constants/theme";
import GlassCard from "@/components/ui/GlassCard";
import GlassButton from "@/components/ui/GlassButton";
import WarmBackground from "@/components/ui/WarmBackground";
import PulseLoader from "@/components/ui/PulseLoader";

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
  const { colors, shadows } = useThemeColors();

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
      onPress={() => handleFeatureAccess(item.id)}
      style={{ marginHorizontal: 16, marginBottom: 12 }}
    >
      <GlassCard
        variant="medium"
        noPadding
        style={{
          borderRadius: radii.lg,
          ...shadows.md,
        }}
      >
        <Image
          source={
            item.cover_image
              ? { uri: item.cover_image }
              : require("@/assets/images/favicon.png")
          }
          style={{
            width: "100%",
            height: 128,
            resizeMode: "cover",
            borderTopLeftRadius: radii.lg,
            borderTopRightRadius: radii.lg,
          }}
        />

        <View style={{ padding: 16 }}>
          <Text
            style={{
              ...typography.h3,
              color: colors.text.primary,
              marginBottom: 8,
            }}
          >
            {item.name}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="people"
                size={16}
                color={colors.primary.DEFAULT}
              />
              <Text
                style={{
                  ...typography.caption,
                  color: colors.text.secondary,
                  marginLeft: 8,
                }}
              >
                {item.members_count} membres
              </Text>
            </View>

            <GlassButton
              title="Voir le groupe"
              onPress={() => handleFeatureAccess(item.id)}
              variant="secondary"
              size="sm"
            />
          </View>
        </View>
      </GlassCard>
    </Pressable>
  );

  return (
    <WarmBackground style={{ flex: 1 }}>
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
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 24,
                  paddingVertical: 40,
                }}
              >
                <View
                  style={{
                    backgroundColor: colors.primary.subtle,
                    padding: 32,
                    borderRadius: 9999,
                    marginBottom: 24,
                  }}
                >
                  <Ionicons
                    name="fitness"
                    size={60}
                    color={colors.primary.DEFAULT}
                  />
                </View>
                <Text
                  style={{
                    ...typography.h2,
                    color: colors.text.primary,
                    textAlign: "center",
                    marginBottom: 12,
                  }}
                >
                  Aucun groupe trouve
                </Text>
                <Text
                  style={{
                    ...typography.body,
                    color: colors.text.tertiary,
                    textAlign: "center",
                    marginBottom: 32,
                  }}
                >
                  Les groupes de course vous permettent de rencontrer d'autres
                  coureurs et de participer a des evenements ensemble.
                </Text>
                <GlassButton
                  title="Explorer les groupes"
                  onPress={() => router.push("/")}
                  variant="primary"
                  icon={
                    <Ionicons name="people" size={20} color="#FFFFFF" />
                  }
                />
              </View>
            )}
          />
        )}
      </View>
      <PremiumFeatureModal
        onUpgrade={onUpgrade}
        visible={showPremiumModal}
        onClose={closeModal}
        title="Fonctionnalite Premium"
        description="Les groupes de course seront bientot disponibles dans la version premium de l'application. Stay tuned !"
      />
    </WarmBackground>
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
