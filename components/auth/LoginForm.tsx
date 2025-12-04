import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
      const currentUser = await authService.getCurrentUser();

      // Enregistrer les notifications après la connexion
      await registerForPushNotifications();

      // Ne charger les matches que pour les runners
      if (userData.user?.user_type === "runner" || currentUser?.user_type === "runner") {
      const matchesData = await matchesService.getMatches();
      setMatches(matchesData);
      }
      
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 bg-fond px-6">
        <ParticlesBackground />
        <SafeAreaView edges={['top']} className="flex-1">
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-row items-center mb-10 mt-8">
              <Pressable
                onPress={() => router.replace("/")}
                className="bg-white p-2.5 rounded-full active:opacity-80"
                style={{
                  shadowColor: "#FF6B4A",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Ionicons name="arrow-back" size={20} color="#FF6B4A" />
              </Pressable>
              <View className="flex-1 items-center justify-center">
                <Text className="text-3xl font-nunito-extrabold text-gray-900 text-center">
                  Content de te
                </Text>
                <Text className="text-3xl font-nunito-extrabold text-primary text-center">
                  revoir ! 👋
                </Text>
              </View>
            </View>

            <View className="flex-1 justify-center">
              <View className="space-y-5">
                <View>
                  <Text className="text-gray-900 text-sm font-nunito-bold pl-2 mb-2">
                    Email*
                  </Text>
                  <View
                    className={`flex-row items-center bg-white border-2 rounded-full p-4 ${
                      focusedInput === "email"
                        ? `border-primary ${errors.email ? "border-red-500" : ""}`
                        : errors.email
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                    style={{
                      shadowColor: focusedInput === "email" && !errors.email ? "#FF6B4A" : "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: focusedInput === "email" && !errors.email ? 0.15 : 0.05,
                      shadowRadius: 2,
                      elevation: 1,
                    }}
                  >
                    <Ionicons name="mail-outline" size={20} color="#FF6B4A" style={{ marginRight: 12 }} />
                    <TextInput
                      className="flex-1 text-gray-900 font-nunito-medium"
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
                    <Text className="text-red-500 mt-1.5 ml-4 font-nunito-medium text-sm">
                      {errors.email}
                    </Text>
                  )}
                </View>

                <View>
                  <Text className="text-gray-900 text-sm font-nunito-bold pl-2 mb-2">
                    Mot de passe*
                  </Text>
                  <View
                    className={`flex-row items-center bg-white border-2 rounded-full p-4 ${
                      focusedInput === "password"
                        ? `border-primary ${errors.password ? "border-red-500" : ""}`
                        : errors.password
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                    style={{
                      shadowColor: focusedInput === "password" && !errors.password ? "#FF6B4A" : "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: focusedInput === "password" && !errors.password ? 0.15 : 0.05,
                      shadowRadius: 2,
                      elevation: 1,
                    }}
                  >
                    <Ionicons name="lock-closed-outline" size={20} color="#FF6B4A" style={{ marginRight: 12 }} />
                    <TextInput
                      className="flex-1 text-gray-900 font-nunito-medium"
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
                    <Text className="text-red-500 mt-1.5 ml-4 font-nunito-medium text-sm">
                      {errors.password}
                    </Text>
                  )}
                </View>

                {errors.general && (
                  <Text className="text-red-500 text-center mt-2 font-nunito-medium text-sm">
                    {errors.general}
                  </Text>
                )}
              </View>
            </View>

            <Pressable
              className={`bg-primary py-4 rounded-full mb-8 ${
                loading ? "opacity-70" : ""
              }`}
              onPress={handleLogin}
              disabled={loading}
              style={{
                shadowColor: "#FF6B4A",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-base font-nunito-bold text-white text-center">
                  Se connecter
                </Text>
              )}
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
}
