import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { useStripe as useStripeContext } from "@/context/StripeContext";
import { useStripe } from "@stripe/stripe-react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import WarmBackground from "@/components/ui/WarmBackground";
import GlassCard from "@/components/ui/GlassCard";
import GlassButton from "@/components/ui/GlassButton";
import GlassInput from "@/components/ui/GlassInput";
import PulseLoader from "@/components/ui/PulseLoader";
import { useThemeColors, palette } from "@/constants/theme";

// Types d'abonnements disponibles
const subscriptionPlans = [
  {
    id: "price_monthly",
    name: "Abonnement Premium Mensuel",
    price: "4,99€",
    description: "Accès illimité à toutes les fonctionnalités premium",
    features: [
      "Accès aux groupes de course",
      "Filtres avancés pour les matches",
      "Notifications prioritaires",
      "Support premium",
    ],
  },
  {
    id: "price_yearly",
    name: "Abonnement Premium Annuel",
    price: "49,99€",
    description: "Accès illimité à toutes les fonctionnalités premium",
    features: [
      "Accès aux groupes de course",
      "Filtres avancés pour les matches",
      "Notifications prioritaires",
      "Support premium",
    ],
  },
];

// Interface pour gérer les détails de carte
interface CardDetails {
  number: string;
  expMonth: string;
  expYear: string;
  cvc: string;
}

