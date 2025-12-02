import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useFormValidation } from "@/hooks/auth/useFormValidation";
import {
  validateSignUpFormStep3,
  resetErrorsAfterDelay,
} from "@/constants/formValidation";
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
    competition_goals: string[];
    social_preferences: string[];
    post_run_activities: string[];
    objective: string[];
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

const CHILL_OBJECTIVES_OPTIONS = [
  { value: "course_reguliere", label: "Course régulière" },
  { value: "perdre_du_poids", label: "Perdre du poids" },
  { value: "ameliorer_endurance", label: "Améliorer l'endurance" },
  { value: "social_running", label: "Social running" },
  { value: "decouverte", label: "Découverte" },
  { value: "bien_etre", label: "Bien-être" },
];

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

const PACE_OPTIONS = [
  { value: "4:00", label: "4:00 min/km" },
  { value: "4:05", label: "4:05 min/km" },
  { value: "4:10", label: "4:10 min/km" },
  { value: "4:15", label: "4:15 min/km" },
  { value: "4:20", label: "4:20 min/km" },
  { value: "4:25", label: "4:25 min/km" },
  { value: "4:30", label: "4:30 min/km" },
  { value: "4:35", label: "4:35 min/km" },
  { value: "4:40", label: "4:40 min/km" },
  { value: "4:45", label: "4:45 min/km" },
  { value: "4:50", label: "4:50 min/km" },
  { value: "4:55", label: "4:55 min/km" },
  { value: "5:00", label: "5:00 min/km" },
  { value: "5:05", label: "5:05 min/km" },
  { value: "5:10", label: "5:10 min/km" },
  { value: "5:15", label: "5:15 min/km" },
  { value: "5:20", label: "5:20 min/km" },
  { value: "5:25", label: "5:25 min/km" },
  { value: "5:30", label: "5:30 min/km" },
  { value: "5:35", label: "5:35 min/km" },
  { value: "5:40", label: "5:40 min/km" },
  { value: "5:45", label: "5:45 min/km" },
  { value: "5:50", label: "5:50 min/km" },
  { value: "5:55", label: "5:55 min/km" },
  { value: "6:00", label: "6:00 min/km" },
  { value: "6:05", label: "6:05 min/km" },
  { value: "6:10", label: "6:10 min/km" },
  { value: "6:15", label: "6:15 min/km" },
  { value: "6:20", label: "6:20 min/km" },
  { value: "6:25", label: "6:25 min/km" },
  { value: "6:30", label: "6:30 min/km" },
  { value: "6:35", label: "6:35 min/km" },
  { value: "6:40", label: "6:40 min/km" },
  { value: "6:45", label: "6:45 min/km" },
  { value: "6:50", label: "6:50 min/km" },
  { value: "6:55", label: "6:55 min/km" },
  { value: "7:00", label: "7:00 min/km" },
  { value: "7:05", label: "7:05 min/km" },
  { value: "7:10", label: "7:10 min/km" },
  { value: "7:15", label: "7:15 min/km" },
  { value: "7:20", label: "7:20 min/km" },
  { value: "7:25", label: "7:25 min/km" },
  { value: "7:30", label: "7:30 min/km" },
  { value: "7:35", label: "7:35 min/km" },
  { value: "7:40", label: "7:40 min/km" },
  { value: "7:45", label: "7:45 min/km" },
  { value: "7:50", label: "7:50 min/km" },
  { value: "7:55", label: "7:55 min/km" },
  { value: "8:00", label: "8:00 min/km" },
  { value: "8:05", label: "8:05 min/km" },
  { value: "8:10", label: "8:10 min/km" },
  { value: "8:15", label: "8:15 min/km" },
  { value: "8:20", label: "8:20 min/km" },
  { value: "8:25", label: "8:25 min/km" },
  { value: "8:30", label: "8:30 min/km" },
];

