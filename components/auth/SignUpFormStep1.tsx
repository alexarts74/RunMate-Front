import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, Image, KeyboardAvoidingView, Platform } from "react-native";
import { useFormValidation } from "@/hooks/auth/useFormValidation";
import {
  validateSignUpFormStep1,
  resetErrorsAfterDelay,
} from "@/constants/formValidation";
import { Ionicons } from "@expo/vector-icons";
import { ActionButton } from "@/components/ui/ActionButton";

const ACCENT = "#F97316";

interface SignUpFormStep1Props {
  formData: {
    email: string;
    password: string;
    password_confirmation: string;
    profile_image: string;
  };
  onNext: () => void;
  handleChange: (name: string, value: string) => void;
  onBack: () => void;
}

export function SignUpFormStep1({
  formData,
  onNext,
  handleChange,
  onBack,
}: SignUpFormStep1Props) {
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const { errors, validateForm, clearErrors, setErrors } = useFormValidation();

  // Log des erreurs quand elles changent
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("❌ Erreurs de validation Step 1 détectées:");
      console.log("- Email:", formData.email || "vide");
      console.log("- Password:", formData.password || "vide");
      console.log("- Password confirmation:", formData.password_confirmation || "vide");
      console.log("Erreurs complètes:", errors);
    }
  }, [errors, formData]);

  const handleSubmit = () => {
    clearErrors();
    const isValid = validateForm(validateSignUpFormStep1(formData));

    if (!isValid) {
      console.log("⚠️ Formulaire invalide - en attente des erreurs détaillées...");
      resetErrorsAfterDelay(setErrors);
      return;
    }

    console.log("✅ Validation Step 1 réussie - passage à l'étape suivante");
    onNext();
  };

  useEffect(() => {
    const checkFormValidity = () => {
      setIsLoading(true);
      validateSignUpFormStep1(formData);
      const hasAllRequiredFields =
        formData.email.trim() !== "" &&
        formData.password.trim() !== "" &&
        formData.password_confirmation.trim() !== "";

      setIsFormValid(hasAllRequiredFields);
    };

    checkFormValidity();
    setIsLoading(false);
  }, [formData]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 bg-fond px-6">
        {/* Header Section */}
        <View className="h-[15%] mt-8 flex-row items-center">
          <Pressable
            onPress={onBack}
            className="bg-white p-2.5 rounded-full active:opacity-80"
            style={{
              shadowColor: ACCENT,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Ionicons name="arrow-back" size={20} color={ACCENT} />
          </Pressable>

          <View className="flex-1">
            <Text className="text-gray-900 text-2xl mr-8 font-nunito-bold text-center">
              Promis on te{"\n"}
              <Text className="text-primary">spammera pas !</Text>
              {" 🙃"}
            </Text>
          </View>
        </View>

      {/* Inputs Section */}
      <View className="flex-1 justify-center -mt-24">
        <View className="w-full space-y-5">
          <View>
            <Text className="text-gray-900 text-sm font-nunito-bold mb-2">
              Email*
            </Text>
            <View
              className={`flex-row items-center bg-white px-6 py-4 rounded-full border-2 ${
                focusedInput === "email"
                  ? `border-primary ${errors.email ? "border-red-500" : ""}`
                  : errors.email
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
              style={{
                shadowColor: focusedInput === "email" && !errors.email ? ACCENT : "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: focusedInput === "email" && !errors.email ? 0.15 : 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <Ionicons name="mail-outline" size={20} color={ACCENT} style={{ marginRight: 12 }} />
              <TextInput
                className="flex-1 text-gray-900 font-nunito-medium"
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
                onFocus={() => setFocusedInput("email")}
                onBlur={() => setFocusedInput(null)}
                keyboardType="email-address"
                autoCapitalize="none"
                selectionColor={ACCENT}
                editable={true}
                style={{ color: "#111827" }}
              />
            </View>
            {errors.email && (
              <Text className="text-red-500 mt-1.5 ml-4 font-nunito-medium text-sm">
                {errors.email}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-gray-900 text-sm font-nunito-bold mb-2">
              Mot de passe*
            </Text>
            <View
              className={`flex-row items-center bg-white px-6 py-4 rounded-full border-2 ${
                focusedInput === "password"
                  ? `border-primary ${errors.password ? "border-red-500" : ""}`
                  : errors.password
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
              style={{
                shadowColor: focusedInput === "password" && !errors.password ? ACCENT : "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: focusedInput === "password" && !errors.password ? 0.15 : 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <Ionicons name="lock-closed-outline" size={20} color={ACCENT} style={{ marginRight: 12 }} />
              <TextInput
                className="flex-1 text-gray-900 font-nunito-medium"
                placeholder="Mot de passe"
                placeholderTextColor="#9CA3AF"
                value={formData.password}
                onChangeText={(text) => handleChange("password", text)}
                onFocus={() => setFocusedInput("password")}
                onBlur={() => setFocusedInput(null)}
                secureTextEntry
                selectionColor={ACCENT}
                editable={true}
                style={{ color: "#111827" }}
              />
            </View>
            {errors.password && (
              <Text className="text-red-500 mt-1.5 ml-4 font-nunito-medium text-sm">
                {errors.password}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-gray-900 text-sm font-nunito-bold mb-2">
              Confirmer le mot de passe*
            </Text>
            <View
              className={`flex-row items-center bg-white px-6 py-4 rounded-full border-2 ${
                focusedInput === "password_confirmation"
                  ? `border-primary ${
                      errors.password_confirmation ? "border-red-500" : ""
                    }`
                  : errors.password_confirmation
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
              style={{
                shadowColor: focusedInput === "password_confirmation" && !errors.password_confirmation ? ACCENT : "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: focusedInput === "password_confirmation" && !errors.password_confirmation ? 0.15 : 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={ACCENT}
                style={{ marginRight: 12 }}
              />
              <TextInput
                className="flex-1 text-gray-900 font-nunito-medium"
                placeholder="Confirmer le mot de passe"
                placeholderTextColor="#9CA3AF"
                value={formData.password_confirmation}
                onChangeText={(text) =>
                  handleChange("password_confirmation", text)
                }
                onFocus={() => setFocusedInput("password_confirmation")}
                onBlur={() => setFocusedInput(null)}
                secureTextEntry
                selectionColor={ACCENT}
                editable={true}
                style={{ color: "#111827" }}
              />
            </View>
            {errors.password_confirmation && (
              <Text className="text-red-500 mt-1.5 ml-4 font-nunito-medium text-sm">
                {errors.password_confirmation}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Button Section - Fixed at bottom */}
      <View className="absolute bottom-8 left-0 right-0 px-6">
        <ActionButton
          onPress={handleSubmit}
          text="Continuer"
          loading={isLoading}
        />
      </View>
      </View>
    </KeyboardAvoidingView>
  );
}
