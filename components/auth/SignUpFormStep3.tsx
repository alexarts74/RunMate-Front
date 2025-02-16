import React, { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { PaceDistanceInputs } from "@/components/runner-profile/PaceDistanceInputs";
import { ObjectiveSelect } from "@/components/runner-profile/ObjectiveSelect";
import { AvailabilitySelect } from "@/components/runner-profile/AvailabilitySelect";
import { ParticlesBackground } from "@/components/animations/ParticlesBackground";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useFormValidation } from "@/hooks/auth/useFormValidation";
import { validateSignUpFormStep3 } from "@/constants/formValidation";

interface SignUpFormStep3Props {
  formData: {
    actual_pace: string;
    usual_distance: string;
    availability: string[];
    objective: string;
  };
  onBack: () => void;
  onSubmit: () => void;
  handleChange: (name: string, value: string | string[]) => void;
}

export const SignUpFormStep3 = ({
  formData,
  onBack,
  onSubmit,
  handleChange,
}: SignUpFormStep3Props) => {
  const { errors, validateForm, clearErrors } = useFormValidation();
  const [isFormValid, setIsFormValid] = useState(false);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkFormValidity = () => {
      const hasAllRequiredFields =
        formData.actual_pace.trim() !== "" &&
        formData.usual_distance.trim() !== "" &&
        formData.availability.length > 0 &&
        formData.objective !== "";

      setIsFormValid(hasAllRequiredFields);
    };

    checkFormValidity();
  }, [formData]);

  const handleSubmit = async () => {
    try {
      clearErrors();
      setLoading(true);
      setIsError(false);

      const isValid = validateForm(validateSignUpFormStep3(formData));
      if (isValid) {
        console.log("Formulaire valide, tentative de soumission");
        try {
          await onSubmit();
        } catch (submitError) {
          console.error("Erreur dans onSubmit:", submitError);
          throw submitError;
        }
      } else {
        setIsError(true);
        setTimeout(() => {
          setIsError(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#12171b]">
      <ParticlesBackground />

      <View className="flex-1">
        <View className="mt-12 mb-2 relative flex">
          <Pressable
            onPress={onBack}
            className="absolute left-5 p-2 z-20"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#b9f144" />
          </Pressable>

          <Text className="text-2xl font-bold text-white text-center w-full">
            Ton profil coureur 🏃‍♂️
          </Text>
        </View>

        <View className="flex-1 justify-center px-4">
          <View>
            <PaceDistanceInputs
              actual_pace={formData.actual_pace}
              usual_distance={formData.usual_distance}
              handleChange={handleChange}
            />
            {(errors.actual_pace || errors.usual_distance) && (
              <Text className="text-red-500 text-center mt-1">
                {errors.actual_pace || errors.usual_distance}
              </Text>
            )}

            <View className="mt-8">
              <ObjectiveSelect
                handleChange={handleChange}
                value={formData.objective}
              />
              {errors.objective && (
                <Text className="text-red-500 text-center mt-1">
                  {errors.objective}
                </Text>
              )}
            </View>

            <View className="mt-8">
              <AvailabilitySelect
                availability={formData.availability}
                handleChange={handleChange}
              />
              {errors.availability && (
                <Text className="text-red-500 text-center mt-1">
                  {errors.availability}
                </Text>
              )}
            </View>
          </View>
        </View>

        <View className="px-5 mb-8">
          <Pressable
            className={`py-4 rounded-full ${
              isError ? "bg-red-500" : "bg-green"
            }`}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text className="text-base font-bold text-dark text-center">
              {loading ? "Chargement..." : "Terminer"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
