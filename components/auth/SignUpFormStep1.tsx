import React, { useState } from "react";
import { View, TextInput, Text, Pressable } from "react-native";
import { useFormValidation } from "@/hooks/auth/useFormValidation";
import { validateSignUpFormStep1 } from "@/constants/formValidation";

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

  const handleNextStep = () => {
    clearErrors();
    const isValid = validateForm(validateSignUpFormStep1(formData));
    if (isValid) {
      onNext();
    }
  };

  return (
    <View className="flex-1 bg-[#12171b] px-5 py-6">
      <Text className="text-2xl font-bold text-white text-center mb-6">
        Créez votre compte
      </Text>

      <TextInput
        className={`w-full border rounded-lg p-4 mb-4 bg-gray text-white ${
          focusedInput === "email" ? "border-green" : "border-gray"
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
        <Text className="text-red-500 mb-2">{errors.email}</Text>
      )}

      <TextInput
        className={`w-full border rounded-lg p-4 mb-4 bg-gray text-white ${
          focusedInput === "password" ? "border-green" : "border-gray"
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
        <Text className="text-red-500 mb-2">{errors.password}</Text>
      )}

      <TextInput
        className={`w-full border rounded-lg p-4 mb-4 bg-gray text-white ${
          focusedInput === "password_confirmation"
            ? "border-green"
            : "border-gray"
        }`}
        placeholder="Confirmer le mot de passe"
        placeholderTextColor="#9CA3AF"
        value={formData.password_confirmation}
        onChangeText={(value) => handleChange("password_confirmation", value)}
        onFocus={() => setFocusedInput("password_confirmation")}
        onBlur={() => setFocusedInput(null)}
        secureTextEntry
      />
      {errors.password_confirmation && (
        <Text className="text-red-500 mb-2">
          {errors.password_confirmation}
        </Text>
      )}

      <Pressable
        className="bg-green py-3 rounded-full mt-6"
        onPress={handleNextStep}
      >
        <Text className="text-sm font-semibold text-dark text-center">
          Suivant
        </Text>
      </Pressable>
    </View>
  );
};
