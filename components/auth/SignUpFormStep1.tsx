import React, { useState } from "react";
import { View, TextInput, Text, Pressable } from "react-native";
import { useFormValidation } from "@/hooks/auth/useFormValidation";
import { validateSignUpFormStep1 } from "@/constants/formValidation";
import { ParticlesBackground } from "@/components/animations/ParticlesBackground";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
interface SignUpFormStep1Props {
  formData: {
    email: string;
    password: string;
    password_confirmation: string;
  };
  onNext: () => void;
  handleChange: (name: string, value: string) => void;
}

export const SignUpFormStep1 = ({
  formData,
  onNext,
  handleChange,
}: SignUpFormStep1Props) => {
  const { errors, validateForm, clearErrors } = useFormValidation();
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const router = useRouter();
  const handleNextStep = () => {
    clearErrors();
    const isValid = validateForm(validateSignUpFormStep1(formData));
    if (isValid) {
      onNext();
    }
  };

  return (
    <View className="flex-1 bg-[#12171b] px-5">
      <ParticlesBackground />
      <View className="flex-row items-center justify-between mt-16">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-2xl font-bold text-white text-center">
            Promis, on ne te
          </Text>
          <Text className="text-2xl font-bold text-white text-center">
            spammera pas 🙂
          </Text>
        </View>
      </View>

      <View className="flex-1 justify-center">
        <View className="space-y-4">
          <View>
            <Text className="text-white text-sm font-semibold pl-2 mb-1">
              Email*
            </Text>
            <TextInput
              className={`w-full border rounded-full p-4 bg-[#1e2429] text-white ${
                focusedInput === "email"
                  ? `border-green ${errors.email ? "border-red-500" : ""}`
                  : "border-[#2a3238]"
              }`}
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              value={formData.email}
              onChangeText={(value) => handleChange("email", value)}
              onFocus={() => setFocusedInput("email")}
              onBlur={() => setFocusedInput(null)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && (
              <Text className="text-red-500 text-center mt-1">
                {errors.email}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-white text-sm font-semibold pl-2 mb-1">
              Mot de passe*
            </Text>
            <TextInput
              className={`w-full border rounded-full p-4 bg-[#1e2429] text-white ${
                focusedInput === "password"
                  ? `border-green ${errors.password ? "border-red-500" : ""}`
                  : "border-[#2a3238]"
              }`}
              placeholder="Mot de passe"
              placeholderTextColor="#9CA3AF"
              value={formData.password}
              onChangeText={(value) => handleChange("password", value)}
              onFocus={() => setFocusedInput("password")}
              onBlur={() => setFocusedInput(null)}
              secureTextEntry
            />
            {errors.password && (
              <Text className="text-red-500 text-center mt-1">
                {errors.password}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-white text-sm font-semibold pl-2 mb-1">
              Confirmer le mot de passe*
            </Text>
            <TextInput
              className={`w-full border rounded-full p-4 bg-[#1e2429] text-white ${
                focusedInput === "password_confirmation"
                  ? `border-green ${
                      errors.password_confirmation ? "border-red-500" : ""
                    }`
                  : "border-[#2a3238]"
              }`}
              placeholder="Confirmer le mot de passe"
              placeholderTextColor="#9CA3AF"
              value={formData.password_confirmation}
              onChangeText={(value) =>
                handleChange("password_confirmation", value)
              }
              onFocus={() => setFocusedInput("password_confirmation")}
              onBlur={() => setFocusedInput(null)}
              secureTextEntry
            />
            {errors.password_confirmation && (
              <Text className="text-red-500 text-center mt-1">
                {errors.password_confirmation}
              </Text>
            )}
          </View>
        </View>
      </View>

      <Pressable
        className="bg-green py-4 rounded-full mb-12"
        onPress={handleNextStep}
      >
        <Text className="text-sm font-semibold text-dark text-center">
          Suivant
        </Text>
      </Pressable>
    </View>
  );
};
