import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
} from "react-native";
import { useConfirmPayment } from "@stripe/stripe-react-native";
import { useStripe } from "@/context/StripeContext";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

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
  // État pour les champs de carte manuels
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    number: "",
    expMonth: "",
    expYear: "",
    cvc: "",
  });

  const [selectedPlan, setSelectedPlan] = useState(subscriptionPlans[0]);
  const { makeSubscription, isLoading } = useStripe();
  const { confirmPayment } = useConfirmPayment();
  const [isProcessing, setIsProcessing] = useState(false);

  const { user, updateUserSubscriptionPlan } = useAuth();

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
      const { clientSecret, subscriptionId } = await makeSubscription(
        selectedPlan.id
      );

      try {
        // Pour les besoins de ce test, nous simulons un paiement réussi
        // Dans une implémentation réelle, vous utiliseriez confirmPayment

        console.log("Paiement simulé avec succès pour:", subscriptionId);

        // Afficher l'alerte de succès
        Alert.alert(
          "Paiement réussi",
          "Votre abonnement premium est maintenant actif !",
          [{ text: "OK", onPress: () => router.back() }]
        );
      } catch (confirmError) {
        console.error(
          "Erreur lors de la confirmation du paiement",
          confirmError
        );
        Alert.alert(
          "Erreur",
          "Impossible de confirmer le paiement, veuillez réessayer"
        );
      }
    } catch (error) {
      console.error("Erreur lors du processus de paiement", error);
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors du processus de paiement"
      );
    } finally {
      setIsProcessing(false);
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
    <ScrollView className="flex-1 bg-background pt-16">
      <View className="px-5">
        <View className="flex-row items-center mb-6">
          <Pressable
            onPress={() => router.back()}
            className="bg-[#1e2429] p-2 rounded-xl mr-3"
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </Pressable>
          <Text className="text-2xl font-kanit-semibold text-center text-white">
            RunMate Premium
          </Text>
        </View>

        <Text className="text-white mb-5 font-kanit">
          Devenez Premium et accédez à toutes les fonctionnalités de RunMate
        </Text>

        {/* Plans d'abonnement - Affichage des deux options */}
        <View className="space-y-4 mb-8">
          {subscriptionPlans.map((plan, index) => (
            <Pressable
              key={plan.id}
              onPress={() => setSelectedPlan(plan)}
              className={`p-4 rounded-xl border-2 ${
                selectedPlan.id === plan.id
                  ? "border-purple bg-purple/10"
                  : "border-gray-700 bg-[#1a1f24]"
              }`}
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-lg font-kanit-semibold text-white">
                  {plan.name}
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-lg font-kanit-bold text-white">
                    {plan.price}
                  </Text>
                </View>
              </View>

              <Text className="text-gray-300 mb-3 font-kanit">
                {plan.description}
              </Text>

              {plan.features.map((feature, featureIndex) => (
                <View key={featureIndex} className="flex-row items-center mb-1">
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={selectedPlan.id === plan.id ? "#8101f7" : "#6B7280"}
                  />
                  <Text className="text-white ml-2 font-kanit">{feature}</Text>
                </View>
              ))}

              {index === 0 && (
                <View className="absolute -top-2 -right-2 bg-purple px-2 py-1 rounded-md">
                  <Text className="text-xs font-kanit-bold text-white">
                    Populaire
                  </Text>
                </View>
              )}

              {index === 1 && (
                <View className="absolute -top-2 -right-2 bg-purple px-2 py-1 rounded-md">
                  <Text className="text-xs font-kanit-bold text-white">
                    Économisez 17%
                  </Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>

        {/* Zone de saisie de carte bancaire personnalisée */}
        <Text className="text-white mb-4 font-kanit-semibold">
          Informations de paiement
        </Text>

        <View className="bg-[#1a1f24] rounded-xl p-4 mb-8">
          {/* Numéro de carte */}
          <View className="mb-4">
            <Text className="text-white mb-2 font-kanit">Numéro de carte</Text>
            <TextInput
              className="bg-[#2a3238] text-white rounded-md p-2"
              placeholder="4242 4242 4242 4242"
              placeholderTextColor="#6B7280"
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
              <Text className="text-white mb-2 font-kanit">Mois (MM)</Text>
              <TextInput
                className="bg-[#2a3238] text-white rounded-md p-2"
                placeholder="MM"
                placeholderTextColor="#6B7280"
                keyboardType="numeric"
                maxLength={2}
                value={cardDetails.expMonth}
                onChangeText={(text) => updateCardField("expMonth", text)}
              />
            </View>

            <View className="flex-1 mr-2">
              <Text className="text-white mb-2 font-kanit">Année (AA)</Text>
              <TextInput
                className="bg-[#2a3238] text-white rounded-md p-2"
                placeholder="AA"
                placeholderTextColor="#6B7280"
                keyboardType="numeric"
                maxLength={2}
                value={cardDetails.expYear}
                onChangeText={(text) => updateCardField("expYear", text)}
              />
            </View>

            <View className="flex-1">
              <Text className="text-white mb-2 font-kanit">CVC</Text>
              <TextInput
                className="bg-[#2a3238] text-white rounded-md p-2"
                placeholder="123"
                placeholderTextColor="#6B7280"
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry={true}
                value={cardDetails.cvc}
                onChangeText={(text) => updateCardField("cvc", text)}
              />
            </View>
          </View>
        </View>

        {/* Instructions de test */}
        <Text className="text-gray-400 text-xs mb-4 font-kanit">
          Pour tester, utilisez le numéro 4242 4242 4242 4242, une date future
          (01/25), et un code CVC quelconque (123).
        </Text>

        <Pressable
          onPress={handlePayPress}
          disabled={isProcessing || isLoading}
          className={`bg-purple rounded-xl py-4 items-center ${
            isProcessing || isLoading ? "opacity-70" : ""
          }`}
        >
          {isProcessing || isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-kanit-bold text-lg">
              Payer {selectedPlan.price}
            </Text>
          )}
        </Pressable>

        <View className="flex-row items-center justify-center mt-4 mb-10">
          <Ionicons name="lock-closed" size={14} color="#8101f7" />
          <Text className="text-gray-400 ml-1 font-kanit text-sm">
            Paiement sécurisé via Stripe
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
