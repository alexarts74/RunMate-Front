import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from "react-native";
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
    competition_goals: string[];
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

const PACE_OPTIONS = [
  { value: "4:00", label: "4:00 min/km" },
  { value: "4:30", label: "4:30 min/km" },
  { value: "5:00", label: "5:00 min/km" },
  { value: "5:30", label: "5:30 min/km" },
  { value: "6:00", label: "6:00 min/km" },
  { value: "6:30", label: "6:30 min/km" },
  { value: "7:00", label: "7:00 min/km" },
  { value: "7:30", label: "7:30 min/km" },
  { value: "8:00", label: "8:00 min/km" },
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
  const [showPacePicker, setShowPacePicker] = useState(false);
  const [showTargetPacePicker, setShowTargetPacePicker] = useState(false);

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
        formData.training_days.length > 0 &&
        Array.isArray(formData.competition_goals) &&
        formData.competition_goals.length > 0;

      const isValid =
        commonRequiredFields &&
        (runnerType === "perf" ? perfRequiredFields : chillRequiredFields);

      console.log("🎯 Validation détaillée:", {
        commonRequiredFields,
        perfRequiredFields: runnerType === "perf" ? perfRequiredFields : "N/A",
        chillRequiredFields:
          runnerType === "chill" ? chillRequiredFields : "N/A",
        isValid,
      });

      setIsFormValid(isValid);
    };

    checkFormValidity();
  }, [formData, runnerType]);

  const handleSubmit = () => {
    clearErrors();
    console.log("🎯 formData:", formData);
    setIsLoading(true);
    console.log("🎯 runnerType:", runnerType);
    console.log("🎯 isFormValid:", isFormValid);

    const validationResult = validateSignUpFormStep3(formData, runnerType);
    console.log("🎯 validationResult:", validationResult);

    if (validateForm(validationResult)) {
      onSubmit();
    }
    setIsLoading(false);
  };

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
            <Text className="text-white text-2xl mr-8 font-kanit-bold text-center">
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
        <View className="space-y-4 px-4">
          <View className="space-y-4">
            {runnerType === "perf" && (
              <View className="space-y-4">
                <View>
                  <View className="flex-row items-center mb-4">
                    <View className="w-8 items-center">
                      <Ionicons
                        name="speedometer-outline"
                        size={24}
                        color="#8101f7"
                      />
                    </View>
                    <Text className="text-white text-sm font-kanit-semibold ml-4">
                      Allure habituelle en EF
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => setShowPacePicker(true)}
                    className="bg-[#1e2429] flex-row items-center px-6 py-4 rounded-full border border-gray-700"
                  >
                    <Text className="text-white font-kanit">
                      {formData.actual_pace
                        ? `${formData.actual_pace} min/km`
                        : "Sélectionnez votre allure"}
                    </Text>
                  </Pressable>
                  {errors.actual_pace && (
                    <Text className="text-red-500 mt-2 ml-4 font-kanit">
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
                    <View className="bg-[#1e2429] w-full p-4">
                      <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-white text-lg font-kanit-semibold">
                          Sélectionnez votre allure
                        </Text>
                        <Pressable onPress={() => setShowPacePicker(false)}>
                          <Ionicons name="close" size={24} color="#8101f7" />
                        </Pressable>
                      </View>
                      <ScrollView className="max-h-72">
                        {PACE_OPTIONS.map((option) => (
                          <Pressable
                            key={option.value}
                            className={`flex-row items-center px-4 py-3 border-b border-gray-700 ${
                              formData.actual_pace === option.value
                                ? "bg-purple/10"
                                : ""
                            }`}
                            onPress={() => {
                              handleChange("actual_pace", option.value);
                              setShowPacePicker(false);
                            }}
                          >
                            <Text
                              className={`text-white font-kanit text-lg ${
                                formData.actual_pace === option.value
                                  ? "text-purple"
                                  : ""
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

                {/* Distance habituelle / semaine (km) */}

                <View>
                  <View className="flex-row items-center mb-2">
                    <View className="w-8 items-center">
                      <Ionicons
                        name="trophy-outline"
                        size={22}
                        color="#8101f7"
                      />
                    </View>
                    <Text className="text-white text-sm font-kanit-semibold ml-4">
                      Objectif d'allure
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => setShowTargetPacePicker(true)}
                    className="bg-[#1e2429] flex-row items-center px-6 py-4 rounded-full border border-gray-700"
                  >
                    <Text className="text-white font-kanit">
                      {formData.target_pace
                        ? `${formData.target_pace} min/km`
                        : "Sélectionnez votre objectif d'allure"}
                    </Text>
                  </Pressable>
                  {errors.target_pace && (
                    <Text className="text-red-500 mt-2 ml-4 font-kanit">
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
                    <View className="bg-[#1e2429] w-full p-4">
                      <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-white text-lg font-kanit-semibold">
                          Sélectionnez votre objectif d'allure
                        </Text>
                        <Pressable
                          onPress={() => setShowTargetPacePicker(false)}
                        >
                          <Ionicons name="close" size={24} color="#8101f7" />
                        </Pressable>
                      </View>
                      <ScrollView className="max-h-72">
                        {PACE_OPTIONS.map((option) => (
                          <Pressable
                            key={option.value}
                            className={`flex-row items-center px-4 py-3 border-b border-gray-700 ${
                              formData.target_pace === option.value
                                ? "bg-purple/10"
                                : ""
                            }`}
                            onPress={() => {
                              handleChange("target_pace", option.value);
                              setShowTargetPacePicker(false);
                            }}
                          >
                            <Text
                              className={`text-white font-kanit text-lg ${
                                formData.target_pace === option.value
                                  ? "text-purple"
                                  : ""
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
                  <View className="flex-row items-center mb-2">
                    <View className="w-8 items-center">
                      <Ionicons name="stats-chart" size={22} color="#8101f7" />
                    </View>
                    <Text className="text-white text-sm font-kanit-semibold ml-4">
                      Kilométrage hebdomadaire
                    </Text>
                  </View>
                  <TextInput
                    className="bg-[#1e2429] text-white px-6 py-4 rounded-full border border-gray-700 font-kanit"
                    placeholder="km/semaine"
                    placeholderTextColor="#9CA3AF"
                    value={formData.weekly_mileage}
                    onChangeText={(text) =>
                      handleChange("weekly_mileage", text)
                    }
                  />
                </View>

                <View className="space-y-4">
                  <View className="flex-row items-center mb-2">
                    <View className="w-8 items-center">
                      <Ionicons
                        name="calendar-outline"
                        size={22}
                        color="#8101f7"
                      />
                    </View>
                    <Text className="text-white text-sm font-kanit-semibold ml-4">
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

                  <View className="flex-row items-center mb-2">
                    <View className="w-8 items-center">
                      <Ionicons
                        name="trophy-outline"
                        size={22}
                        color="#8101f7"
                      />
                    </View>
                    <Text className="text-white text-sm font-kanit-semibold ml-4">
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
                      console.log("Values sélectionnées brutes:", values);
                      const selectedValues = values.filter((v) => v);
                      console.log(
                        "Valeurs sélectionnées filtrées:",
                        selectedValues
                      );

                      const selectedObjectives = selectedValues
                        .map((label) => {
                          const objective = PERFORMANCE_OBJECTIVES.find(
                            (obj) => obj.label === label
                          );
                          return objective?.value || "";
                        })
                        .filter((value) => value);

                      console.log("Objectifs trouvés:", selectedObjectives);
                      handleChange("competition_goals", selectedObjectives);
                      console.log(
                        "Valeurs finales envoyées:",
                        selectedObjectives
                      );
                    }}
                  />
                </View>
              </View>
            )}

            {/* Chill Fields */}
            {runnerType === "chill" && (
              <View className="space-y-4">
                <View className="flex-row items-center mb-2">
                  <View className="w-8 items-center">
                    <Ionicons name="people-outline" size={22} color="#8101f7" />
                  </View>
                  <Text className="text-white text-sm font-kanit-semibold ml-4">
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

                <View className="flex-row items-center mb-2">
                  <View className="w-8 items-center">
                    <Ionicons name="people-outline" size={22} color="#8101f7" />
                  </View>
                  <Text className="text-white text-sm font-kanit-semibold ml-4">
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

                <View className="flex-row items-center mb-2">
                  <View className="w-8 items-center">
                    <Ionicons name="people-outline" size={22} color="#8101f7" />
                  </View>
                  <Text className="text-white text-sm font-kanit-semibold ml-4">
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

                <View className="flex-row items-center mb-2">
                  <View className="w-8 items-center">
                    <Ionicons name="people-outline" size={22} color="#8101f7" />
                  </View>
                  <Text className="text-white text-sm font-kanit-semibold ml-4">
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

                <View>
                  <View className="flex-row items-center mb-2">
                    <View className="w-8 items-center">
                      <Ionicons name="map-outline" size={22} color="#8101f7" />
                    </View>
                    <Text className="text-white text-sm font-kanit-semibold ml-4">
                      Distance habituelle / semaine (km)
                    </Text>
                  </View>
                  <TextInput
                    className="bg-[#1e2429] text-white px-6 py-4 rounded-full border border-gray-700 font-kanit"
                    placeholder="km"
                    placeholderTextColor="#9CA3AF"
                    value={formData.usual_distance}
                    onChangeText={(text) =>
                      handleChange("usual_distance", text)
                    }
                  />
                  {errors.usual_distance && (
                    <Text className="text-red-500 mt-2 ml-4 font-kanit">
                      {errors.usual_distance}
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
      <View className="absolute bottom-0 left-0 right-0 pb-8 pt-4 bg-background border-t border-gray-700">
        <ActionButton
          onPress={handleSubmit}
          text={"Let's go ! 🎯"}
          loading={isLoading}
        />
      </View>
    </View>
  );
}
