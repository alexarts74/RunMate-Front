import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useFormValidation } from "@/hooks/auth/useFormValidation";
import { validateLoginForm } from "@/constants/formValidation";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/service/api/auth";
import { matchesService } from "@/service/api/matching";
import { useMatches } from "@/context/MatchesContext";
import { ParticlesBackground } from "@/components/animations/ParticlesBackground";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const { errors, validateForm, clearErrors } = useFormValidation();
  const { setMatches } = useMatches();
  const { login } = useAuth();

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      clearErrors();
      const isValid = validateForm(validateLoginForm(formData));
      if (!isValid) return;

      setLoading(true);
      const userData = await authService.login(formData);
      await login(userData);
      await authService.getCurrentUser();
      const matchesData = await matchesService.getMatches();
      setMatches(matchesData);
      router.replace("/(tabs)/matches");
    } catch (err) {
      console.error("Erreur connexion:", err);
      setErrors({ general: "Erreur lors de la connexion" });
    } finally {
      setLoading(false);
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
            Content de te
          </Text>
          <Text className="text-2xl font-bold text-white text-center">
            revoir ! 👋
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

          {errors.general && (
            <Text className="text-red-500 text-center mt-1">
              {errors.general}
            </Text>
          )}
        </View>
      </View>

      <Pressable
        className={`bg-green py-4 rounded-full mb-12 ${
          loading ? "opacity-70" : ""
        }`}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#1a2126" />
        ) : (
          <Text className="text-sm font-semibold text-dark text-center">
            Se connecter
          </Text>
        )}
      </Pressable>
    </View>
  );
}
