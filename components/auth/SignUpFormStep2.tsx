import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  Pressable,
  ScrollView,
  Modal,
  TouchableOpacity,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useFormValidation } from "@/hooks/auth/useFormValidation";
import { validateSignUpFormStep2 } from "@/constants/formValidation";
import { Ionicons } from "@expo/vector-icons";
import { GenderSelect } from "../GenderSelect";
import { ActionButton } from "../ui/ActionButton";

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
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showAgePicker, setShowAgePicker] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
      console.error("Erreur lors de la sélection de l'image:", error);
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
    <View className="flex-1 bg-[#12171b]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="h-[15%] mt-8 flex-row items-center">
          <Pressable
            onPress={onBack}
            className="bg-[#1e2429] p-1.5 rounded-full border border-[#2a3238] active:opacity-80 ml-4"
          >
            <Ionicons name="arrow-back" size={22} color="#b9f144" />
          </Pressable>

          <View className="flex-1">
            <Text className="text-white text-2xl mr-8 font-bold text-center">
              Dis nous en{"\n"}
              <Text className="text-green">plus sur toi</Text>
            </Text>
          </View>
        </View>

        <View className="space-y-4 px-4">
          <View className="space-y-2">
            <Text className="text-white text-sm font-semibold pl-2">
              Prénom*
            </Text>
            <TextInput
              className={`w-full border rounded-full p-4 bg-[#1e2429] text-white ${
                focusedInput === "first_name"
                  ? "border-green"
                  : "border-[#2a3238]"
              }`}
              placeholder="Prénom"
              placeholderTextColor="#9CA3AF"
              value={formData.first_name}
              onChangeText={(value) => handleChange("first_name", value)}
              onFocus={() => setFocusedInput("first_name")}
              onBlur={() => setFocusedInput(null)}
            />
            {errors.first_name && (
              <Text className="text-red-500 text-sm pl-2">
                {errors.first_name}
              </Text>
            )}
          </View>

          <View className="space-y-2">
            <Text className="text-white text-sm font-semibold pl-2">Nom*</Text>
            <TextInput
              className={`w-full border rounded-full p-4 bg-[#1e2429] text-white ${
                focusedInput === "last_name"
                  ? "border-green"
                  : "border-[#2a3238]"
              }`}
              placeholder="Nom"
              placeholderTextColor="#9CA3AF"
              value={formData.last_name}
              onChangeText={(value) => handleChange("last_name", value)}
              onFocus={() => setFocusedInput("last_name")}
              onBlur={() => setFocusedInput(null)}
            />
            {errors.last_name && (
              <Text className="text-red-500 text-sm pl-2">
                {errors.last_name}
              </Text>
            )}
          </View>

          <View className="space-y-2">
            <Text className="text-white text-sm font-semibold pl-2">Âge*</Text>
            <TouchableOpacity
              onPress={() => setShowAgePicker(true)}
              className={`w-full border rounded-full p-4 bg-[#1e2429] ${
                focusedInput === "age" ? "border-green" : "border-[#2a3238]"
              }`}
            >
              <Text className="text-white">
                {formData.age
                  ? `${formData.age} ans`
                  : "Sélectionnez votre âge"}
              </Text>
            </TouchableOpacity>
            {errors.age && (
              <Text className="text-red-500 text-sm pl-2">{errors.age}</Text>
            )}
          </View>

          <View className="space-y-2">
            <Text className="text-white text-sm font-semibold pl-2 pb-2">
              Genre*
            </Text>
            <GenderSelect
              value={formData.gender}
              onChange={(value) => handleChange("gender", value)}
            />
            {errors.gender && (
              <Text className="text-red-500 text-sm pl-2">{errors.gender}</Text>
            )}
          </View>

          <View className="space-y-2">
            <Text className="text-white text-sm font-semibold pl-2">Bio*</Text>
            <TextInput
              className={`w-full border rounded-full p-4 bg-[#1e2429] text-white ${
                focusedInput === "bio" ? "border-green" : "border-[#2a3238]"
              }`}
              placeholder="Parle-nous de toi..."
              placeholderTextColor="#9CA3AF"
              value={formData.bio}
              onChangeText={(value) => handleChange("bio", value)}
              onFocus={() => setFocusedInput("bio")}
              onBlur={() => setFocusedInput(null)}
              multiline
              numberOfLines={2}
              style={{ height: 50, textAlignVertical: "top" }}
            />
          </View>

          <View className="space-y-2 mb-8">
            <Text className="text-white text-sm font-semibold pl-2">
              Photo de profil*
            </Text>
            <Pressable
              onPress={pickImage}
              className={`w-full border rounded-2xl p-4 items-center justify-center bg-[#1e2429] ${
                focusedInput === "profile_image"
                  ? "border-green"
                  : "border-[#2a3238]"
              }`}
            >
              {formData.profile_image ? (
                <View className="items-center">
                  <Image
                    source={{ uri: formData.profile_image }}
                    className="w-20 h-20 rounded-full mb-2"
                  />
                  <Text className="text-white">Changer l'image</Text>
                </View>
              ) : (
                <Text className="text-white">
                  Sélectionner une image de profil
                </Text>
              )}
            </Pressable>
          </View>
        </View>

        <View className="h-32" />
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 p-6 bg-[#12171b]">
        <ActionButton
          text="Continuer"
          onPress={handleSubmit}
          disabled={!isFormValid}
          loading={isLoading}
        />
      </View>

      <Modal visible={showAgePicker} transparent={true} animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-[#1e2429] w-full p-4">
            <View className="flex-row justify-between items-center mb-4">
              <TouchableOpacity onPress={() => setShowAgePicker(false)}>
                <Text className="text-white">Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (!formData.age) {
                    handleChange("age", "18");
                  }
                  setShowAgePicker(false);
                }}
              >
                <Text className="text-white">Confirmer</Text>
              </TouchableOpacity>
            </View>
            <Picker
              selectedValue={formData.age}
              onValueChange={(value) => handleChange("age", value.toString())}
              style={{ color: "#fff" }}
            >
              {ageOptions.map((age) => (
                <Picker.Item
                  key={age}
                  label={`${age} ans`}
                  value={age.toString()}
                  style={{ color: "#fff" }}
                />
              ))}
            </Picker>
          </View>
        </View>
      </Modal>
    </View>
  );
}
