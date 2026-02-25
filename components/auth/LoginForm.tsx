import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
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
import WarmBackground from "@/components/ui/WarmBackground";
import GlassInput from "@/components/ui/GlassInput";
import GlassButton from "@/components/ui/GlassButton";
import { useThemeColors } from "@/constants/theme";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { errors, validateForm, clearErrors, setErrors } = useFormValidation();
  const { setMatches } = useMatches();
  const { login } = useAuth();
  const { registerForPushNotifications } = useNotifications();
  const { colors, shadows } = useThemeColors();

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

      await registerForPushNotifications();

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
      <WarmBackground>
        <ParticlesBackground />
        <SafeAreaView edges={["top"]} className="flex-1">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            className="px-6"
          >
            <View className="flex-row items-center mb-10 mt-8">
              <Pressable
                onPress={() => router.replace("/")}
                className="p-2.5 rounded-full active:opacity-80"
                style={{
                  backgroundColor: colors.glass.light,
                  ...shadows.sm,
                }}
              >
                <Ionicons
                  name="arrow-back"
                  size={20}
                  color={colors.primary.DEFAULT}
                />
              </Pressable>
              <View className="flex-1 items-center justify-center">
                <Text
                  className="text-3xl font-nunito-extrabold text-center"
                  style={{ color: colors.text.primary }}
                >
                  Content de te
                </Text>
                <Text
                  className="text-3xl font-nunito-extrabold text-center"
                  style={{ color: colors.primary.DEFAULT }}
                >
                  revoir !
                </Text>
              </View>
            </View>

            <View className="flex-1 justify-center">
              <View style={{ gap: 20 }}>
                <GlassInput
                  label="Email*"
                  placeholder="Email"
                  value={formData.email}
                  onChangeText={(value) => handleChange("email", value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email}
                  icon={
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={colors.primary.DEFAULT}
                    />
                  }
                />

                <GlassInput
                  label="Mot de passe*"
                  placeholder="Mot de passe"
                  value={formData.password}
                  onChangeText={(value) => handleChange("password", value)}
                  secureTextEntry
                  error={errors.password}
                  icon={
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={colors.primary.DEFAULT}
                    />
                  }
                />

                {errors.general && (
                  <Text
                    className="text-center font-nunito-medium text-sm"
                    style={{ color: colors.error }}
                  >
                    {errors.general}
                  </Text>
                )}
              </View>
            </View>

            <View className="mb-8">
              <GlassButton
                title="Se connecter"
                onPress={handleLogin}
                loading={loading}
                size="lg"
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </WarmBackground>
    </KeyboardAvoidingView>
  );
}
