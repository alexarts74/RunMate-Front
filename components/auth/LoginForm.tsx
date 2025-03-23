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
import {
  validateLoginForm,
  resetErrorsAfterDelay,
} from "@/constants/formValidation";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/service/api/auth";
import { matchesService } from "@/service/api/matching";
import { useMatches } from "@/context/MatchesContext";
import { ParticlesBackground } from "@/components/animations/ParticlesBackground";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNotifications } from "@/context/NotificationContext";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const { errors, validateForm, clearErrors, setErrors } = useFormValidation();
  const { setMatches } = useMatches();
  const { login } = useAuth();
  const { registerForPushNotifications } = useNotifications();

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      clearErrors();
      const isValid = validateForm(validateLoginForm(formData));
      if (!isValid) {
        resetErrorsAfterDelay(setErrors);
        return;
      }

      setLoading(true);
      const userData = await authService.login(formData);
      await login(userData);
      await authService.getCurrentUser();

      // Enregistrer les notifications après la connexion
      await registerForPushNotifications();

      const matchesData = await matchesService.getMatches();
      setMatches(matchesData);
      router.replace("/(tabs)/matches");
    } catch (err) {
      console.error("Erreur connexion:", err);
      setErrors({ general: "Erreur lors de la connexion" });
      resetErrorsAfterDelay(setErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background px-5">
      <ParticlesBackground />
      <View className="flex-row items-center mb-10 mt-16">
        <Pressable
          onPress={() => router.back()}
          className="bg-[#1e2429] p-1.5 rounded-full border border-gray-700 active:opacity-80"
          style={{ position: "absolute", zIndex: 10 }}
        >
          <Ionicons name="arrow-back" size={22} color="#8101f7" />
        </Pressable>
        <View className="flex-1 items-center justify-center">
          <Text className="text-2xl font-bold text-white text-center">
            Content de te
          </Text>
          <Text className="text-2xl font-bold text-purple text-center">
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
            <View
              className={`flex-row items-center bg-background border rounded-full p-4 ${
                focusedInput === "email"
                  ? `border-purple ${errors.email ? "border-red-500" : ""}`
                  : errors.email
                  ? "border-red-500"
                  : "border-gray-700"
              }`}
            >
              <Ionicons name="mail-outline" size={20} color="#8101f7" />
              <TextInput
                className="flex-1 text-white ml-3 font-kanit"
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                value={formData.email}
                onChangeText={(value) => handleChange("email", value)}
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
            <Text className="text-white text-sm font-semibold pl-2 mb-1">
              Mot de passe*
            </Text>
            <View
              className={`flex-row items-center bg-background border rounded-full p-4 ${
                focusedInput === "password"
                  ? `border-purple ${errors.password ? "border-red-500" : ""}`
                  : errors.password
                  ? "border-red-500"
                  : "border-gray-700"
              }`}
            >
              <Ionicons name="lock-closed-outline" size={20} color="#8101f7" />
              <TextInput
                className="flex-1 text-white ml-3 font-kanit"
                placeholder="Mot de passe"
                placeholderTextColor="#9CA3AF"
                value={formData.password}
                onChangeText={(value) => handleChange("password", value)}
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

          {errors.general && (
            <Text className="text-red-500 text-center mt-1 font-kanit">
              {errors.general}
            </Text>
          )}
        </View>
      </View>

      <Pressable
        className={`bg-purple py-4 rounded-full mb-12 ${
          loading ? "opacity-70" : ""
        }`}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text className="text-sm font-semibold text-white text-center">
            Se connecter
          </Text>
        )}
      </Pressable>
    </View>
  );
}
