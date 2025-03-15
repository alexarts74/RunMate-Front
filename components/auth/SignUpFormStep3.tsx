import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, TextInput } from "react-native";
import { useFormValidation } from "@/hooks/auth/useFormValidation";
import { validateSignUpFormStep3 } from "@/constants/formValidation";
import { Ionicons } from "@expo/vector-icons";
import { ActionButton } from "../ui/ActionButton";
import { MultiSelect } from "../ui/MultiSelect";

interface SignUpFormStep3Props {
  formData: {
    actual_pace: string;
    target_pace: string;
    usual_distance: string;
    weekly_mileage: string;
    running_frequency: string[];
    preferred_time_of_day: string[];
    training_days: string[];
    competition_goals: string;
    social_preferences: string[];
    post_run_activities: string[];
    objective: string;
  };
  runnerType: "chill" | "perf";
  onBack: () => void;
  onSubmit: () => void;
  handleChange: (name: string, value: any) => void;
}

const PERFORMANCE_OBJECTIVES = [
  { value: "marathon", label: "Marathon" },
  { value: "semi_marathon", label: "Semi-marathon" },
  { value: "10km_sous_50min", label: "10km sous 50min" },
  { value: "5km_sous_25min", label: "5km sous 25min" },
  { value: "trail", label: "Trail" },
  { value: "ultra_trail", label: "Ultra-trail" },
];

//Beoin des objectifs en chill ?

// const CHILL_OBJECTIVES = [
//   "course_reguliere",
//   "perdre_du_poids",
//   "ameliorer_endurance",
//   "social_running",
//   "decouverte",
//   "bien_etre",
// ];

const TIME_PREFERENCES = [
  { value: "matin_tot", label: "Très tôt (5h-8h)" },
  { value: "matin", label: "Matin (8h-11h)" },
  { value: "midi", label: "Midi (11h-14h)" },
  { value: "apres_midi", label: "Après-midi (14h-18h)" },
  { value: "soir", label: "Soir (18h-22h)" },
];

const SOCIAL_PREFERENCES = [
  { value: "conversation", label: "Conversation" },
  { value: "musique", label: "Musique" },
  { value: "silence", label: "Silence" },
  { value: "flexible", label: "Flexible" },
];

const RUNNING_FREQUENCY = [
  { value: "1_fois_semaine", label: "1 fois par semaine" },
  { value: "2_fois_semaine", label: "2 fois par semaine" },
  { value: "3_fois_semaine", label: "3 fois par semaine" },
  { value: "flexible", label: "Flexible" },
];

const POST_RUN_ACTIVITIES = [
  { value: "cafe", label: "Café" },
  { value: "petit_dejeuner", label: "Petit Dejeuner" },
  { value: "brunch", label: "Brunch" },
  { value: "apero", label: "Apero" },
  { value: "aucune", label: "Aucune" },
];