export default function PaymentScreen() {
  const [selectedPlan, setSelectedPlan] = useState(subscriptionPlans[0]);
  const {
    createToken,
    makeSubscription,
    confirmPayment,
    handleNextAction,
    isLoading,
  } = useStripeContext();
  const { createPaymentMethod } = useStripe();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    number: "",
    expMonth: "",
    expYear: "",
    cvc: "",
  });
  const { colors, shadows } = useThemeColors();

  // Validation basique des champs de carte
  const isCardValid = () => {
    return (
      cardDetails.number.replace(/\s/g, "").length === 16 &&
      cardDetails.expMonth.length === 2 &&
      cardDetails.expYear.length === 2 &&
      cardDetails.cvc.length === 3
    );
  };

  const handlePayPress = async () => {
    if (!isCardValid()) {
      Alert.alert(
        "Erreur",
        "Veuillez compléter correctement les informations de votre carte"
      );
      return;
    }

    try {
      setIsProcessing(true);

      // Pour le développement, utiliser un token de test
      // En production, vous devrez implémenter createToken côté client
      const isDevelopment = __DEV__;
      let tokenToUse;

      if (isDevelopment) {
        // Token de test pour le développement
        tokenToUse = "tok_visa";
        console.log(
          "Mode développement - Utilisation du token de test:",
          tokenToUse
        );
      } else {
        // En production, créer un vrai token avec les détails de la carte
        try {
          const tokenResponse = await createToken(cardDetails);
          tokenToUse = tokenResponse.id;
          console.log("Token créé pour la production:", tokenToUse);
        } catch (error) {
          console.error("Erreur lors de la création du token:", error);
          throw new Error("Impossible de créer le token de paiement");
        }
      }

      // 1. Créer l'abonnement avec le token
      const response = await makeSubscription(selectedPlan.id, {
        token: tokenToUse,
      });
      console.log("Réponse complète:", response);

      // Vérifier le statut de l'abonnement
      const { subscription_status: subscriptionStatus } = response;
      console.log("Statut de l'abonnement:", subscriptionStatus);

      if (!subscriptionStatus) {
        throw new Error(
          "Impossible d'obtenir le statut de l'abonnement. Veuillez réessayer."
        );
      }

      // 3. Vérifier le statut de l'abonnement
      console.log("Vérification du statut de l'abonnement...");

      if (
        subscriptionStatus === "active" ||
        subscriptionStatus === "incomplete"
      ) {
        // Le paiement est réussi (incomplete est normal pour un premier paiement)
        Alert.alert(
          "Paiement réussi",
          "Votre abonnement premium est maintenant actif !",
          [{ text: "OK", onPress: () => router.back() }]
        );
      } else {
        throw new Error("Le paiement n'a pas pu être traité correctement.");
      }

      // Le paiement est géré par le backend
      console.log("Paiement envoyé au backend pour traitement");
    } catch (error: any) {
      console.error("Erreur détaillée lors du processus de paiement:", error);
      Alert.alert(
        "Erreur",
        error.message || "Une erreur est survenue lors du processus de paiement"
      );
    } finally {
      setIsProcessing(false);
      console.log("Fin du processus de paiement");
    }
  };

  // Gestion des mises à jour de carte
  const updateCardField = (field: keyof CardDetails, value: string) => {
    setCardDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Formatage du numéro de carte avec des espaces
  const formatCardNumber = (input: string) => {
    const numberOnly = input.replace(/\D/g, "");
    const formatted = numberOnly.replace(/(\d{4})/g, "$1 ").trim();
    return formatted.substring(0, 19); // 16 chiffres + 3 espaces
  };

  return (
    <WarmBackground>
      <ScrollView className="flex-1 pt-16">
        <View className="px-5">
          <View className="flex-row items-center mb-6">
            <Pressable
              onPress={() => router.back()}
              className="p-2 rounded-xl mr-3"
              style={{ backgroundColor: colors.glass.light }}
            >
              <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
            </Pressable>
            <Text style={{ color: colors.text.primary }} className="text-2xl font-nunito-semibold text-center">
              RunMate Premium
            </Text>
          </View>

          <Text style={{ color: colors.text.secondary }} className="mb-5 font-nunito">
            Devenez Premium et accédez à toutes les fonctionnalités de RunMate
          </Text>

          {/* Plans d'abonnement - Affichage des deux options */}
          <View style={{ gap: 16 }} className="mb-8">
            {subscriptionPlans.map((plan, index) => (
              <Pressable
                key={plan.id}
                onPress={() => setSelectedPlan(plan)}
              >
                <GlassCard
                  variant={selectedPlan.id === plan.id ? "medium" : "light"}
                  style={{
                    borderWidth: 2,
                    borderColor: selectedPlan.id === plan.id
                      ? colors.primary.DEFAULT
                      : colors.glass.border,
                  }}
                >
                  <View className="flex-row justify-between items-center mb-2">
                    <Text style={{ color: colors.text.primary }} className="text-lg font-nunito-semibold">
                      {plan.name}
                    </Text>
                    <View className="flex-row items-center">
                      <Text style={{ color: colors.text.primary }} className="text-lg font-nunito-bold">
                        {plan.price}
                      </Text>
                    </View>
                  </View>

                  <Text style={{ color: colors.text.secondary }} className="mb-3 font-nunito">
                    {plan.description}
                  </Text>

                  {plan.features.map((feature, featureIndex) => (
                    <View key={featureIndex} className="flex-row items-center mb-1">
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color={selectedPlan.id === plan.id ? colors.primary.DEFAULT : colors.text.tertiary}
                      />
                      <Text style={{ color: colors.text.primary }} className="ml-2 font-nunito">{feature}</Text>
                    </View>
                  ))}

                  {index === 0 && (
                    <View
                      className="absolute -top-2 -right-2 px-2 py-1 rounded-md"
                      style={{ backgroundColor: colors.primary.DEFAULT }}
                    >
                      <Text className="text-xs font-nunito-bold text-white">
                        Populaire
                      </Text>
                    </View>
                  )}

                  {index === 1 && (
                    <View
                      className="absolute -top-2 -right-2 px-2 py-1 rounded-md"
                      style={{ backgroundColor: colors.primary.dark }}
                    >
                      <Text className="text-xs font-nunito-bold text-white">
                        Économisez 17%
                      </Text>
                    </View>
                  )}
                </GlassCard>
              </Pressable>
            ))}
          </View>

          {/* Zone de saisie de carte bancaire personnalisée */}
          <Text style={{ color: colors.text.primary }} className="mb-4 font-nunito-semibold">
            Informations de paiement
          </Text>

          <GlassCard style={{ marginBottom: 32 }}>
            {/* Numéro de carte */}
            <View className="mb-4">
              <Text style={{ color: colors.text.primary }} className="mb-2 font-nunito">Numéro de carte</Text>
              <TextInput
                className="rounded-md p-2"
                style={{
                  backgroundColor: colors.surface,
                  color: colors.text.primary,
                }}
                placeholder="4242 4242 4242 4242"
                placeholderTextColor={colors.text.tertiary}
                keyboardType="numeric"
                maxLength={19}
                value={cardDetails.number}
                onChangeText={(text) =>
                  updateCardField("number", formatCardNumber(text))
                }
              />
            </View>

            {/* Date d'expiration et CVC côte à côte */}
            <View className="flex-row items-center">
              <View className="flex-1 mr-2">
                <Text style={{ color: colors.text.primary }} className="mb-2 font-nunito">Mois (MM)</Text>
                <TextInput
                  className="rounded-md p-2"
                  style={{
                    backgroundColor: colors.surface,
                    color: colors.text.primary,
                  }}
                  placeholder="MM"
                  placeholderTextColor={colors.text.tertiary}
                  keyboardType="numeric"
                  maxLength={2}
                  value={cardDetails.expMonth}
                  onChangeText={(text) => updateCardField("expMonth", text)}
                />
              </View>

              <View className="flex-1 mr-2">
                <Text style={{ color: colors.text.primary }} className="mb-2 font-nunito">Année (AA)</Text>
                <TextInput
                  className="rounded-md p-2"
                  style={{
                    backgroundColor: colors.surface,
                    color: colors.text.primary,
                  }}
                  placeholder="AA"
                  placeholderTextColor={colors.text.tertiary}
                  keyboardType="numeric"
                  maxLength={2}
                  value={cardDetails.expYear}
                  onChangeText={(text) => updateCardField("expYear", text)}
                />
              </View>

              <View className="flex-1">
                <Text style={{ color: colors.text.primary }} className="mb-2 font-nunito">CVC</Text>
                <TextInput
                  className="rounded-md p-2"
                  style={{
                    backgroundColor: colors.surface,
                    color: colors.text.primary,
                  }}
                  placeholder="123"
                  placeholderTextColor={colors.text.tertiary}
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry={true}
                  value={cardDetails.cvc}
                  onChangeText={(text) => updateCardField("cvc", text)}
                />
              </View>
            </View>
          </GlassCard>

          {/* Instructions de test */}
          <Text style={{ color: colors.text.tertiary }} className="text-xs mb-4 font-nunito">
            Pour tester, utilisez le numéro 4242 4242 4242 4242, une date future
            (01/25), et un code CVC quelconque (123).
          </Text>

          <GlassButton
            title={`Payer ${selectedPlan.price}`}
            onPress={handlePayPress}
            loading={isProcessing || isLoading}
            disabled={isProcessing || isLoading}
            size="lg"
          />

          <View className="flex-row items-center justify-center mt-4 mb-10">
            <Ionicons name="lock-closed" size={14} color={colors.primary.DEFAULT} />
            <Text style={{ color: colors.text.tertiary }} className="ml-1 font-nunito text-sm">
              Paiement sécurisé via Stripe
            </Text>
          </View>
        </View>
      </ScrollView>
    </WarmBackground>
  );
}
