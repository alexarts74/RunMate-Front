import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { useAuth } from "@/context/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useThemeColors, typography, radii, spacing } from "@/constants/theme";
import GlassCard from "@/components/ui/GlassCard";
import WarmBackground from "@/components/ui/WarmBackground";

type RunnerProfileViewProps = {
  setIsEditing: (value: boolean) => void;
};

export function RunnerProfileView({ setIsEditing }: RunnerProfileViewProps) {
  const { user } = useAuth();
  const { colors, shadows } = useThemeColors();
  const runner = user?.runner_profile;

  // Fonction utilitaire pour parser les donnees JSON
  const parseJsonField = (field: any): any[] => {
    if (Array.isArray(field)) {
      return field;
    } else if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  };

  // Traduction des objectifs Performance
  const formatPerformanceObjective = (objective: string) => {
    const objectives: { [key: string]: string } = {
      "5km_sous_25min": "5km sous 25min",
      "10km_sous_50min": "10km sous 50min",
      semi_marathon: "Semi-marathon",
      marathon: "Marathon",
      trail: "Trail",
      ultra_trail: "Ultra-trail",
    };
    return objectives[objective] || objective;
  };

  // Traduction des objectifs Chill
  const formatChillObjective = (objective: string) => {
    const objectives: { [key: string]: string } = {
      course_reguliere: "Course reguliere",
      perdre_du_poids: "Perdre du poids",
      ameliorer_endurance: "Ameliorer l'endurance",
      social_running: "Course sociale",
      decouverte: "Decouverte",
      bien_etre: "Bien-etre",
    };
    return objectives[objective] || objective;
  };

  const formatDay = (day: string) => {
    const daysMap: { [key: string]: string } = {
      monday: "Lundi",
      tuesday: "Mardi",
      wednesday: "Mercredi",
      thursday: "Jeudi",
      friday: "Vendredi",
      saturday: "Samedi",
      sunday: "Dimanche",
    };
    return daysMap[day.toLowerCase()] || day;
  };

  const renderAvailability = () => {
    const availabilityArray = parseJsonField(runner?.availability);

    if (availabilityArray && availabilityArray.length > 0) {
      return availabilityArray.map((day: string) => (
        <View
          key={day}
          style={[styles.badge, { backgroundColor: colors.primary.subtle, borderColor: colors.primary.muted }]}
        >
          <Text style={[styles.badgeText, { color: colors.primary.dark }]}>
            {formatDay(day.trim())}
          </Text>
        </View>
      ));
    }

    return (
      <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
        Aucune disponibilite
      </Text>
    );
  };

  // Rendu d'une section generique avec titre et icone
  const renderSection = (
    title: string,
    icon: string,
    iconColor: string,
    children: React.ReactNode,
  ) => (
    <GlassCard
      variant="light"
      style={styles.sectionCard}
    >
      <View style={styles.sectionHeader}>
        <View style={[styles.iconBox, { backgroundColor: colors.primary.subtle }]}>
          <Ionicons name={icon as any} size={20} color={iconColor} />
        </View>
        <Text
          style={[styles.sectionTitle, { color: colors.text.primary }]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </GlassCard>
  );

  // Rendu d'une liste de badges
  const renderBadges = (items: string[], emptyMessage: string = "Aucun") => {
    if (!items || items.length === 0) {
      return (
        <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
          {emptyMessage}
        </Text>
      );
    }

    return (
      <View style={styles.badgesRow}>
        {items.map((item: string, index: number) => (
          <View
            key={index}
            style={[styles.badge, { backgroundColor: colors.primary.subtle, borderColor: colors.primary.muted }]}
          >
            <Text style={[styles.badgeText, { color: colors.primary.dark }]}>{item}</Text>
          </View>
        ))}
      </View>
    );
  };

  const isPerformance = runner?.running_type === 'perf';
  const isChill = runner?.running_type === 'chill';

  return (
    <WarmBackground>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContent}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={[styles.title, { color: colors.text.primary }]}>
                Profil Coureur
              </Text>
              {runner?.running_type && (
                <View style={[styles.typeBadge, { backgroundColor: colors.primary.DEFAULT }]}>
                  <Text style={styles.typeBadgeText}>
                    {runner.running_type === 'perf' ? 'Performance' : 'Chill'}
                  </Text>
                </View>
              )}
            </View>
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

          {/* Statistiques communes */}
          <View style={styles.statsGrid}>
            {isPerformance && runner?.actual_pace && (
              <GlassCard variant="light" style={styles.statCardHalf}>
                <View style={styles.statContent}>
                  <View style={[styles.statIconBox, { backgroundColor: colors.primary.subtle }]}>
                    <Ionicons name="speedometer-outline" size={24} color={colors.primary.DEFAULT} />
                  </View>
                  <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                    Allure actuelle
                  </Text>
                  <Text style={[styles.statValue, { color: colors.primary.DEFAULT }]}>
                    {runner.actual_pace} min/km
                  </Text>
                </View>
              </GlassCard>
            )}

            {isPerformance && runner?.target_pace && (
              <GlassCard variant="light" style={styles.statCardHalf}>
                <View style={styles.statContent}>
                  <View style={[styles.statIconBox, { backgroundColor: colors.primary.subtle }]}>
                    <Ionicons name="flag-outline" size={24} color={colors.text.secondary} />
                  </View>
                  <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                    Allure cible
                  </Text>
                  <Text style={[styles.statValue, { color: colors.primary.dark }]}>
                    {runner.target_pace} min/km
                  </Text>
                </View>
              </GlassCard>
            )}

            {isChill && runner?.usual_distance && (
              <GlassCard variant="light" style={styles.statCardFull}>
                <View style={styles.statContent}>
                  <View style={[styles.statIconBox, { backgroundColor: colors.primary.subtle }]}>
                    <Ionicons name="trail-sign-outline" size={24} color={colors.text.secondary} />
                  </View>
                  <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                    Distance habituelle
                  </Text>
                  <Text style={[styles.statValue, { color: colors.primary.dark }]}>
                    {runner.usual_distance} km
                  </Text>
                </View>
              </GlassCard>
            )}

            {isPerformance && runner?.weekly_mileage && (
              <GlassCard variant="light" style={styles.statCardHalf}>
                <View style={styles.statContent}>
                  <View style={[styles.statIconBox, { backgroundColor: colors.primary.subtle }]}>
                    <Ionicons name="stats-chart-outline" size={24} color={colors.primary.DEFAULT} />
                  </View>
                  <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                    Kilometrage hebdo
                  </Text>
                  <Text style={[styles.statValue, { color: colors.primary.DEFAULT }]}>
                    {runner.weekly_mileage} km
                  </Text>
                </View>
              </GlassCard>
            )}
          </View>

          {/* Sections en 2 colonnes */}
          <View style={styles.sectionsGrid}>
            {/* Objectifs */}
            {renderSection(
              "Objectifs",
              "trophy-outline",
              colors.primary.DEFAULT,
              <>
                {isPerformance && runner?.objective && Array.isArray(runner.objective) && runner.objective.length > 0 && (
                  <View style={styles.badgesRow}>
                    {runner.objective.map((obj: string, index: number) => (
                      <View
                        key={index}
                        style={[styles.badge, { backgroundColor: colors.primary.subtle, borderColor: colors.primary.muted }]}
                      >
                        <Text style={[styles.badgeText, { color: colors.primary.dark }]}>
                          {formatPerformanceObjective(obj)}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
                {isChill && runner?.objective && Array.isArray(runner.objective) && runner.objective.length > 0 && (
                  <View style={styles.badgesRow}>
                    {runner.objective.map((obj: string, index: number) => (
                      <View
                        key={index}
                        style={[styles.badge, { backgroundColor: colors.primary.subtle, borderColor: colors.primary.muted }]}
                      >
                        <Text style={[styles.badgeText, { color: colors.primary.dark }]}>
                          {formatChillObjective(obj)}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
                {(!runner?.objective || (Array.isArray(runner.objective) && runner.objective.length === 0)) && (
                  <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
                    Aucun objectif defini
                  </Text>
                )}
              </>,
            )}

            {/* Disponibilites */}
            {renderSection(
              "Disponibilites",
              "calendar-outline",
              colors.text.secondary,
              <View style={styles.badgesRow}>
                {renderAvailability()}
              </View>,
            )}

            {/* Type Performance - Objectifs de competition */}
            {isPerformance && runner?.competition_goals && (
              renderSection(
                "Objectifs de competition",
                "medal-outline",
                colors.primary.DEFAULT,
                <Text style={[styles.sectionText, { color: colors.text.primary }]}>
                  {runner.competition_goals}
                </Text>,
              )
            )}

            {/* Type Performance - Jours d'entrainement */}
            {isPerformance && runner?.training_days && Array.isArray(runner.training_days) && runner.training_days.length > 0 && (
              renderSection(
                "Jours d'entrainement",
                "fitness-outline",
                colors.primary.DEFAULT,
                renderBadges(parseJsonField(runner.training_days).map(formatDay), "Aucun jour d'entrainement"),
              )
            )}

            {/* Type Chill - Frequence de course */}
            {isChill && runner?.running_frequency && (
              renderSection(
                "Frequence de course",
                "repeat-outline",
                colors.text.secondary,
                <Text style={[styles.sectionText, { color: colors.text.primary }]}>
                  {runner.running_frequency}
                </Text>,
              )
            )}

            {/* Type Chill - Preferences sociales */}
            {isChill && runner?.social_preferences && (
              renderSection(
                "Preferences sociales",
                "people-outline",
                colors.text.secondary,
                renderBadges(parseJsonField(runner.social_preferences), "Aucune preference"),
              )
            )}

            {/* Type Chill - Moments preferes */}
            {isChill && runner?.preferred_time_of_day && (
              renderSection(
                "Moments preferes",
                "time-outline",
                colors.text.secondary,
                renderBadges(parseJsonField(runner.preferred_time_of_day), "Aucun moment prefere"),
              )
            )}

            {/* Type Chill - Activites post-course */}
            {isChill && runner?.post_run_activities && (
              renderSection(
                "Activites post-course",
                "cafe-outline",
                colors.text.secondary,
                renderBadges(parseJsonField(runner.post_run_activities), "Aucune activite"),
              )
            )}
          </View>
        </View>
      </ScrollView>
    </WarmBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 100,
  },
  mainContent: {
    gap: spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  title: {
    fontFamily: typography.h1.fontFamily,
    fontSize: typography.h1.fontSize,
    lineHeight: typography.h1.lineHeight,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  typeBadgeText: {
    color: "#FFFFFF",
    fontFamily: typography.label.fontFamily,
    fontSize: 11,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  editButton: {
    padding: 12,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCardHalf: {
    width: "47%",
    flexGrow: 1,
  },
  statCardFull: {
    width: "100%",
  },
  statContent: {
    alignItems: "center",
  },
  statIconBox: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statLabel: {
    fontFamily: typography.caption.fontFamily,
    fontSize: typography.caption.fontSize,
    marginTop: 4,
  },
  statValue: {
    fontFamily: typography.h3.fontFamily,
    fontSize: typography.h3.fontSize,
    marginTop: 4,
  },
  sectionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  sectionCard: {
    width: "47%",
    flexGrow: 1,
    minHeight: 120,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
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
    flex: 1,
  },
  sectionContent: {
    flex: 1,
  },
  sectionText: {
    fontFamily: typography.bodyMedium.fontFamily,
    fontSize: typography.body.fontSize,
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  badgeText: {
    fontFamily: typography.label.fontFamily,
    fontSize: typography.caption.fontSize,
  },
  emptyText: {
    fontFamily: typography.bodyMedium.fontFamily,
    fontSize: typography.caption.fontSize,
  },
});