export function SignUpFormStep3({
  formData,
  runnerType,
  onBack,
  onSubmit,
  handleChange,
}: SignUpFormStep3Props) {
  const { errors, validateForm, clearErrors } = useFormValidation();
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    clearErrors();
    setIsLoading(true);
    if (validateForm(validateSignUpFormStep3(formData, runnerType))) {
      onSubmit();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const checkFormValidity = () => {
      const commonRequiredFields = formData.usual_distance.trim() !== "";

      const chillRequiredFields =
        Array.isArray(formData.social_preferences) &&
        formData.social_preferences.length > 0 &&
        Array.isArray(formData.running_frequency) &&
        formData.running_frequency.length > 0 &&
        Array.isArray(formData.post_run_activities) &&
        formData.post_run_activities.length > 0 &&
        Array.isArray(formData.preferred_time_of_day) &&
        formData.preferred_time_of_day.length > 0;

      const perfRequiredFields =
        formData.actual_pace.trim() !== "" &&
        formData.target_pace.trim() !== "" &&
        formData.weekly_mileage.trim() !== "" &&
        Array.isArray(formData.training_days) &&
        formData.training_days.length > 0;

      const isValid =
        commonRequiredFields &&
        (runnerType === "perf" ? perfRequiredFields : chillRequiredFields);

      setIsFormValid(isValid);
    };

    checkFormValidity();
  }, [formData, runnerType]);

  return (
    <View className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false} className="mb-32">
        {/* Header */}
        <View className="h-[15%] mt-8 flex-row items-center">
          <Pressable
            onPress={onBack}
            className="bg-[#1e2429] p-1.5 rounded-full border border-gray-700 active:opacity-80 ml-6"
          >
            <Ionicons name="arrow-back" size={22} color="#8101f7" />
          </Pressable>

          <View className="flex-1">
            <Text className="text-white text-2xl mr-8 font-bold text-center">
              {runnerType === "perf" ? (
                <>
                  Runner <Text className="text-purple">Performance</Text> 🏃‍♂️
                </>
              ) : (
                <>
                  Runner <Text className="text-purple">Chill</Text> 🎉
                </>
              )}
            </Text>
          </View>
        </View>

        {/* Form Content */}
        <View className="space-y-10 px-4">
          <View className="space-y-8">
            {runnerType === "perf" && (
              <View>
                <View className="flex-row items-center mb-4 px-2">
                  <Ionicons
                    name="speedometer-outline"
                    size={24}
                    color="#8101f7"
                  />
                  <Text className="text-white text-sm font-semibold ml-2">
                    Allure actuelle
                  </Text>
                </View>
                <TextInput
                  className="bg-[#1e2429] text-white px-6 py-4 rounded-full border border-gray-700"
                  placeholder="min/km"
                  placeholderTextColor="#9CA3AF"
                  value={formData.actual_pace}
                  onChangeText={(text) => handleChange("actual_pace", text)}
                />
                {errors.actual_pace && (
                  <Text className="text-red-500 mt-2 ml-4">
                    {errors.actual_pace}
                  </Text>
                )}
              </View>
            )}

            <View>
              <View className="flex-row items-center mb-2">
                <Ionicons name="map-outline" size={18} color="#8101f7" />
                <Text className="text-white text-sm font-semibold ml-2">
                  Distance habituelle / semaine (km)
                </Text>
              </View>
              <TextInput
                className="bg-[#1e2429] text-white px-6 py-4 rounded-full border border-gray-700"
                placeholder="km"
                placeholderTextColor="#9CA3AF"
                value={formData.usual_distance}
                onChangeText={(text) => handleChange("usual_distance", text)}
              />
              {errors.usual_distance && (
                <Text className="text-red-500 mt-2 ml-4">
                  {errors.usual_distance}
                </Text>
              )}
            </View>
          </View>

          {/* Performance Fields */}
          {runnerType === "perf" && (
            <View className="space-y-8">
              <View>
                <View className="flex-row items-center mb-4 px-2">
                  <Ionicons name="trophy-outline" size={24} color="#8101f7" />
                  <Text className="text-white text-sm font-semibold ml-2">
                    Objectif d'allure
                  </Text>
                </View>
                <TextInput
                  className="bg-[#1e2429] text-white px-6 py-4 rounded-full border border-gray-700"
                  placeholder="min/km"
                  placeholderTextColor="#9CA3AF"
                  value={formData.target_pace}
                  onChangeText={(text) => handleChange("target_pace", text)}
                />
              </View>

              <View>
                <View className="flex-row items-center mb-4 px-4">
                  <Ionicons name="stats-chart" size={24} color="#8101f7" />
                  <Text className="text-white text-sm font-semibold ml-2">
                    Kilométrage hebdomadaire
                  </Text>
                </View>
                <TextInput
                  className="bg-[#1e2429] text-white px-6 py-4 rounded-full border border-gray-700"
                  placeholder="km/semaine"
                  placeholderTextColor="#9CA3AF"
                  value={formData.weekly_mileage}
                  onChangeText={(text) => handleChange("weekly_mileage", text)}
                />
              </View>

              <MultiSelect
                label="📅 Jours d'entraînement"
                options={[
                  "Lundi",
                  "Mardi",
                  "Mercredi",
                  "Jeudi",
                  "Vendredi",
                  "Samedi",
                  "Dimanche",
                ]}
                selectedValues={formData.training_days}
                onChange={(values) => handleChange("training_days", values)}
              />

              <MultiSelect
                label="🎯 Objectifs de compétition"
                options={PERFORMANCE_OBJECTIVES.map((obj) => obj.label)}
                selectedValues={[formData.competition_goals]}
                onChange={(values) =>
                  handleChange("competition_goals", values[0])
                }
              />
            </View>
          )}

          {/* Chill Fields */}
          {runnerType === "chill" && (
            <View className="space-y-8 -mt-4">
              <MultiSelect
                label="🎧 Préférences sociales"
                options={SOCIAL_PREFERENCES.map((pref) => pref.label)}
                selectedValues={formData.social_preferences}
                onChange={(values) =>
                  handleChange("social_preferences", values)
                }
              />

              <View className="mt-4">
                <MultiSelect
                  label="☕️ Activités post-course"
                  options={POST_RUN_ACTIVITIES.map(
                    (activity) => activity.label
                  )}
                  selectedValues={formData.post_run_activities}
                  onChange={(values) =>
                    handleChange("post_run_activities", values)
                  }
                />
              </View>
              <View>
                <MultiSelect
                  label="🏃‍♂️ Fréquence de course"
                  options={RUNNING_FREQUENCY.map((freq) => freq.label)}
                  selectedValues={formData.running_frequency}
                  onChange={(values) =>
                    handleChange("running_frequency", values)
                  }
                />
              </View>

              <View className="mt-2">
                <MultiSelect
                  label="🌅 Moment préféré de la journée"
                  options={TIME_PREFERENCES.map((time) => time.label)}
                  selectedValues={formData.preferred_time_of_day}
                  onChange={(values) =>
                    handleChange("preferred_time_of_day", values)
                  }
                />
              </View>
            </View>
          )}
        </View>

        {/* Padding bottom for scroll */}
        <View className="h-32" />
      </ScrollView>

      {/* Fixed Button at Bottom */}
      <View className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t border-gray-700">
        <ActionButton
          onPress={handleSubmit}
          text={runnerType === "perf" ? "C'est parti ! 🚀" : "Let's go ! 🎯"}
          loading={isLoading}
        />
      </View>
    </View>
  );
}
