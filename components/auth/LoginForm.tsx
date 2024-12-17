import React, { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { authService } from "@/service/api/auth";
import { matchesService } from "@/service/api/matching";
import { useMatches } from "@/context/MatchesContext";
import { useAuth } from "@/context/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { authStorage } from "@/service/auth/storage";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const { setMatches } = useMatches();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      setError("");
      setMessage("");
      setLoading(true);

      const userData = await authService.login({
        email,
        password,
      });

      setMessage("Connexion réussie !");

      if (!userData.authentication_token) {
        throw new Error("Token d'authentification manquant dans la réponse");
      }

      await login(userData);
      await authService.getCurrentUser();
      const matchesData = await matchesService.getMatches();
      setMatches(matchesData);
      router.replace("/(tabs)/matches");
    } catch (err) {
      console.error("Erreur connexion:", err);
      setError("Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#12171b] p-6 justify-between">
      <View className="flex-row items-center mb-6 mt-12 relative">
        <TouchableOpacity
          onPress={() => router.replace("/")}
          className="absolute left-0 z-10"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-white w-full text-center">
          Connexion
        </Text>
      </View>

      <View className="w-full space-y-4">
        <TextInput
          className={`w-full border rounded-lg p-4 bg-gray text-white ${
            focusedInput === "email" ? "border-green" : "border-gray"
          }`}
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          onFocus={() => setFocusedInput("email")}
          onBlur={() => setFocusedInput(null)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          className={`w-full border rounded-lg p-4 bg-gray text-white ${
            focusedInput === "password" ? "border-green" : "border-gray"
          }`}
          placeholder="Mot de passe"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          onFocus={() => setFocusedInput("password")}
          onBlur={() => setFocusedInput(null)}
          secureTextEntry
        />

        {error ? (
          <Text className="text-red-500 text-center">{error}</Text>
        ) : null}
      </View>

      <View className="space-y-3 mb-12 px-8">
        <Pressable
          className={`bg-green py-3 rounded-full items-center ${
            loading ? "opacity-70" : ""
          }`}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#1a2126" />
          ) : (
            <Text className="text-sm font-semibold text-dark">
              Se connecter
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
