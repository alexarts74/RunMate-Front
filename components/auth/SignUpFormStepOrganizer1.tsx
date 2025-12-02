import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ActionButton } from "@/components/ui/ActionButton";

type OrganizationType = "association" | "club_sportif" | "collectif" | "autre";

interface SignUpFormStepOrganizer1Props {
  formData: {
    organization_name: string;
    organization_type: string;
    description: string;
  };
  onNext: () => void;
  handleChange: (name: string, value: string) => void;
  onBack: () => void;
}

const organizationTypes: { value: OrganizationType; label: string; icon: string }[] = [
  { value: "association", label: "Association", icon: "people" },
  { value: "club_sportif", label: "Club sportif", icon: "trophy" },
  { value: "collectif", label: "Collectif", icon: "layers" },
  { value: "autre", label: "Autre", icon: "ellipse" },
];

export function SignUpFormStepOrganizer1({
  formData,
  onNext,
  handleChange,
  onBack,
}: SignUpFormStepOrganizer1Props) {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.organization_name.trim()) {
      newErrors.organization_name = "Le nom de l'organisation est requis";
    }

    if (!formData.organization_type) {
      newErrors.organization_type = "Veuillez sélectionner un type d'organisation";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-fond">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6 py-6">
            {/* Header avec bouton retour */}
            <View className="mb-6">
              <View className="flex-row items-center mb-4">
                <Pressable
                  onPress={onBack}
                  className="bg-white p-2.5 rounded-full active:opacity-80 mr-4"
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
                  <Text className="text-gray-900 text-2xl font-nunito-extrabold">
                    Informations de votre organisation
                  </Text>
                </View>
              </View>
              <Text className="text-gray-600 text-base font-nunito-medium">
                Remplissez les informations de base de votre organisation
              </Text>
            </View>

            {/* Nom de l'organisation */}
            <View className="mb-6">
              <Text className="text-gray-900 text-base font-nunito-bold mb-2">
                Nom de l'organisation *
              </Text>
              <View
                className={`bg-white rounded-2xl px-4 py-4 border-2 ${
                  focusedInput === "organization_name"
                    ? "border-primary"
                    : errors.organization_name
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <TextInput
                  value={formData.organization_name}
                  onChangeText={(value) => handleChange("organization_name", value)}
                  onFocus={() => setFocusedInput("organization_name")}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="Ex: Club de Running Paris"
                  placeholderTextColor="#9CA3AF"
                  className="text-gray-900 text-base font-nunito-medium"
                  style={{ color: "#111827" }}
                  selectionColor="#FF6B4A"
                  editable={true}
                  autoCorrect={false}
                />
              </View>
              {errors.organization_name && (
                <Text className="text-red-500 text-sm font-nunito-medium mt-1">
                  {errors.organization_name}
                </Text>
              )}
            </View>

            {/* Type d'organisation */}
            <View className="mb-6">
              <Text className="text-gray-900 text-base font-nunito-bold mb-3">
                Type d'organisation *
              </Text>
              <View className="space-y-3">
                {organizationTypes.map((type) => (
                  <Pressable
                    key={type.value}
                    onPress={() => handleChange("organization_type", type.value)}
                    className={`bg-white rounded-2xl px-4 py-4 border-2 ${
                      formData.organization_type === type.value
                        ? "border-primary bg-primary/5"
                        : errors.organization_type
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                    style={{
                      shadowColor: formData.organization_type === type.value ? "#FF6B4A" : "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: formData.organization_type === type.value ? 0.15 : 0.05,
                      shadowRadius: 4,
                      elevation: 2,
                    }}
                  >
                    <View className="flex-row items-center">
                      <View
                        className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${
                          formData.organization_type === type.value
                            ? "bg-primary"
                            : "bg-gray-100"
                        }`}
                      >
                        <Ionicons
                          name={type.icon as any}
                          size={20}
                          color={formData.organization_type === type.value ? "#FFFFFF" : "#6B7280"}
                        />
                      </View>
                      <Text
                        className={`text-base font-nunito-bold flex-1 ${
                          formData.organization_type === type.value
                            ? "text-primary"
                            : "text-gray-900"
                        }`}
                      >
                        {type.label}
                      </Text>
                      {formData.organization_type === type.value && (
                        <Ionicons name="checkmark-circle" size={24} color="#FF6B4A" />
                      )}
                    </View>
                  </Pressable>
                ))}
              </View>
              {errors.organization_type && (
                <Text className="text-red-500 text-sm font-nunito-medium mt-1">
                  {errors.organization_type}
                </Text>
              )}
            </View>

            {/* Description */}
            <View className="mb-6">
              <Text className="text-gray-900 text-base font-nunito-bold mb-2">
                Description (optionnel)
              </Text>
              <View
                className={`bg-white rounded-2xl px-4 py-4 border-2 ${
                  focusedInput === "description"
                    ? "border-primary"
                    : "border-gray-200"
                }`}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                  minHeight: 120,
                }}
              >
                <TextInput
                  value={formData.description}
                  onChangeText={(value) => handleChange("description", value)}
                  onFocus={() => setFocusedInput("description")}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="Décrivez votre organisation, ses valeurs, ses activités..."
                  placeholderTextColor="#9CA3AF"
                  className="text-gray-900 text-base font-nunito-medium"
                  style={{ color: "#111827" }}
                  selectionColor="#FF6B4A"
                  editable={true}
                  autoCorrect={false}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="px-6 py-4 bg-white border-t border-gray-200">
          <ActionButton
            onPress={handleSubmit}
            text="Suivant"
            className="w-full"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

