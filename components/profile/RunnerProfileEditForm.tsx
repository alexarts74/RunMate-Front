import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AvailabilitySelect } from "../runner-profile/AvailabilitySelect";
import { ObjectiveSelect } from "../runner-profile/ObjectiveSelect";
import { PaceDistanceInputs } from "../runner-profile/PaceDistanceInputs";
import { useThemeColors, typography, radii, spacing } from "@/constants/theme";
import GlassCard from "@/components/ui/GlassCard";
import GlassButton from "@/components/ui/GlassButton";
import WarmBackground from "@/components/ui/WarmBackground";

type RunnerProfileEditFormProps = {
  setIsEditing: (value: boolean) => void;
};

export function RunnerProfileEditForm({
  setIsEditing,
}: RunnerProfileEditFormProps) {
  const { user, updateUser } = useAuth();
  const { colors, shadows } = useThemeColors();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    actual_pace: user?.runner_profile?.actual_pace || "",
    usual_distance: user?.runner_profile?.usual_distance?.toString() || "",
    objective: user?.runner_profile?.objective || "",
    availability: user?.runner_profile?.availability || [],
  });

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await updateUser({
        ...user,
        runner_profile: {
          ...user?.runner_profile,
          ...formData,
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur mise a jour profil runner:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.flex}
    >
      <WarmBackground>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text.primary }]}>
                Modifier Profil Coureur
              </Text>
              <Pressable
                onPress={() => setIsEditing(false)}
                style={[
                  styles.closeButton,
                  shadows.sm,
                  { backgroundColor: colors.glass.light, borderColor: colors.glass.border },
                ]}
              >
                <Ionicons name="close" size={20} color={colors.primary.DEFAULT} />
              </Pressable>
            </View>

            <GlassCard variant="light">
              <View style={styles.sectionHeader}>
                <View style={[styles.iconBox, { backgroundColor: colors.primary.subtle }]}>
                  <Ionicons name="fitness-outline" size={20} color={colors.primary.DEFAULT} />
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                  Performance
                </Text>
              </View>
              <PaceDistanceInputs
                actual_pace={formData.actual_pace}
                usual_distance={formData.usual_distance}
                handleChange={handleChange}
              />
            </GlassCard>

            <GlassCard variant="light">
              <View style={styles.sectionHeader}>
                <View style={[styles.iconBox, { backgroundColor: colors.primary.subtle }]}>
                  <Ionicons name="trophy-outline" size={20} color={colors.primary.DEFAULT} />
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                  Objectif
                </Text>
              </View>
              <ObjectiveSelect handleChange={handleChange} />
            </GlassCard>

            <GlassCard variant="light">
              <View style={styles.sectionHeader}>
                <View style={[styles.iconBox, { backgroundColor: colors.primary.subtle }]}>
                  <Ionicons name="calendar-outline" size={20} color={colors.text.secondary} />
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                  Disponibilites
                </Text>
              </View>
              <AvailabilitySelect
                availability={formData.availability}
                handleChange={handleChange}
              />
            </GlassCard>

            <View style={styles.buttonsContainer}>
              <GlassButton
                title="Enregistrer"
                onPress={handleSubmit}
                variant="primary"
                loading={loading}
                disabled={loading}
                icon={
                  !loading ? (
                    <Ionicons name="checkmark-circle-outline" size={20} color="#ffffff" />
                  ) : undefined
                }
              />
            </View>
          </View>
        </ScrollView>
      </WarmBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: typography.h1.fontFamily,
    fontSize: typography.h1.fontSize,
    lineHeight: typography.h1.lineHeight,
  },
  closeButton: {
    padding: 12,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: spacing.md,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontFamily: typography.label.fontFamily,
    fontSize: typography.body.fontSize,
  },
  buttonsContainer: {
    gap: 12,
    marginTop: spacing.sm,
  },
});
