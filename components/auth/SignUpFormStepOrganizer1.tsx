import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/constants/theme";
import WarmBackground from "@/components/ui/WarmBackground";
import GlassInput from "@/components/ui/GlassInput";
import GlassButton from "@/components/ui/GlassButton";
import GlassCard from "@/components/ui/GlassCard";

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { colors, shadows } = useThemeColors();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.organization_name.trim()) {
      newErrors.organization_name = "Le nom de l'organisation est requis";
    }

    if (!formData.organization_type) {
      newErrors.organization_type = "Veuillez s\u00e9lectionner un type d'organisation";
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
    <WarmBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ paddingHorizontal: 24, paddingVertical: 24 }}>
              {/* Header avec bouton retour */}
              <View style={{ marginBottom: 24 }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
                  <Pressable
                    onPress={onBack}
                    style={[
                      {
                        backgroundColor: colors.glass.light,
                        padding: 10,
                        borderRadius: 9999,
                        marginRight: 16,
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
                        fontFamily: "Nunito-ExtraBold",
                      }}
                    >
                      Informations de votre organisation
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    color: colors.text.secondary,
                    fontSize: 16,
                    fontFamily: "Nunito-Medium",
                  }}
                >
                  Remplissez les informations de base de votre organisation
                </Text>
              </View>

              {/* Nom de l'organisation */}
              <View style={{ marginBottom: 24 }}>
                <GlassInput
                  label="Nom de l'organisation *"
                  placeholder="Ex: Club de Running Paris"
                  value={formData.organization_name}
                  onChangeText={(value) => handleChange("organization_name", value)}
                  error={errors.organization_name}
                  autoCorrect={false}
                />
              </View>

              {/* Type d'organisation */}
              <View style={{ marginBottom: 24 }}>
                <Text
                  style={{
                    color: colors.text.secondary,
                    fontSize: 14,
                    fontFamily: "Nunito-SemiBold",
                    marginBottom: 12,
                  }}
                >
                  Type d'organisation *
                </Text>
                <View style={{ gap: 12 }}>
                  {organizationTypes.map((type) => (
                    <Pressable
                      key={type.value}
                      onPress={() => handleChange("organization_type", type.value)}
                    >
                      <GlassCard
                        variant={formData.organization_type === type.value ? "medium" : "light"}
                        style={{
                          borderWidth: 2,
                          borderColor: formData.organization_type === type.value
                            ? colors.primary.DEFAULT
                            : errors.organization_type
                            ? colors.error
                            : colors.glass.border,
                        }}
                      >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <View
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 12,
                              alignItems: "center",
                              justifyContent: "center",
                              marginRight: 12,
                              backgroundColor: formData.organization_type === type.value
                                ? colors.primary.DEFAULT
                                : colors.primary.subtle,
                            }}
                          >
                            <Ionicons
                              name={type.icon as any}
                              size={20}
                              color={formData.organization_type === type.value ? "#FFFFFF" : colors.text.tertiary}
                            />
                          </View>
                          <Text
                            style={{
                              fontSize: 16,
                              fontFamily: "Nunito-Bold",
                              flex: 1,
                              color: formData.organization_type === type.value
                                ? colors.primary.DEFAULT
                                : colors.text.primary,
                            }}
                          >
                            {type.label}
                          </Text>
                          {formData.organization_type === type.value && (
                            <Ionicons name="checkmark-circle" size={24} color={colors.primary.DEFAULT} />
                          )}
                        </View>
                      </GlassCard>
                    </Pressable>
                  ))}
                </View>
                {errors.organization_type && (
                  <Text style={{ color: colors.error, fontSize: 13, fontFamily: "Nunito-Regular", marginTop: 4 }}>
                    {errors.organization_type}
                  </Text>
                )}
              </View>

              {/* Description */}
              <View style={{ marginBottom: 24 }}>
                <GlassInput
                  label="Description (optionnel)"
                  placeholder="D\u00e9crivez votre organisation, ses valeurs, ses activit\u00e9s..."
                  value={formData.description}
                  onChangeText={(value) => handleChange("description", value)}
                  autoCorrect={false}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  style={{ minHeight: 120 }}
                />
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
            <GlassButton
              title="Suivant"
              onPress={handleSubmit}
              variant="primary"
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </WarmBackground>
  );
}
