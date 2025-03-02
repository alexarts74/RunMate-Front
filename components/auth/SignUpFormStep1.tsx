import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, Image } from "react-native";
import { useFormValidation } from "@/hooks/auth/useFormValidation";
import { validateSignUpFormStep1 } from "@/constants/formValidation";
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
  const { errors, validateForm, clearErrors } = useFormValidation();

  const handleSubmit = () => {
    clearErrors();
    if (validateForm(validateSignUpFormStep1(formData))) {
      onNext();
    }
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
          <Ionicons name="arrow-back" size={22} color="#8101f7" />
        </Pressable>

        <View className="flex-1">
          <Text className="text-white text-2xl mr-8 font-bold text-center">
            Promis on te{"\n"}
            <Text className="text-purple">spammera pas !</Text> 🙃
          </Text>
        </View>
      </View>

      {/* Inputs Section */}
      <View className="flex-1 justify-center -mt-24">
        <View className="w-full space-y-5 px-4">
          <View>
            <View className="flex-row items-center bg-[#1e2429] px-6 py-4 rounded-full border border-gray-700">
              <Ionicons name="mail-outline" size={20} color="#8101f7" />
              <TextInput
                className="flex-1 text-white ml-3"
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && (
              <Text className="text-red-500 mt-1 ml-4">{errors.email}</Text>
            )}
          </View>

          <View>
            <View className="flex-row items-center bg-[#1e2429] px-6 py-4 rounded-full border border-gray-700">
              <Ionicons name="lock-closed-outline" size={20} color="#8101f7" />
              <TextInput
                className="flex-1 text-white ml-3"
                placeholder="Mot de passe"
                placeholderTextColor="#9CA3AF"
                value={formData.password}
                onChangeText={(text) => handleChange("password", text)}
                secureTextEntry
              />
            </View>
            {errors.password && (
              <Text className="text-red-500 mt-1 ml-4">{errors.password}</Text>
            )}
          </View>

          <View>
            <View className="flex-row items-center bg-[#1e2429] px-6 py-4 rounded-full border border-gray-700">
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color="#8101f7"
              />
              <TextInput
                className="flex-1 text-white ml-3"
                placeholder="Confirmer le mot de passe"
                placeholderTextColor="#9CA3AF"
                value={formData.password_confirmation}
                onChangeText={(text) =>
                  handleChange("password_confirmation", text)
                }
                secureTextEntry
              />
            </View>
            {errors.password_confirmation && (
              <Text className="text-red-500 mt-1 ml-4">
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
          disabled={!isFormValid}
          loading={isLoading}
        />
      </View>
    </View>
  );
}
