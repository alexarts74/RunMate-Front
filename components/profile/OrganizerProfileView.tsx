import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View, Text, Pressable, ScrollView, Linking, StyleSheet } from "react-native";
import { organizerProfileService } from "@/service/api/organizerProfile";
import { OrganizerProfile } from "@/interface/User";
import { useThemeColors, typography, radii, spacing } from "@/constants/theme";
import GlassCard from "@/components/ui/GlassCard";
import GlassButton from "@/components/ui/GlassButton";
import WarmBackground from "@/components/ui/WarmBackground";
import PulseLoader from "@/components/ui/PulseLoader";

type OrganizerProfileViewProps = {
  setIsEditing: (value: boolean) => void;
};

const organizationTypeLabels: { [key: string]: string } = {
  association: "Association",
  club_sportif: "Club sportif",
  entreprise: "Entreprise",
  collectif: "Collectif",
  autre: "Autre",
};

export function OrganizerProfileView({ setIsEditing }: OrganizerProfileViewProps) {
  const { user } = useAuth();
  const { colors, shadows } = useThemeColors();
  const [organizerProfile, setOrganizerProfile] = useState<OrganizerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const profile = await organizerProfileService.getProfile();
        setOrganizerProfile(profile);
      } catch (error) {
        console.error("Erreur lors du chargement du profil organisateur:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.user_type === "organizer") {
      loadProfile();
    }
  }, [user]);

  const handleOpenWebsite = (url: string) => {
    if (url && !url.startsWith("http")) {
      Linking.openURL(`https://${url}`);
    } else if (url) {
      Linking.openURL(url);
    }
  };

  const handleCall = (phone: string) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const handleEmail = (email: string) => {
    if (email) {
      Linking.openURL(`mailto:${email}`);
    }
  };

  if (loading) {
    return (
      <WarmBackground style={styles.centeredContainer}>
        <PulseLoader />
        <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
          Chargement...
        </Text>
      </WarmBackground>
    );
  }

  if (!organizerProfile) {
    return (
      <WarmBackground style={styles.centeredContainer}>
        <Ionicons name="business-outline" size={64} color={colors.text.tertiary} />
        <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
          Aucun profil organisateur
        </Text>
        <Text style={[styles.emptySubtitle, { color: colors.text.secondary }]}>
          Votre profil organisateur n'a pas encore ete cree.
        </Text>
        <GlassButton
          title="Creer mon profil"
          onPress={() => setIsEditing(true)}
          variant="primary"
          style={styles.createButton}
        />
      </WarmBackground>
    );
  }

  const renderField = (label: string, value: string | undefined | null) => (
    <View style={styles.fieldContainer}>
      <Text style={[styles.label, { color: colors.text.secondary }]}>{label}</Text>
      <GlassCard variant="light" style={styles.fieldCard}>
        <Text style={[styles.fieldValue, { color: colors.text.primary }]}>
          {value || "Non renseigne"}
        </Text>
      </GlassCard>
    </View>
  );

  const renderPressableField = (
    label: string,
    value: string,
    onPress: () => void,
    iconName: string,
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={[styles.label, { color: colors.text.secondary }]}>{label}</Text>
      <Pressable onPress={onPress}>
        <GlassCard variant="light" style={styles.fieldCard}>
          <View style={styles.pressableFieldContent}>
            <Text
              style={[styles.fieldValue, { color: colors.primary.DEFAULT, flex: 1 }]}
              numberOfLines={1}
            >
              {value}
            </Text>
            <Ionicons name={iconName as any} size={20} color={colors.primary.DEFAULT} />
          </View>
        </GlassCard>
      </Pressable>
    </View>
  );

  return (
    <WarmBackground>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text.primary }]}>Mon Organisation</Text>
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

        <View style={styles.avatarSection}>
          <View
            style={[
              styles.orgAvatar,
              {
                borderColor: colors.primary.light,
                backgroundColor: colors.primary.subtle,
              },
            ]}
          >
            <Ionicons name="business" size={64} color={colors.primary.DEFAULT} />
          </View>
          <Text style={[styles.orgName, { color: colors.text.primary }]}>
            {organizerProfile.organization_name}
          </Text>
          <Text style={[styles.orgType, { color: colors.text.secondary }]}>
            {organizationTypeLabels[organizerProfile.organization_type] || organizerProfile.organization_type}
          </Text>
        </View>

        <View style={styles.fieldsContainer}>
          {/* Description */}
          {organizerProfile.description && (
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: colors.text.secondary }]}>Description</Text>
              <GlassCard variant="light">
                <Text style={[styles.fieldValue, { color: colors.text.primary }]}>
                  {organizerProfile.description}
                </Text>
              </GlassCard>
            </View>
          )}

          {/* Site web */}
          {organizerProfile.website && (
            renderPressableField(
              "Site web",
              organizerProfile.website,
              () => handleOpenWebsite(organizerProfile.website!),
              "open-outline",
            )
          )}

          {/* Email de contact */}
          {organizerProfile.email && (
            renderPressableField(
              "Email de contact",
              organizerProfile.email,
              () => handleEmail(organizerProfile.email!),
              "mail-outline",
            )
          )}

          {/* Telephone */}
          {organizerProfile.phone && (
            renderPressableField(
              "Telephone",
              organizerProfile.phone,
              () => handleCall(organizerProfile.phone!),
              "call-outline",
            )
          )}

          {/* Adresse */}
          {(organizerProfile.address || organizerProfile.city) && (
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: colors.text.secondary }]}>Localisation</Text>
              <GlassCard variant="light">
                {organizerProfile.address && (
                  <Text style={[styles.fieldValue, { color: colors.text.primary, marginBottom: 4 }]}>
                    {organizerProfile.address}
                  </Text>
                )}
                <Text style={[styles.fieldValue, { color: colors.text.primary }]}>
                  {organizerProfile.postcode && `${organizerProfile.postcode} `}
                  {organizerProfile.city}
                  {organizerProfile.department && ` (${organizerProfile.department})`}
                </Text>
                {organizerProfile.country && (
                  <Text style={[styles.fieldSubValue, { color: colors.text.secondary }]}>
                    {organizerProfile.country}
                  </Text>
                )}
              </GlassCard>
            </View>
          )}

          {/* Email du compte */}
          {renderField("Email du compte", user?.email)}
        </View>
      </ScrollView>
    </WarmBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
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
  avatarSection: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  orgAvatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  orgName: {
    fontFamily: typography.h1.fontFamily,
    fontSize: 20,
    marginTop: spacing.md,
    textAlign: "center",
  },
  orgType: {
    fontFamily: typography.bodyMedium.fontFamily,
    fontSize: typography.caption.fontSize,
    marginTop: 4,
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
  fieldValue: {
    fontFamily: typography.bodyMedium.fontFamily,
    fontSize: typography.bodyMedium.fontSize,
  },
  fieldSubValue: {
    fontFamily: typography.bodyMedium.fontFamily,
    fontSize: typography.caption.fontSize,
    marginTop: 4,
  },
  pressableFieldContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  loadingText: {
    fontFamily: typography.bodyMedium.fontFamily,
    fontSize: typography.body.fontSize,
    marginTop: spacing.md,
  },
  emptyTitle: {
    fontFamily: typography.h2.fontFamily,
    fontSize: typography.h2.fontSize,
    marginTop: spacing.md,
    textAlign: "center",
  },
  emptySubtitle: {
    fontFamily: typography.bodyMedium.fontFamily,
    fontSize: typography.caption.fontSize,
    marginTop: spacing.sm,
    textAlign: "center",
  },
  createButton: {
    marginTop: spacing.lg,
  },
});
