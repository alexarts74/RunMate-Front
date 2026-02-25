import React from "react";
import { useAuth } from "@/context/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { OrganizerProfileView } from "./OrganizerProfileView";
import { useThemeColors, typography, radii, spacing } from "@/constants/theme";
import GlassCard from "@/components/ui/GlassCard";
import GlassAvatar from "@/components/ui/GlassAvatar";
import WarmBackground from "@/components/ui/WarmBackground";

type ProfileViewProps = {
  setIsEditing: (value: boolean) => void;
};

export function ProfileView({ setIsEditing }: ProfileViewProps) {
  const { user } = useAuth();
  const { colors, shadows } = useThemeColors();

  // Si l'utilisateur est un organisateur, afficher le profil organisateur
  if (user?.user_type === "organizer") {
    return <OrganizerProfileView setIsEditing={setIsEditing} />;
  }

  const renderField = (label: string, value: string | undefined | null, isMultiline = false) => (
    <View style={styles.fieldContainer}>
      <Text style={[styles.label, { color: colors.text.secondary }]}>{label}</Text>
      <GlassCard variant="light" style={isMultiline ? styles.multilineCard : styles.fieldCard}>
        <Text style={[styles.fieldValue, { color: colors.text.primary }]}>
          {value || "Non renseigne"}
        </Text>
      </GlassCard>
    </View>
  );

  // Sinon, afficher le profil runner classique
  return (
    <WarmBackground>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text.primary }]}>Mon Profil</Text>
          <Pressable
            onPress={() => setIsEditing(true)}
            style={[
              styles.editButton,
              shadows.sm,
              { backgroundColor: colors.glass.light, borderColor: colors.glass.border },
            ]}
          >
            <Ionicons name="pencil" size={20} color={colors.primary.DEFAULT} />
          </Pressable>
        </View>

        <View style={styles.avatarContainer}>
          <GlassAvatar
            uri={user?.profile_image}
            size={128}
            showRing
          />
        </View>

        <View style={styles.fieldsContainer}>
          {renderField("Nom complet", `${user?.first_name} ${user?.last_name}`)}
          {renderField("Email", user?.email)}
          {renderField("Age", user?.age ? `${user.age} ans` : null)}
          {renderField("Genre", user?.gender)}
          {renderField("Bio", user?.bio || "Aucune bio", true)}
        </View>
      </ScrollView>
    </WarmBackground>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 150,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: typography.h1.fontFamily,
    fontSize: typography.h1.fontSize,
    lineHeight: typography.h1.lineHeight,
  },
  editButton: {
    padding: 12,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  fieldsContainer: {
    gap: spacing.md,
  },
  fieldContainer: {
    gap: 6,
  },
  label: {
    fontFamily: typography.label.fontFamily,
    fontSize: typography.label.fontSize,
    paddingLeft: 4,
  },
  fieldCard: {
    borderRadius: radii.full,
  },
  multilineCard: {
    borderRadius: radii.lg,
  },
  fieldValue: {
    fontFamily: typography.bodyMedium.fontFamily,
    fontSize: typography.bodyMedium.fontSize,
  },
});
