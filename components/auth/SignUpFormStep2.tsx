import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useFormValidation } from "@/hooks/auth/useFormValidation";
import { validateSignUpFormStep2 } from "@/constants/formValidation";
import { Ionicons } from "@expo/vector-icons";
import { GenderSelect } from "../GenderSelect";
import { useThemeColors } from "@/constants/theme";
import WarmBackground from "@/components/ui/WarmBackground";
import GlassInput from "@/components/ui/GlassInput";
import GlassButton from "@/components/ui/GlassButton";
import GlassCard from "@/components/ui/GlassCard";

interface SignUpFormStep2Props {
  formData: {
    first_name: string;
    last_name: string;
    age: string;
    gender: string;
    bio: string;
    profile_image: string;
  };
  runnerType: "chill" | "perf" | null;
  onBack: () => void;
  onNext: () => void;
  handleChange: (name: string, value: string) => void;
}

export function SignUpFormStep2({
  formData,
  runnerType,
  onBack,
  onNext,
  handleChange,
}: SignUpFormStep2Props) {
  const { errors, validateForm, clearErrors } = useFormValidation();
  const [showAgePicker, setShowAgePicker] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { colors, shadows } = useThemeColors();
  const ageOptions = Array.from({ length: 83 }, (_, i) => i + 18);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        handleChange("profile_image", result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erreur lors de la selection de l'image:", error);
    }
  };

  useEffect(() => {
    const checkFormValidity = () => {
      validateSignUpFormStep2(formData);
      const hasAllRequiredFields =
        formData.first_name.trim() !== "" &&
        formData.last_name.trim() !== "" &&
        formData.age !== "" &&
        formData.bio !== "" &&
        formData.gender !== "" &&
        formData.profile_image !== "";

      setIsFormValid(hasAllRequiredFields);
    };
    checkFormValidity();
  }, [formData]);

  const handleSubmit = () => {
    setIsLoading(true);
    clearErrors();
    if (validateForm(validateSignUpFormStep2(formData))) {
      onNext();
    }
    setIsLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <WarmBackground>
        <View style={{ flex: 1, paddingHorizontal: 24 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
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
                  Dis nous en{"\n"}
                  <Text style={{ color: colors.primary.DEFAULT }}>plus sur toi</Text>
                </Text>
              </View>
            </View>

            <View style={{ gap: 20, marginTop: 16 }}>
              <GlassInput
                label="Pr\u00e9nom*"
                placeholder="Pr\u00e9nom"
                value={
                  formData.first_name.charAt(0).toUpperCase() +
                  formData.first_name.slice(1)
                }
                onChangeText={(value) => handleChange("first_name", value)}
                error={errors.first_name}
              />

              <GlassInput
                label="Nom*"
                placeholder="Nom"
                value={
                  formData.last_name.charAt(0).toUpperCase() +
                  formData.last_name.slice(1)
                }
                onChangeText={(value) => handleChange("last_name", value)}
                error={errors.last_name}
              />

              <View>
                <Text
                  style={{
                    color: colors.text.secondary,
                    fontSize: 14,
                    fontFamily: "Nunito-SemiBold",
                    marginBottom: 6,
                  }}
                >
                  {"\u00c2"}ge*
                </Text>
                <TouchableOpacity
                  onPress={() => setShowAgePicker(true)}
                  style={[
                    {
                      backgroundColor: colors.glass.light,
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: colors.glass.border,
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      minHeight: 50,
                      justifyContent: "center",
                    },
                    shadows.sm,
                  ]}
                >
                  <Text style={{ color: formData.age ? colors.text.primary : colors.text.tertiary, fontFamily: "Nunito-Medium", fontSize: 16 }}>
                    {formData.age
                      ? `${formData.age} ans`
                      : "S\u00e9lectionnez votre \u00e2ge"}
                  </Text>
                </TouchableOpacity>
                {errors.age && (
                  <Text style={{ color: colors.error, fontSize: 13, marginTop: 4, marginLeft: 4, fontFamily: "Nunito-Regular" }}>
                    {errors.age}
                  </Text>
                )}
              </View>

              <View>
                <Text
                  style={{
                    color: colors.text.secondary,
                    fontSize: 14,
                    fontFamily: "Nunito-SemiBold",
                    marginBottom: 6,
                  }}
                >
                  Genre*
                </Text>
                <GenderSelect
                  value={formData.gender}
                  onChange={(value) => handleChange("gender", value)}
                />
                {errors.gender && (
                  <Text style={{ color: colors.error, fontSize: 13, marginTop: 4, marginLeft: 4, fontFamily: "Nunito-Regular" }}>
                    {errors.gender}
                  </Text>
                )}
              </View>

              <GlassInput
                label="Bio*"
                placeholder="Parle-nous de toi..."
                value={formData.bio}
                onChangeText={(value) => handleChange("bio", value)}
                multiline
                numberOfLines={2}
                style={{ height: 50, textAlignVertical: "top" }}
              />

              <View style={{ marginBottom: 32 }}>
                <Text
                  style={{
                    color: colors.text.secondary,
                    fontSize: 14,
                    fontFamily: "Nunito-SemiBold",
                    marginBottom: 6,
                  }}
                >
                  Photo de profil*
                </Text>
                <Pressable onPress={pickImage}>
                  <GlassCard
                    variant="light"
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      paddingVertical: 24,
                      paddingHorizontal: 24,
                    }}
                  >
                    {formData.profile_image ? (
                      <View style={{ alignItems: "center" }}>
                        <Image
                          source={{ uri: formData.profile_image }}
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            marginBottom: 12,
                            borderWidth: 2,
                            borderColor: colors.primary.DEFAULT,
                          }}
                        />
                        <Text style={{ color: colors.text.primary, fontFamily: "Nunito-Medium" }}>
                          Changer l'image
                        </Text>
                      </View>
                    ) : (
                      <View style={{ alignItems: "center" }}>
                        <View
                          style={{
                            width: 64,
                            height: 64,
                            borderRadius: 12,
                            backgroundColor: colors.primary.subtle,
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 12,
                          }}
                        >
                          <Ionicons name="camera-outline" size={32} color={colors.primary.DEFAULT} />
                        </View>
                        <Text style={{ color: colors.text.secondary, fontFamily: "Nunito-Medium" }}>
                          S{"\u00e9"}lectionner une image de profil
                        </Text>
                      </View>
                    )}
                  </GlassCard>
                </Pressable>
              </View>
            </View>

            <View style={{ height: 128 }} />
          </ScrollView>

          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              right: 0,
              paddingBottom: 32,
              paddingTop: 16,
              paddingHorizontal: 0,
            }}
          >
            <GlassButton
              title="Continuer"
              onPress={handleSubmit}
              variant="primary"
              loading={isLoading}
            />
          </View>

          <Modal visible={showAgePicker} transparent={true} animationType="slide">
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
                    S{"\u00e9"}lectionnez votre {"\u00e2"}ge
                  </Text>
                  <Pressable onPress={() => setShowAgePicker(false)}>
                    <Ionicons name="close" size={24} color={colors.primary.DEFAULT} />
                  </Pressable>
                </View>
                <Picker
                  selectedValue={formData.age}
                  onValueChange={(itemValue) => {
                    handleChange("age", itemValue.toString());
                    setShowAgePicker(false);
                  }}
                  style={{ color: colors.text.primary }}
                >
                  {ageOptions.map((age) => (
                    <Picker.Item
                      key={age}
                      label={`${age} ans`}
                      value={age.toString()}
                      color={colors.text.primary}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </Modal>
        </View>
      </WarmBackground>
    </KeyboardAvoidingView>
  );
}
