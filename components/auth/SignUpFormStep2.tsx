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
import { SelectList } from "react-native-dropdown-select-list";
import * as ImagePicker from "expo-image-picker";
import { useFormValidation } from "@/hooks/auth/useFormValidation";
import { validateSignUpFormStep2 } from "@/constants/formValidation";
import { ParticlesBackground } from "@/components/animations/ParticlesBackground";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface SignUpFormStep2Props {
  formData: {
    first_name: string;
    last_name: string;
    age: string;
    gender: string;
    bio: string;
    profile_image: string;
  };
  onBack: () => void;
  onSubmit: () => void;
  handleChange: (name: string, value: string) => void;
}

export const SignUpFormStep2 = ({
  formData,
  onBack,
  onSubmit,
  handleChange,
}: SignUpFormStep2Props) => {
  const { errors, validateForm, clearErrors } = useFormValidation();
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showAgePicker, setShowAgePicker] = useState(false);
  const router = useRouter();
  const [isFormValid, setIsFormValid] = useState(false);

  const ageOptions = Array.from({ length: 83 }, (_, i) => i + 18);
  const genderOptions = [
    { key: "male", value: "Homme" },
    { key: "female", value: "Femme" },
    { key: "other", value: "Autre" },
  ];

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
      const validationResult = validateSignUpFormStep2(formData);
      const hasAllRequiredFields =
        formData.first_name.trim() !== "" &&
        formData.last_name.trim() !== "" &&
        formData.age !== "" &&
        formData.gender !== "";

      setIsFormValid(hasAllRequiredFields);
    };

    checkFormValidity();
  }, [formData]);

  const handleSubmit = () => {
    clearErrors();
    const isValid = validateForm(validateSignUpFormStep2(formData));
    if (isValid) {
      onSubmit();
    }
  };

  return (
    <View className="flex-1 bg-[#12171b]">
      <ParticlesBackground />
      <ScrollView className="flex-1 px-5">
        <View className="mt-16 mb-8 relative flex">
          <Pressable
            onPress={onBack}
            className="absolute left-0 p-1 z-20"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#b9f144" />
          </Pressable>

          <Text className="text-2xl font-bold text-white text-center mb-2">
            Parle-nous de toi ☀️
          </Text>
        </View>

        <View className="space-y-4 mb-20">
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
            <Text className="text-white text-sm font-semibold pl-2">
              Genre*
            </Text>
            <SelectList
              setSelected={(val: string) => handleChange("gender", val)}
              data={genderOptions}
              save="key"
              placeholder="Sélectionnez votre genre"
              boxStyles={{
                borderWidth: 1,
                borderColor: focusedInput === "gender" ? "#b9f144" : "#2a3238",
                borderRadius: 50,
                padding: 16,
                backgroundColor: "#1e2429",
              }}
              dropdownStyles={{
                borderWidth: 1,
                borderColor: "#2a3238",
                borderRadius: 12,
                backgroundColor: "#1e2429",
                marginTop: 4,
              }}
              inputStyles={{ color: "#fff" }}
              dropdownTextStyles={{ color: "#fff" }}
              search={false}
            />
            {errors.gender && (
              <Text className="text-red-500 text-sm pl-2">{errors.gender}</Text>
            )}
          </View>

          <View className="space-y-2">
            <Text className="text-white text-sm font-semibold pl-2">Bio</Text>
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

          <View className="flex-row space-x-4 mt-8">
            <Pressable
              className="flex-1 bg-green py-4 rounded-full disabled:opacity-50"
              onPress={handleSubmit}
              disabled={!isFormValid}
              style={!isFormValid ? { opacity: 0.5 } : {}}
            >
              <Text className="text-base font-bold text-dark text-center">
                S'inscrire
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

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
};
