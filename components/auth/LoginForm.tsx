import React, { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  Text,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { authService } from "@/service/api/auth";
import { matchesService } from "@/service/api/matching";
import { useMatches } from "@/context/MatchesContext";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
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

      await login(userData);

      const matchesData = await matchesService.getMatches({
        filter_pace: true,
        filter_distance: true,
        filter_availability: true,
      });

      setMatches(matchesData);

      router.replace("/(tabs)/Homepage");
    } catch (err) {
      console.error("Erreur connexion:", err);
      setError("Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-black p-6 justify-between">
      <View className="flex-1 justify-center items-center">
        <Text className="text-5xl font-bold text-white mb-2.5">
          RunMate
        </Text>
        <Text className="text-lg text-gray-300 text-center px-5 mb-12">
          Connectez-vous à votre compte
        </Text>

        <View className="w-full space-y-4">
          <TextInput
            className="w-full border border-gray-700 rounded-full p-4 bg-gray-900 text-white"
            placeholder="Email"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            className="w-full border border-gray-700 rounded-full p-4 bg-gray-900 text-white"
            placeholder="Mot de passe"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {error ? (
            <Text className="text-red-500 text-center">{error}</Text>
          ) : null}
        </View>
      </View>

      <View className="space-y-3 mb-12 px-8">
        <Pressable
          className={`bg-white py-3 rounded-full items-center ${
            loading ? "opacity-70" : ""
          }`}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-sm font-semibold text-dark">
              Se connecter
            </Text>
          )}
        </Pressable>

        <Pressable
          className="py-3 rounded-full items-center border border-white"
          onPress={() => router.push("/(auth)/signup")}
        >
          <Text className="text-sm font-semibold text-white">
            Créer un compte
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
