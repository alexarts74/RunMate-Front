import React, { useEffect, useState } from "react";
import { View, Text, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { useFormValidation } from "@/hooks/auth/useFormValidation";
import {
  validateSignUpFormStep1,
  resetErrorsAfterDelay,
} from "@/constants/formValidation";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/constants/theme";
import WarmBackground from "@/components/ui/WarmBackground";
import GlassInput from "@/components/ui/GlassInput";
import GlassButton from "@/components/ui/GlassButton";

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
  const { errors, validateForm, clearErrors, setErrors } = useFormValidation();
  const { colors, shadows } = useThemeColors();

  // Log des erreurs quand elles changent
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Erreurs de validation Step 1 detectees:");
      console.log("- Email:", formData.email || "vide");
      console.log("- Password:", formData.password || "vide");
      console.log("- Password confirmation:", formData.password_confirmation || "vide");
      console.log("Erreurs completes:", errors);
    }
  }, [errors, formData]);

  const handleSubmit = () => {
    clearErrors();
    const isValid = validateForm(validateSignUpFormStep1(formData));

    if (!isValid) {
      console.log("Formulaire invalide - en attente des erreurs detaillees...");
      resetErrorsAfterDelay(setErrors);
      return;
    }

    console.log("Validation Step 1 reussie - passage a l'etape suivante");
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
      style={{ flex: 1 }}
    >
      <WarmBackground>
        <View style={{ flex: 1, paddingHorizontal: 24 }}>
          {/* Header Section */}
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
                Promis on te{"\n"}
                <Text style={{ color: colors.primary.DEFAULT }}>spammera pas !</Text>
                {" \ud83d\ude43"}
              </Text>
            </View>
          </View>

          {/* Inputs Section */}
          <View style={{ flex: 1, justifyContent: "center", marginTop: -96 }}>
            <View style={{ width: "100%", gap: 20 }}>
              <GlassInput
                label="Email*"
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                icon={<Ionicons name="mail-outline" size={20} color={colors.primary.DEFAULT} />}
              />

              <GlassInput
                label="Mot de passe*"
                placeholder="Mot de passe"
                value={formData.password}
                onChangeText={(text) => handleChange("password", text)}
                secureTextEntry
                error={errors.password}
                icon={<Ionicons name="lock-closed-outline" size={20} color={colors.primary.DEFAULT} />}
              />

              <GlassInput
                label="Confirmer le mot de passe*"
                placeholder="Confirmer le mot de passe"
                value={formData.password_confirmation}
                onChangeText={(text) => handleChange("password_confirmation", text)}
                secureTextEntry
                error={errors.password_confirmation}
                icon={<Ionicons name="shield-checkmark-outline" size={20} color={colors.primary.DEFAULT} />}
              />
            </View>
          </View>

          {/* Button Section - Fixed at bottom */}
          <View style={{ position: "absolute", bottom: 32, left: 0, right: 0, paddingHorizontal: 24 }}>
            <GlassButton
              title="Continuer"
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
