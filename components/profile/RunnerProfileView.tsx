import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useAuth } from "@/context/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";

const ACCENT = "#F97316";

type RunnerProfileViewProps = {
  setIsEditing: (value: boolean) => void;
};

export function RunnerProfileView({ setIsEditing }: RunnerProfileViewProps) {
  const { user } = useAuth();
  const runner = user?.runner_profile;

  // Fonction utilitaire pour parser les données JSON
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
      course_reguliere: "Course régulière",
      perdre_du_poids: "Perdre du poids",
      ameliorer_endurance: "Améliorer l'endurance",
      social_running: "Course sociale",
      decouverte: "Découverte",
      bien_etre: "Bien-être",
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
        <View key={day} className="bg-tertiary border border-secondary px-3 py-1 rounded-full">
          <Text className="text-secondary font-nunito-bold text-xs">{formatDay(day.trim())}</Text>
        </View>
      ));
    }
    
    return <Text className="text-gray-500 font-nunito-medium">Aucune disponibilité</Text>;
  };

  // Rendu d'une section générique avec titre et icône
  const renderSection = (
    title: string,
    icon: string,
    iconColor: string,
    children: React.ReactNode,
    bgColor: string = ACCENT
  ) => (
    <View className="bg-white rounded-2xl border border-gray-200"
      style={{
        width: '48%',
        minHeight: 120,
        padding: 16,
        shadowColor: bgColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 12,
      }}
    >
      <View className="flex-row items-center mb-3" style={{ gap: 12 }}>
        <View className="w-10 h-10 rounded-xl bg-tertiary items-center justify-center">
          <Ionicons name={icon as any} size={20} color={iconColor} />
        </View>
        <Text className="text-gray-900 text-base font-nunito-bold flex-1" numberOfLines={1}>
          {title}
        </Text>
      </View>
      <View className="flex-1">
        {children}
      </View>
    </View>
  );

  // Rendu d'une liste de badges
  const renderBadges = (items: string[], emptyMessage: string = "Aucun") => {
    if (!items || items.length === 0) {
      return <Text className="text-gray-500 font-nunito-medium text-sm">{emptyMessage}</Text>;
    }
    
    return (
      <View className="flex-row flex-wrap" style={{ gap: 8 }}>
        {items.map((item: string, index: number) => (
          <View key={index} className="bg-tertiary border border-secondary px-3 py-1.5 rounded-full">
            <Text className="text-secondary font-nunito-bold text-xs">{item}</Text>
          </View>
        ))}
      </View>
    );
  };

  const isPerformance = runner?.running_type === 'perf';
  const isChill = runner?.running_type === 'chill';

  return (
    <ScrollView 
      className="flex-1"
      contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="space-y-6">
        <View className="flex-row justify-between items-center mb-2">
          <View className="flex-row items-center space-x-3">
            <Text className="text-2xl font-nunito-extrabold text-gray-900">Profil Coureur</Text>
            {runner?.running_type && (
              <View className="bg-primary px-3 py-1 rounded-full">
                <Text className="text-white font-nunito-bold text-xs uppercase">
                  {runner.running_type === 'perf' ? 'Performance' : 'Chill'}
                </Text>
              </View>
            )}
          </View>
          <Pressable
            onPress={() => setIsEditing(true)}
            className="bg-tertiary p-3 rounded-full"
            style={{
              shadowColor: ACCENT,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Ionicons name="pencil" size={20} color={ACCENT} />
          </Pressable>
        </View>

        {/* Statistiques communes */}
        <View className="flex-row flex-wrap mb-6" style={{ gap: 12, rowGap: 12 }}>
        {isPerformance && runner?.actual_pace && (
          <View className="bg-white rounded-2xl border border-gray-200"
            style={{
              width: '48%',
              padding: 16,
              shadowColor: ACCENT,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View className="items-center">
              <View className="w-12 h-12 rounded-xl bg-tertiary items-center justify-center mb-3">
                <Ionicons name="speedometer-outline" size={24} color={ACCENT} />
              </View>
              <Text className="text-gray-600 text-sm font-nunito-medium mt-1">
                Allure actuelle
              </Text>
              <Text className="text-primary text-lg mt-1 font-nunito-bold">
                {runner.actual_pace} min/km
              </Text>
            </View>
          </View>
        )}
        
        {isPerformance && runner?.target_pace && (
          <View className="bg-white rounded-2xl border border-gray-200"
            style={{
              width: '48%',
              padding: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View className="items-center">
              <View className="w-12 h-12 rounded-xl bg-tertiary items-center justify-center mb-3">
                <Ionicons name="flag-outline" size={24} color="#525252" />
              </View>
              <Text className="text-gray-600 text-sm font-nunito-medium mt-1">
                Allure cible
              </Text>
              <Text className="text-secondary text-lg mt-1 font-nunito-bold">
                {runner.target_pace} min/km
              </Text>
            </View>
          </View>
        )}

        {isChill && runner?.usual_distance && (
          <View className="bg-white rounded-2xl border border-gray-200"
            style={{
              width: '100%',
              padding: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View className="items-center">
              <View className="w-12 h-12 rounded-xl bg-tertiary items-center justify-center mb-3">
                <Ionicons name="trail-sign-outline" size={24} color="#525252" />
              </View>
              <Text className="text-gray-600 text-sm font-nunito-medium mt-1">
                Distance habituelle
              </Text>
              <Text className="text-secondary text-lg mt-1 font-nunito-bold">
                {runner.usual_distance} km
              </Text>
            </View>
          </View>
        )}

        {isPerformance && runner?.weekly_mileage && (
          <View className="bg-white rounded-2xl border border-gray-200"
            style={{
              width: '48%',
              padding: 16,
              shadowColor: ACCENT,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View className="items-center">
              <View className="w-12 h-12 rounded-xl bg-tertiary items-center justify-center mb-3">
                <Ionicons name="stats-chart-outline" size={24} color={ACCENT} />
              </View>
              <Text className="text-gray-600 text-sm font-nunito-medium mt-1">
                Kilométrage hebdo
              </Text>
              <Text className="text-primary text-lg mt-1 font-nunito-bold">
                {runner.weekly_mileage} km
              </Text>
            </View>
          </View>
        )}
      </View>

        {/* Sections en 2 colonnes */}
        <View className="flex-row flex-wrap" style={{ gap: 12, rowGap: 12 }}>
        {/* Objectifs */}
        {renderSection(
          "Objectifs",
          "trophy-outline",
          ACCENT,
          <>
            {isPerformance && runner?.objective && Array.isArray(runner.objective) && runner.objective.length > 0 && (
              <View className="flex-row flex-wrap gap-2">
                {runner.objective.map((obj: string, index: number) => (
                  <View key={index} className="bg-tertiary border border-secondary px-3 py-1 rounded-full">
                    <Text className="text-secondary font-nunito-bold text-xs">
                      {formatPerformanceObjective(obj)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            {isChill && runner?.objective && Array.isArray(runner.objective) && runner.objective.length > 0 && (
              <View className="flex-row flex-wrap gap-2">
                {runner.objective.map((obj: string, index: number) => (
                  <View key={index} className="bg-tertiary border border-secondary px-3 py-1 rounded-full">
                    <Text className="text-secondary font-nunito-bold text-xs">
                      {formatChillObjective(obj)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            {(!runner?.objective || (Array.isArray(runner.objective) && runner.objective.length === 0)) && (
              <Text className="text-gray-500 font-nunito-medium">Aucun objectif défini</Text>
            )}
          </>,
          "ACCENT"
        )}

        {/* Disponibilités */}
        {renderSection(
          "Disponibilités",
          "calendar-outline",
          "#525252",
          <View className="flex-row flex-wrap gap-2">
            {renderAvailability()}
          </View>,
          "#525252"
        )}

        {/* Type Performance - Objectifs de compétition */}
        {isPerformance && runner?.competition_goals && (
          renderSection(
            "Objectifs de compétition",
            "medal-outline",
            ACCENT,
            <Text className="text-gray-700 text-base font-nunito-medium">
              {runner.competition_goals}
            </Text>,
            "ACCENT"
          )
        )}

        {/* Type Performance - Jours d'entraînement */}
        {isPerformance && runner?.training_days && Array.isArray(runner.training_days) && runner.training_days.length > 0 && (
          renderSection(
            "Jours d'entraînement",
            "fitness-outline",
            ACCENT,
            renderBadges(parseJsonField(runner.training_days).map(formatDay), "Aucun jour d'entraînement"),
            "ACCENT"
          )
        )}

        {/* Type Chill - Fréquence de course */}
        {isChill && runner?.running_frequency && (
          renderSection(
            "Fréquence de course",
            "repeat-outline",
            "#525252",
            <Text className="text-gray-700 text-base font-nunito-medium">
              {runner.running_frequency}
            </Text>,
            "#525252"
          )
        )}

        {/* Type Chill - Préférences sociales */}
        {isChill && runner?.social_preferences && (
          renderSection(
            "Préférences sociales",
            "people-outline",
            "#525252",
            renderBadges(parseJsonField(runner.social_preferences), "Aucune préférence"),
            "#525252"
          )
        )}

        {/* Type Chill - Moments préférés */}
        {isChill && runner?.preferred_time_of_day && (
          renderSection(
            "Moments préférés",
            "time-outline",
            "#525252",
            renderBadges(parseJsonField(runner.preferred_time_of_day), "Aucun moment préféré"),
            "#525252"
          )
        )}

        {/* Type Chill - Activités post-course */}
        {isChill && runner?.post_run_activities && (
          renderSection(
            "Activités post-course",
            "cafe-outline",
            "#525252",
            renderBadges(parseJsonField(runner.post_run_activities), "Aucune activité"),
            "#525252"
          )
        )}
      </View>
      </View>
    </ScrollView>
  );
}
