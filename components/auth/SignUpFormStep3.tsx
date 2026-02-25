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
import { MultiSelect } from "../ui/MultiSelect";
import { useThemeColors } from "@/constants/theme";
import WarmBackground from "@/components/ui/WarmBackground";
import GlassInput from "@/components/ui/GlassInput";
import GlassButton from "@/components/ui/GlassButton";

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
  { value: "course_reguliere", label: "Course r\u00e9guli\u00e8re" },
  { value: "perdre_du_poids", label: "Perdre du poids" },
  { value: "ameliorer_endurance", label: "Am\u00e9liorer l'endurance" },
  { value: "social_running", label: "Social running" },
  { value: "decouverte", label: "D\u00e9couverte" },
  { value: "bien_etre", label: "Bien-\u00eatre" },
];

const TIME_PREFERENCES = [
  { value: "matin_tot", label: "Tr\u00e8s t\u00f4t (5h-8h)" },
  { value: "matin", label: "Matin (8h-11h)" },
  { value: "midi", label: "Midi (11h-14h)" },
  { value: "apres_midi", label: "Apr\u00e8s-midi (14h-18h)" },
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
  { value: "cafe", label: "Caf\u00e9" },
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
  const { colors, shadows } = useThemeColors();

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

  const renderSectionHeader = (iconName: string, title: string) => (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: colors.primary.subtle,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        <Ionicons name={iconName as any} size={22} color={colors.primary.DEFAULT} />
      </View>
      <Text style={{ color: colors.text.primary, fontSize: 14, fontFamily: "Nunito-Bold" }}>
        {title}
      </Text>
    </View>
  );

  const renderPaceSelector = (
    label: string,
    value: string,
    error: string | undefined,
    onPress: () => void
  ) => (
    <Pressable
      onPress={onPress}
      style={[
        {
          backgroundColor: colors.glass.light,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 24,
          paddingVertical: 14,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: error ? colors.error : colors.glass.border,
          minHeight: 50,
        },
        shadows.sm,
      ]}
    >
      <Text style={{ color: value ? colors.text.primary : colors.text.tertiary, fontFamily: "Nunito-Medium", flex: 1, fontSize: 16 }}>
        {value ? `${value} min/km` : label}
      </Text>
      <Ionicons name="chevron-down" size={18} color={colors.primary.DEFAULT} />
    </Pressable>
  );

  const renderPacePickerModal = (
    visible: boolean,
    onClose: () => void,
    selectedValue: string,
    onSelect: (value: string) => void,
    title: string
  ) => (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View
          style={[
            {
              backgroundColor: colors.elevated,
              width: "100%",
              padding: 16,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
            },
            shadows.lg,
          ]}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Text style={{ color: colors.text.primary, fontSize: 18, fontFamily: "Nunito-Bold" }}>
              {title}
            </Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.primary.DEFAULT} />
            </Pressable>
          </View>
          <ScrollView style={{ maxHeight: 288 }}>
            {PACE_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.glass.border,
                  backgroundColor: selectedValue === option.value ? colors.primary.subtle : "transparent",
                }}
                onPress={() => {
                  onSelect(option.value);
                  onClose();
                }}
              >
                <Text
                  style={{
                    fontFamily: selectedValue === option.value ? "Nunito-Bold" : "Nunito-Medium",
                    fontSize: 16,
                    color: selectedValue === option.value ? colors.primary.DEFAULT : colors.text.primary,
                  }}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <WarmBackground>
        <View style={{ flex: 1, paddingHorizontal: 24 }}>
          <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 128 }}>
            {/* Header */}
            <View style={{ height: "15%", marginTop: 32, flexDirection: "row", alignItems: "center" }}>
              <Pressable
                onPress={onBack}
                style={[
                  {
                    backgroundColor: colors.glass.light,
                    padding: 10,
                    borderRadius: 9999,
                  },
                  shadows.sm,
                ]}
              >
                <Ionicons name="arrow-back" size={20} color={colors.primary.DEFAULT} />
              </Pressable>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.text.primary,
                    fontSize: 24,
                    marginRight: 32,
                    fontFamily: "Nunito-Bold",
                    textAlign: "center",
                  }}
                >
                  {runnerType === "perf" ? (
                    <>
                      Runner <Text style={{ color: colors.primary.DEFAULT }}>Performance</Text> {"\ud83c\udfc3\u200d\u2642\ufe0f"}
                    </>
                  ) : (
                    <>
                      Runner <Text style={{ color: colors.primary.DEFAULT }}>Chill</Text> {"\ud83c\udf89"}
                    </>
                  )}
                </Text>
              </View>
            </View>

            {/* Form Content */}
            <View style={{ gap: 20, marginTop: 16 }}>
              <View style={{ gap: 16 }}>
                {runnerType === "perf" && (
                  <View style={{ gap: 16 }}>
                    <View>
                      {renderSectionHeader("speedometer-outline", "Allure habituelle en EF")}
                      {renderPaceSelector(
                        "S\u00e9lectionnez votre allure",
                        formData.actual_pace,
                        errors.actual_pace,
                        () => setShowPacePicker(true)
                      )}
                      {errors.actual_pace && (
                        <Text style={{ color: colors.error, marginTop: 8, marginLeft: 16, fontFamily: "Nunito-Medium", fontSize: 14 }}>
                          {errors.actual_pace}
                        </Text>
                      )}
                    </View>

                    {renderPacePickerModal(
                      showPacePicker,
                      () => setShowPacePicker(false),
                      formData.actual_pace,
                      (value) => handleChange("actual_pace", value),
                      "S\u00e9lectionnez votre allure"
                    )}

                    <View>
                      {renderSectionHeader("trophy-outline", "Objectif d'allure")}
                      {renderPaceSelector(
                        "S\u00e9lectionnez votre objectif d'allure en EF",
                        formData.target_pace,
                        errors.target_pace,
                        () => setShowTargetPacePicker(true)
                      )}
                      {errors.target_pace && (
                        <Text style={{ color: colors.error, marginTop: 8, marginLeft: 16, fontFamily: "Nunito-Medium", fontSize: 14 }}>
                          {errors.target_pace}
                        </Text>
                      )}
                    </View>

                    {renderPacePickerModal(
                      showTargetPacePicker,
                      () => setShowTargetPacePicker(false),
                      formData.target_pace,
                      (value) => handleChange("target_pace", value),
                      "S\u00e9lectionnez votre objectif d'allure"
                    )}

                    <View>
                      {renderSectionHeader("stats-chart", "Kilom\u00e9trage hebdomadaire")}
                      <GlassInput
                        placeholder="km/semaine"
                        value={formData.weekly_mileage}
                        onChangeText={(text) => handleChange("weekly_mileage", text)}
                        keyboardType="numeric"
                        error={errors.weekly_mileage}
                      />
                    </View>

                    <View style={{ gap: 16 }}>
                      {renderSectionHeader("calendar-outline", "Jours d'entra\u00eenement")}
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

                      {renderSectionHeader("trophy-outline", "Objectifs de comp\u00e9tition")}
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
                  <View style={{ gap: 16 }}>
                    <View>
                      {renderSectionHeader("map-outline", "Distance habituelle / semaine (km)")}
                      <GlassInput
                        placeholder="km"
                        value={formData.usual_distance}
                        onChangeText={(text) => handleChange("usual_distance", text)}
                        keyboardType="numeric"
                        error={errors.usual_distance}
                      />
                    </View>

                    <View>
                      {renderSectionHeader("flag-outline", "Objectif principal")}
                      <MultiSelect
                        options={CHILL_OBJECTIVES_OPTIONS.map((obj) => obj.label)}
                        selectedValues={formData.objective}
                        onChange={(values) => handleChange("objective", values)}
                      />
                      {errors.objective && (
                        <Text style={{ color: colors.error, marginTop: 8, marginLeft: 16, fontFamily: "Nunito-Medium", fontSize: 14 }}>
                          {errors.objective}
                        </Text>
                      )}
                    </View>

                    <View>
                      {renderSectionHeader("people-outline", "Pr\u00e9f\u00e9rences sociales")}
                      <MultiSelect
                        options={SOCIAL_PREFERENCES.map((pref) => pref.label)}
                        selectedValues={formData.social_preferences}
                        onChange={(values) =>
                          handleChange("social_preferences", values)
                        }
                      />
                      {errors.social_preferences && (
                        <Text style={{ color: colors.error, marginTop: 8, marginLeft: 16, fontFamily: "Nunito-Medium", fontSize: 14 }}>
                          {errors.social_preferences}
                        </Text>
                      )}
                    </View>

                    <View>
                      {renderSectionHeader("cafe-outline", "Activit\u00e9s post-course")}
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
                        <Text style={{ color: colors.error, marginTop: 8, marginLeft: 16, fontFamily: "Nunito-Medium", fontSize: 14 }}>
                          {errors.post_run_activities}
                        </Text>
                      )}
                    </View>

                    <View>
                      {renderSectionHeader("repeat-outline", "Fr\u00e9quence de course")}
                      <MultiSelect
                        options={RUNNING_FREQUENCY.map((freq) => freq.label)}
                        selectedValues={formData.running_frequency}
                        onChange={(values) =>
                          handleChange("running_frequency", values)
                        }
                      />
                      {errors.running_frequency && (
                        <Text style={{ color: colors.error, marginTop: 8, marginLeft: 16, fontFamily: "Nunito-Medium", fontSize: 14 }}>
                          {errors.running_frequency}
                        </Text>
                      )}
                    </View>

                    <View>
                      {renderSectionHeader("time-outline", "Pr\u00e9f\u00e9rences de course")}
                      <MultiSelect
                        options={TIME_PREFERENCES.map((time) => time.label)}
                        selectedValues={formData.preferred_time_of_day}
                        onChange={(values) =>
                          handleChange("preferred_time_of_day", values)
                        }
                      />
                      {errors.preferred_time_of_day && (
                        <Text style={{ color: colors.error, marginTop: 8, marginLeft: 16, fontFamily: "Nunito-Medium", fontSize: 14 }}>
                          {errors.preferred_time_of_day}
                        </Text>
                      )}
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Padding bottom for scroll */}
            <View style={{ height: 128 }} />
          </ScrollView>

          {/* Fixed Button at Bottom */}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              paddingBottom: 32,
              paddingTop: 16,
              paddingHorizontal: 0,
            }}
          >
            <GlassButton
              title="Let's go ! \ud83c\udfaf"
              onPress={handleSubmit}
              variant="primary"
              loading={isLoading}
            />
          </View>
        </View>
      </WarmBackground>
    </KeyboardAvoidingView>
  );
}
