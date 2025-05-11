import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { stripeService } from "@/service/api/stripe";
import { useAuth } from "@/context/AuthContext";

type SubscriptionStatus =
  | "active"
  | "cancelled"
  | "past_due"
  | "trialing"
  | "incomplete"
  | null;

type SubscriptionDetails = {
  id: string;
  status: SubscriptionStatus;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  plan: {
    id: string;
    name: string;
    amount: number;
    interval: string;
  };
  paymentMethod: {
    brand: string;
    last4: string;
  };
};

type PaymentHistoryItem = {
  id: string;
  amount: number;
  date: string;
  status: "succeeded" | "failed" | "pending";
  description: string;
};

export default function SubscriptionManagement() {
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(
    null
  );
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const { user, updateUserSubscriptionPlan } = useAuth();

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      setIsLoading(true);
      const history = await stripeService.getPaymentHistory();
      setPaymentHistory(history.payments || []);

      if (history.subscription) {
        setSubscription(history.subscription);
      }
    } catch (error) {
      console.error(
        "Erreur lors du chargement des données d'abonnement:",
        error
      );
      Alert.alert(
        "Erreur",
        "Impossible de charger les informations de votre abonnement"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    Alert.alert(
      "Annuler l'abonnement",
      "Êtes-vous sûr de vouloir annuler votre abonnement ? Vous pourrez continuer à utiliser Premium jusqu'à la fin de la période en cours.",
      [
        { text: "Non", style: "cancel" },
        {
          text: "Oui, annuler",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoading(true);
              await stripeService.cancelSubscription(subscription.id);

              // Mise à jour locale de l'état de l'abonnement
              setSubscription((prev) =>
                prev
                  ? {
                      ...prev,
                      cancelAtPeriodEnd: true,
                    }
                  : null
              );

              Alert.alert(
                "Abonnement annulé",
                "Votre abonnement sera actif jusqu'à la fin de la période en cours."
              );
            } catch (error) {
              console.error(
                "Erreur lors de l'annulation de l'abonnement:",
                error
              );
              Alert.alert(
                "Erreur",
                "Impossible d'annuler votre abonnement pour le moment"
              );
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return (amount / 100).toFixed(2).replace(".", ",") + " €";
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#8101f7" />
        <Text className="text-white mt-4 font-kanit">
          Chargement des informations...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background pt-10">
      <View className="px-5">
        <View className="flex-row items-center mb-6">
          <Pressable
            onPress={() => router.back()}
            className="bg-[#1e2429] p-2 rounded-xl mr-3"
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </Pressable>
          <Text className="text-2xl font-kanit-semibold text-white">
            Mon abonnement
          </Text>
        </View>

        {/* Statut de l'abonnement */}
        <View className="bg-[#1a1f24] p-5 rounded-xl mb-6">
          {subscription ? (
            <>
              <View className="flex-row justify-between items-center mb-4">
                <View className="flex-row items-center">
                  <Ionicons name="diamond" size={24} color="#8101f7" />
                  <Text className="text-xl font-kanit-semibold text-white ml-2">
                    RunMate Premium
                  </Text>
                </View>
                <View
                  className={`px-3 py-1 rounded-full ${
                    subscription.status === "active"
                      ? "bg-green-500/20"
                      : "bg-yellow-500/20"
                  }`}
                >
                  <Text
                    className={`text-xs font-kanit-bold ${
                      subscription.status === "active"
                        ? "text-green-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {subscription.status === "active"
                      ? "Actif"
                      : subscription.cancelAtPeriodEnd
                      ? "Se termine bientôt"
                      : subscription.status === "past_due"
                      ? "Paiement en retard"
                      : "En attente"}
                  </Text>
                </View>
              </View>

              <View className="mb-4">
                <Text className="text-white font-kanit-semibold mb-1">
                  Forfait
                </Text>
                <Text className="text-gray-300 font-kanit">
                  {subscription.plan.name} -{" "}
                  {formatCurrency(subscription.plan.amount)} /{" "}
                  {subscription.plan.interval === "month" ? "mois" : "an"}
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-white font-kanit-semibold mb-1">
                  Moyen de paiement
                </Text>
                <View className="flex-row items-center">
                  <Ionicons
                    name={
                      subscription.paymentMethod?.brand === "visa"
                        ? "card"
                        : subscription.paymentMethod?.brand === "mastercard"
                        ? "card"
                        : "card-outline"
                    }
                    size={16}
                    color="#fff"
                  />
                  <Text className="text-gray-300 font-kanit ml-2">
                    {subscription.paymentMethod?.brand.toUpperCase()} ****{" "}
                    {subscription.paymentMethod?.last4}
                  </Text>
                </View>
              </View>

              <View className="mb-4">
                <Text className="text-white font-kanit-semibold mb-1">
                  Prochain renouvellement
                </Text>
                <Text className="text-gray-300 font-kanit">
                  {subscription.cancelAtPeriodEnd
                    ? `Se termine le ${formatDate(
                        subscription.currentPeriodEnd
                      )}`
                    : `Le ${formatDate(subscription.currentPeriodEnd)}`}
                </Text>
              </View>

              {!subscription.cancelAtPeriodEnd && (
                <Pressable
                  onPress={handleCancelSubscription}
                  className="bg-[#2a3238] py-3 rounded-xl items-center mt-2"
                >
                  <Text className="text-white font-kanit">
                    Annuler l'abonnement
                  </Text>
                </Pressable>
              )}
            </>
          ) : (
            <View className="items-center py-6">
              <Ionicons
                name="diamond-outline"
                size={40}
                color="#8101f7"
                className="mb-4"
              />
              <Text className="text-white text-center font-kanit-semibold text-lg mb-3">
                Vous n'avez pas d'abonnement actif
              </Text>
              <Text className="text-gray-300 text-center font-kanit mb-5">
                Découvrez tous les avantages de RunMate Premium
              </Text>
              <Pressable
                onPress={() => router.push("/premium")}
                className="bg-purple px-6 py-3 rounded-xl"
              >
                <Text className="text-white font-kanit-bold">
                  Devenir Premium
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Historique de paiements */}
        {paymentHistory.length > 0 && (
          <View className="mb-10">
            <Text className="text-xl font-kanit-semibold text-white mb-4">
              Historique des paiements
            </Text>

            <View className="bg-[#1a1f24] rounded-xl overflow-hidden">
              {paymentHistory.map((payment, index) => (
                <View
                  key={payment.id}
                  className={`p-4 flex-row justify-between items-center ${
                    index !== paymentHistory.length - 1
                      ? "border-b border-gray-800"
                      : ""
                  }`}
                >
                  <View>
                    <Text className="text-white font-kanit mb-1">
                      {payment.description}
                    </Text>
                    <Text className="text-gray-400 font-kanit text-xs">
                      {formatDate(payment.date)}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text
                      className={`font-kanit-semibold mr-2 ${
                        payment.status === "succeeded"
                          ? "text-white"
                          : payment.status === "pending"
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    >
                      {formatCurrency(payment.amount)}
                    </Text>
                    <Ionicons
                      name={
                        payment.status === "succeeded"
                          ? "checkmark-circle"
                          : payment.status === "pending"
                          ? "time"
                          : "close-circle"
                      }
                      size={16}
                      color={
                        payment.status === "succeeded"
                          ? "#10b981"
                          : payment.status === "pending"
                          ? "#f59e0b"
                          : "#ef4444"
                      }
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
