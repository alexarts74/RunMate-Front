import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, Image } from "react-native";
import { useFormValidation } from "@/hooks/auth/useFormValidation";
import {
  validateSignUpFormStep1,
  resetErrorsAfterDelay,
} from "@/constants/formValidation";
import { Ionicons } from "@expo/vector-icons";
import { ActionButton } from "@/components/ui/ActionButton";

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

  const handleSubmit = () => {
    clearErrors();
    const isValid = validateForm(validateSignUpFormStep1(formData));
    if (!isValid) {
      resetErrorsAfterDelay(setErrors);
      return;
    }
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
    <View className="flex-1 bg-background">
      {/* Header Section */}
      <View className="h-[15%] mt-8 flex-row items-center">
        <Pressable
          onPress={onBack}
          className="bg-[#1e2429] p-1.5 rounded-full border border-gray-700 active:opacity-80 ml-4"
        >
          <Ionicons name="arrow-back" size={22} color="#f0c2fe" />
        </Pressable>

        <View className="flex-1">
          <Text className="text-white text-2xl mr-8 font-kanit-bold text-center">
            Promis on te{"\n"}
            <Text className="text-purple">spammera pas !</Text>
            {" 🙃"}
          </Text>
        </View>
      </View>

      {/* Inputs Section */}
      <View className="flex-1 justify-center -mt-24">
        <View className="w-full space-y-5 px-4">
          <View>
            <View
              className={`flex-row items-center bg-[#1e2429] px-6 py-4 rounded-full border ${
                focusedInput === "email"
                  ? `border-purple ${errors.email ? "border-red-500" : ""}`
                  : errors.email
                  ? "border-red-500"
                  : "border-gray-700"
              }`}
            >
              <Ionicons name="mail-outline" size={20} color="#f0c2fe" />
              <TextInput
                className="flex-1 text-white ml-3 font-kanit"
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
                onFocus={() => setFocusedInput("email")}
                onBlur={() => setFocusedInput(null)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && (
              <Text className="text-red-500 mt-1 ml-4 font-kanit">
                {errors.email}
              </Text>
            )}
          </View>

          <View>
            <View
              className={`flex-row items-center bg-[#1e2429] px-6 py-4 rounded-full border ${
                focusedInput === "password"
                  ? `border-purple ${errors.password ? "border-red-500" : ""}`
                  : errors.password
                  ? "border-red-500"
                  : "border-gray-700"
              }`}
            >
              <Ionicons name="lock-closed-outline" size={20} color="#f0c2fe" />
              <TextInput
                className="flex-1 text-white ml-3 font-kanit"
                placeholder="Mot de passe"
                placeholderTextColor="#9CA3AF"
                value={formData.password}
                onChangeText={(text) => handleChange("password", text)}
                onFocus={() => setFocusedInput("password")}
                onBlur={() => setFocusedInput(null)}
                secureTextEntry
              />
            </View>
            {errors.password && (
              <Text className="text-red-500 mt-1 ml-4 font-kanit">
                {errors.password}
              </Text>
            )}
          </View>

          <View>
            <View
              className={`flex-row items-center bg-[#1e2429] px-6 py-4 rounded-full border ${
                focusedInput === "password_confirmation"
                  ? `border-purple ${
                      errors.password_confirmation ? "border-red-500" : ""
                    }`
                  : errors.password_confirmation
                  ? "border-red-500"
                  : "border-gray-700"
              }`}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color="#f0c2fe"
              />
              <TextInput
                className="flex-1 text-white ml-3 font-kanit"
                placeholder="Confirmer le mot de passe"
                placeholderTextColor="#9CA3AF"
                value={formData.password_confirmation}
                onChangeText={(text) =>
                  handleChange("password_confirmation", text)
                }
                onFocus={() => setFocusedInput("password_confirmation")}
                onBlur={() => setFocusedInput(null)}
                secureTextEntry
              />
            </View>
            {errors.password_confirmation && (
              <Text className="text-red-500 mt-1 ml-4 font-kanit">
                {errors.password_confirmation}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Button Section - Fixed at bottom */}
      <View className="absolute bottom-8 w-full">
        <ActionButton
          onPress={handleSubmit}
          text="Continuer"
          loading={isLoading}
        />
      </View>
    </View>
  );
}