export function SignUpFormStep3({
  formData,
  runnerType,
  onBack,
  onSubmit,
  handleChange,
}: SignUpFormStep3Props) {
  const { errors, validateForm, clearErrors, setErrors } = useFormValidation();
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPacePicker, setShowPacePicker] = useState(false);
  const [showTargetPacePicker, setShowTargetPacePicker] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

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
        formData.preferred_time_of_day.length > 0 &&
        formData.objective.length > 0;

      const perfRequiredFields =
        formData.actual_pace.trim() !== "" &&
        formData.target_pace.trim() !== "" &&
        formData.weekly_mileage.trim() !== "" &&
        Array.isArray(formData.training_days) &&
        formData.training_days.length > 0 &&
        Array.isArray(formData.competition_goals) &&
        formData.competition_goals.length > 0;

      const isValid =
        commonRequiredFields &&
        (runnerType === "perf" ? perfRequiredFields : chillRequiredFields);

      console.log("isValid", isValid);
      console.log("errors", errors);
      setIsFormValid(isValid);
    };

    checkFormValidity();
  }, [formData, runnerType]);

  const handleSubmit = () => {
    clearErrors();
    setIsLoading(true);
    const validationResult = validateSignUpFormStep3(formData, runnerType);
    const isValid = validateForm(validationResult);

    if (!isValid) {
      resetErrorsAfterDelay(setErrors);
      setIsLoading(false);
      return;
    }

    onSubmit();
    setIsLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 bg-fond px-6">
        <ScrollView showsVerticalScrollIndicator={false} className="mb-32">
        {/* Header */}
        <View className="h-[15%] mt-8 flex-row items-center">
          <Pressable
            onPress={onBack}
            className="bg-white p-2.5 rounded-full active:opacity-80"
            style={{
              shadowColor: "#FF6B4A",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Ionicons name="arrow-back" size={20} color="#FF6B4A" />
          </Pressable>

          <View className="flex-1">
            <Text className="text-gray-900 text-2xl mr-8 font-nunito-bold text-center">
              {runnerType === "perf" ? (
                <>
                  Runner <Text className="text-primary">Performance</Text> 🏃‍♂️
                </>
              ) : (
                <>
                  Runner <Text className="text-primary">Chill</Text> 🎉
                </>
              )}
            </Text>
          </View>
        </View>

        {/* Form Content */}
        <View className="space-y-5 mt-4">
          <View className="space-y-4">
            {runnerType === "perf" && (
              <View className="space-y-4">
                <View>
                  <View className="flex-row items-center mb-3">
                    <View className="w-10 h-10 rounded-xl bg-tertiary items-center justify-center mr-3">
                      <Ionicons
                        name="speedometer-outline"
                        size={22}
                        color="#FF6B4A"
                      />
                    </View>
                    <Text className="text-gray-900 text-sm font-nunito-bold">
                      Allure habituelle en EF
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => setShowPacePicker(true)}
                    className={`bg-white flex-row items-center px-6 py-4 rounded-full border-2 ${
                      errors.actual_pace ? "border-red-500" : "border-gray-200"
                    }`}
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                      elevation: 1,
                    }}
                  >
                    <Text className="text-gray-900 font-nunito-medium flex-1">
                      {formData.actual_pace
                        ? `${formData.actual_pace} min/km`
                        : "Sélectionnez votre allure"}
                    </Text>
                    <Ionicons name="chevron-down" size={18} color="#FF6B4A" />
                  </Pressable>
                  {errors.actual_pace && (
                    <Text className="text-red-500 mt-2 ml-4 font-nunito-medium text-sm">
                      {errors.actual_pace}
                    </Text>
                  )}
                </View>

                <Modal
                  visible={showPacePicker}
                  transparent={true}
                  animationType="slide"
                >
                  <View className="flex-1 justify-end bg-black/50">
                    <View
                      className="bg-white w-full p-4 rounded-t-3xl"
                      style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: -4 },
                        shadowOpacity: 0.2,
                        shadowRadius: 8,
                        elevation: 10,
                      }}
                    >
                      <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-gray-900 text-lg font-nunito-bold">
                          Sélectionnez votre allure
                        </Text>
                        <Pressable onPress={() => setShowPacePicker(false)}>
                          <Ionicons name="close" size={24} color="#FF6B4A" />
                        </Pressable>
                      </View>
                      <ScrollView className="max-h-72">
                        {PACE_OPTIONS.map((option) => (
                          <Pressable
                            key={option.value}
                            className={`flex-row items-center px-4 py-3 border-b border-gray-100 ${
                              formData.actual_pace === option.value
                                ? "bg-tertiary"
                                : ""
                            }`}
                            onPress={() => {
                              handleChange("actual_pace", option.value);
                              setShowPacePicker(false);
                            }}
                          >
                            <Text
                              className={`font-nunito-medium text-base ${
                                formData.actual_pace === option.value
                                  ? "text-primary font-nunito-bold"
                                  : "text-gray-900"
                              }`}
                            >
                              {option.label}
                            </Text>
                          </Pressable>
                        ))}
                      </ScrollView>
                    </View>
                  </View>
                </Modal>

                <View>
                  <View className="flex-row items-center mb-3">
                    <View className="w-10 h-10 rounded-xl bg-tertiary items-center justify-center mr-3">
                      <Ionicons
                        name="trophy-outline"
                        size={22}
                        color="#FF6B4A"
                      />
                    </View>
                    <Text className="text-gray-900 text-sm font-nunito-bold">
                      Objectif d'allure
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => setShowTargetPacePicker(true)}
                    className={`bg-white flex-row items-center px-6 py-4 rounded-full border-2 ${
                      errors.target_pace ? "border-red-500" : "border-gray-200"
                    }`}
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                      elevation: 1,
                    }}
                  >
                    <Text className="text-gray-900 font-nunito-medium flex-1">
                      {formData.target_pace
                        ? `${formData.target_pace} min/km`
                        : "Sélectionnez votre objectif d'allure en EF"}
                    </Text>
                    <Ionicons name="chevron-down" size={18} color="#FF6B4A" />
                  </Pressable>
                  {errors.target_pace && (
                    <Text className="text-red-500 mt-2 ml-4 font-nunito-medium text-sm">
                      {errors.target_pace}
                    </Text>
                  )}
                </View>

                <Modal
                  visible={showTargetPacePicker}
                  transparent={true}
                  animationType="slide"
                >
                  <View className="flex-1 justify-end bg-black/50">
                    <View
                      className="bg-white w-full p-4 rounded-t-3xl"
                      style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: -4 },
                        shadowOpacity: 0.2,
                        shadowRadius: 8,
                        elevation: 10,
                      }}
                    >
                      <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-gray-900 text-lg font-nunito-bold">
                          Sélectionnez votre objectif d'allure
                        </Text>
                        <Pressable
                          onPress={() => setShowTargetPacePicker(false)}
                        >
                          <Ionicons name="close" size={24} color="#FF6B4A" />
                        </Pressable>
                      </View>
                      <ScrollView className="max-h-72">
                        {PACE_OPTIONS.map((option) => (
                          <Pressable
                            key={option.value}
                            className={`flex-row items-center px-4 py-3 border-b border-gray-100 ${
                              formData.target_pace === option.value
                                ? "bg-tertiary"
                                : ""
                            }`}
                            onPress={() => {
                              handleChange("target_pace", option.value);
                              setShowTargetPacePicker(false);
                            }}
                          >
                            <Text
                              className={`font-nunito-medium text-base ${
                                formData.target_pace === option.value
                                  ? "text-primary font-nunito-bold"
                                  : "text-gray-900"
                              }`}
                            >
                              {option.label}
                            </Text>
                          </Pressable>
                        ))}
                      </ScrollView>
                    </View>
                  </View>
                </Modal>

                <View>
                  <View className="flex-row items-center mb-3">
                    <View className="w-10 h-10 rounded-xl bg-tertiary items-center justify-center mr-3">
                      <Ionicons name="stats-chart" size={22} color="#FF6B4A" />
                    </View>
                    <Text className="text-gray-900 text-sm font-nunito-bold">
                      Kilométrage hebdomadaire
                    </Text>
                  </View>
                  <View
                    className={`flex-row items-center bg-white px-6 py-4 rounded-full border-2 ${
                      focusedInput === "weekly_mileage"
                        ? `border-primary ${
                            errors.weekly_mileage ? "border-red-500" : ""
                          }`
                        : errors.weekly_mileage
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                    style={{
                      shadowColor:
                        focusedInput === "weekly_mileage" &&
                        !errors.weekly_mileage
                          ? "#FF6B4A"
                          : "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity:
                        focusedInput === "weekly_mileage" &&
                        !errors.weekly_mileage
                          ? 0.15
                          : 0.05,
                      shadowRadius: 2,
                      elevation: 1,
                    }}
                  >
                    <TextInput
                      className="flex-1 text-gray-900 font-nunito-medium"
                      placeholder="km/semaine"
                      placeholderTextColor="#9CA3AF"
                      value={formData.weekly_mileage}
                      onChangeText={(text) =>
                        handleChange("weekly_mileage", text)
                      }
                      onFocus={() => setFocusedInput("weekly_mileage")}
                      onBlur={() => setFocusedInput(null)}
                      keyboardType="numeric"
                    />
                  </View>
                  {errors.weekly_mileage && (
                    <Text className="text-red-500 mt-2 ml-4 font-nunito-medium text-sm">
                      {errors.weekly_mileage}
                    </Text>
                  )}
                </View>

                <View className="space-y-4">
                  <View className="flex-row items-center mb-3">
                    <View className="w-10 h-10 rounded-xl bg-tertiary items-center justify-center mr-3">
                      <Ionicons
                        name="calendar-outline"
                        size={22}
                        color="#FF6B4A"
                      />
                    </View>
                    <Text className="text-gray-900 text-sm font-nunito-bold">
                      Jours d'entraînement
                    </Text>
                  </View>
                  <MultiSelect
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

                  <View className="flex-row items-center mb-3">
                    <View className="w-10 h-10 rounded-xl bg-tertiary items-center justify-center mr-3">
                      <Ionicons
                        name="trophy-outline"
                        size={22}
                        color="#FF6B4A"
                      />
                    </View>
                    <Text className="text-gray-900 text-sm font-nunito-bold">
                      Objectifs de compétition
                    </Text>
                  </View>
                  <MultiSelect
                    options={PERFORMANCE_OBJECTIVES.map((obj) => obj.label)}
                    selectedValues={
                      formData.competition_goals
                        ? Array.isArray(formData.competition_goals)
                          ? formData.competition_goals.map(
                              (goal) =>
                                PERFORMANCE_OBJECTIVES.find(
                                  (obj) => obj.value === goal
                                )?.label || ""
                            )
                          : []
                        : []
                    }
                    onChange={(values) => {
                      const selectedValues = values.filter((v) => v);
                      const selectedObjectives = selectedValues
                        .map((label) => {
                          const objective = PERFORMANCE_OBJECTIVES.find(
                            (obj) => obj.label === label
                          );
                          return objective?.value || "";
                        })
                        .filter((value) => value);

                      handleChange("competition_goals", selectedObjectives);
                    }}
                  />
                </View>
              </View>
            )}

            {/* Chill Fields */}
            {runnerType === "chill" && (
              <View className="space-y-4">
                <View>
                  <View className="flex-row items-center mb-3">
                    <View className="w-10 h-10 rounded-xl bg-tertiary items-center justify-center mr-3">
                      <Ionicons name="map-outline" size={22} color="#A78BFA" />
                    </View>
                    <Text className="text-gray-900 text-sm font-nunito-bold">
                      Distance habituelle / semaine (km)
                    </Text>
                  </View>
                  <View
                    className={`flex-row items-center bg-white px-6 py-4 rounded-full border-2 ${
                      focusedInput === "usual_distance"
                        ? `border-secondary ${
                            errors.usual_distance ? "border-red-500" : ""
                          }`
                        : errors.usual_distance
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                    style={{
                      shadowColor:
                        focusedInput === "usual_distance" &&
                        !errors.usual_distance
                          ? "#A78BFA"
                          : "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity:
                        focusedInput === "usual_distance" &&
                        !errors.usual_distance
                          ? 0.15
                          : 0.05,
                      shadowRadius: 2,
                      elevation: 1,
                    }}
                  >
                    <TextInput
                      className="flex-1 text-gray-900 font-nunito-medium"
                      placeholder="km"
                      placeholderTextColor="#9CA3AF"
                      value={formData.usual_distance}
                      onChangeText={(text) =>
                        handleChange("usual_distance", text)
                      }
                      onFocus={() => setFocusedInput("usual_distance")}
                      onBlur={() => setFocusedInput(null)}
                      keyboardType="numeric"
                    />
                  </View>
                  {errors.usual_distance && (
                    <Text className="text-red-500 mt-2 ml-4 font-nunito-medium text-sm">
                      {errors.usual_distance}
                    </Text>
                  )}
                </View>
                <View>
                  <View className="flex-row items-center mb-3">
                    <View className="w-10 h-10 rounded-xl bg-tertiary items-center justify-center mr-3">
                      <Ionicons name="flag-outline" size={22} color="#A78BFA" />
                    </View>
                    <Text className="text-gray-900 text-sm font-nunito-bold">
                      Objectif principal
                    </Text>
                  </View>
                  <MultiSelect
                    options={CHILL_OBJECTIVES_OPTIONS.map((obj) => obj.label)}
                    selectedValues={formData.objective}
                    onChange={(values) => handleChange("objective", values)}
                  />
                  {errors.objective && (
                    <Text className="text-red-500 mt-2 ml-4 font-nunito-medium text-sm">
                      {errors.objective}
                    </Text>
                  )}
                </View>

                <View>
                  <View className="flex-row items-center mb-3">
                    <View className="w-10 h-10 rounded-xl bg-tertiary items-center justify-center mr-3">
                      <Ionicons
                        name="people-outline"
                        size={22}
                        color="#A78BFA"
                      />
                    </View>
                    <Text className="text-gray-900 text-sm font-nunito-bold">
                      Préférences sociales
                    </Text>
                  </View>
                  <MultiSelect
                    options={SOCIAL_PREFERENCES.map((pref) => pref.label)}
                    selectedValues={formData.social_preferences}
                    onChange={(values) =>
                      handleChange("social_preferences", values)
                    }
                  />
                  {errors.social_preferences && (
                    <Text className="text-red-500 mt-2 ml-4 font-nunito-medium text-sm">
                      {errors.social_preferences}
                    </Text>
                  )}
                </View>

                <View>
                  <View className="flex-row items-center mb-3">
                    <View className="w-10 h-10 rounded-xl bg-tertiary items-center justify-center mr-3">
                      <Ionicons name="cafe-outline" size={22} color="#A78BFA" />
                    </View>
                    <Text className="text-gray-900 text-sm font-nunito-bold">
                      Activités post-course
                    </Text>
                  </View>
                  <MultiSelect
                    options={POST_RUN_ACTIVITIES.map(
                      (activity) => activity.label
                    )}
                    selectedValues={formData.post_run_activities}
                    onChange={(values) =>
                      handleChange("post_run_activities", values)
                    }
                  />
                  {errors.post_run_activities && (
                    <Text className="text-red-500 mt-2 ml-4 font-nunito-medium text-sm">
                      {errors.post_run_activities}
                    </Text>
                  )}
                </View>

                <View>
                  <View className="flex-row items-center mb-3">
                    <View className="w-10 h-10 rounded-xl bg-tertiary items-center justify-center mr-3">
                      <Ionicons
                        name="repeat-outline"
                        size={22}
                        color="#A78BFA"
                      />
                    </View>
                    <Text className="text-gray-900 text-sm font-nunito-bold">
                      Fréquence de course
                    </Text>
                  </View>
                  <MultiSelect
                    options={RUNNING_FREQUENCY.map((freq) => freq.label)}
                    selectedValues={formData.running_frequency}
                    onChange={(values) =>
                      handleChange("running_frequency", values)
                    }
                  />
                  {errors.running_frequency && (
                    <Text className="text-red-500 mt-2 ml-4 font-nunito-medium text-sm">
                      {errors.running_frequency}
                    </Text>
                  )}
                </View>

                <View>
                  <View className="flex-row items-center mb-3">
                    <View className="w-10 h-10 rounded-xl bg-tertiary items-center justify-center mr-3">
                      <Ionicons name="time-outline" size={22} color="#A78BFA" />
                    </View>
                    <Text className="text-gray-900 text-sm font-nunito-bold">
                      Préférences de course
                    </Text>
                  </View>
                  <MultiSelect
                    options={TIME_PREFERENCES.map((time) => time.label)}
                    selectedValues={formData.preferred_time_of_day}
                    onChange={(values) =>
                      handleChange("preferred_time_of_day", values)
                    }
                  />
                  {errors.preferred_time_of_day && (
                    <Text className="text-red-500 mt-2 ml-4 font-nunito-medium text-sm">
                      {errors.preferred_time_of_day}
                    </Text>
                  )}
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Padding bottom for scroll */}
        <View className="h-32" />
      </ScrollView>

      {/* Fixed Button at Bottom */}
      <View className="absolute bottom-0 left-0 right-0 pb-8 pt-4 bg-fond border-t border-gray-200">
        <ActionButton
          onPress={handleSubmit}
          text={"Let's go ! 🎯"}
          loading={isLoading}
        />
      </View>
      </View>
    </KeyboardAvoidingView>
  );
}
