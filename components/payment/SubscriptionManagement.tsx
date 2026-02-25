import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { stripeService } from "@/service/api/stripe";
import { useAuth } from "@/context/AuthContext";
import WarmBackground from "@/components/ui/WarmBackground";
import GlassCard from "@/components/ui/GlassCard";
import GlassButton from "@/components/ui/GlassButton";
import PulseLoader from "@/components/ui/PulseLoader";
import { useThemeColors, palette } from "@/constants/theme";

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
  const { colors, shadows } = useThemeColors();

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
      <WarmBackground>
        <View className="flex-1 justify-center items-center">
          <PulseLoader color={colors.primary.DEFAULT} size={12} />
          <Text style={{ color: colors.text.secondary }} className="mt-4 font-nunito">
            Chargement des informations...
          </Text>
        </View>
      </WarmBackground>
    );
  }

  return (
    <WarmBackground>
      <ScrollView className="flex-1 pt-10">
        <View className="px-5">
          <View className="flex-row items-center mb-6">
            <Pressable
              onPress={() => router.back()}
              className="p-2 rounded-xl mr-3"
              style={{ backgroundColor: colors.glass.light }}
            >
              <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
            </Pressable>
            <Text style={{ color: colors.text.primary }} className="text-2xl font-nunito-semibold">
              Mon abonnement
            </Text>
          </View>

          {/* Statut de l'abonnement */}
          <GlassCard variant="medium" style={{ marginBottom: 24 }}>
            {subscription ? (
              <>
                <View className="flex-row justify-between items-center mb-4">
                  <View className="flex-row items-center">
                    <Ionicons name="diamond" size={24} color={colors.primary.DEFAULT} />
                    <Text style={{ color: colors.text.primary }} className="text-xl font-nunito-semibold ml-2">
                      RunMate Premium
                    </Text>
                  </View>
                  <View
                    className="px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: subscription.status === "active"
                        ? 'rgba(124, 184, 138, 0.2)'
                        : 'rgba(229, 184, 103, 0.2)',
                    }}
                  >
                    <Text
                      className="text-xs font-nunito-bold"
                      style={{
                        color: subscription.status === "active"
                          ? colors.success
                          : colors.warning,
                      }}
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
                  <Text style={{ color: colors.text.primary }} className="font-nunito-semibold mb-1">
                    Forfait
                  </Text>
                  <Text style={{ color: colors.text.secondary }} className="font-nunito">
                    {subscription.plan.name} -{" "}
                    {formatCurrency(subscription.plan.amount)} /{" "}
                    {subscription.plan.interval === "month" ? "mois" : "an"}
                  </Text>
                </View>

                <View className="mb-4">
                  <Text style={{ color: colors.text.primary }} className="font-nunito-semibold mb-1">
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
                      color={colors.text.primary}
                    />
                    <Text style={{ color: colors.text.secondary }} className="font-nunito ml-2">
                      {subscription.paymentMethod?.brand.toUpperCase()} ****{" "}
                      {subscription.paymentMethod?.last4}
                    </Text>
                  </View>
                </View>

                <View className="mb-4">
                  <Text style={{ color: colors.text.primary }} className="font-nunito-semibold mb-1">
                    Prochain renouvellement
                  </Text>
                  <Text style={{ color: colors.text.secondary }} className="font-nunito">
                    {subscription.cancelAtPeriodEnd
                      ? `Se termine le ${formatDate(
                          subscription.currentPeriodEnd
                        )}`
                      : `Le ${formatDate(subscription.currentPeriodEnd)}`}
                  </Text>
                </View>

                {!subscription.cancelAtPeriodEnd && (
                  <GlassButton
                    title="Annuler l'abonnement"
                    onPress={handleCancelSubscription}
                    variant="ghost"
                    style={{ marginTop: 8 }}
                  />
                )}
              </>
            ) : (
              <View className="items-center py-6">
                <Ionicons
                  name="diamond-outline"
                  size={40}
                  color={colors.primary.DEFAULT}
                  style={{ marginBottom: 16 }}
                />
                <Text style={{ color: colors.text.primary }} className="text-center font-nunito-semibold text-lg mb-3">
                  Vous n'avez pas d'abonnement actif
                </Text>
                <Text style={{ color: colors.text.secondary }} className="text-center font-nunito mb-5">
                  Découvrez tous les avantages de RunMate Premium
                </Text>
                <GlassButton
                  title="Devenir Premium"
                  onPress={() => router.push("/premium")}
                />
              </View>
            )}
          </GlassCard>

          {/* Historique de paiements */}
          {paymentHistory.length > 0 && (
            <View className="mb-10">
              <Text style={{ color: colors.text.primary }} className="text-xl font-nunito-semibold mb-4">
                Historique des paiements
              </Text>

              <GlassCard noPadding>
                {paymentHistory.map((payment, index) => (
                  <View
                    key={payment.id}
                    className="p-4 flex-row justify-between items-center"
                    style={{
                      borderBottomWidth: index !== paymentHistory.length - 1 ? 1 : 0,
                      borderBottomColor: colors.glass.border,
                    }}
                  >
                    <View>
                      <Text style={{ color: colors.text.primary }} className="font-nunito mb-1">
                        {payment.description}
                      </Text>
                      <Text style={{ color: colors.text.tertiary }} className="font-nunito text-xs">
                        {formatDate(payment.date)}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Text
                        className="font-nunito-semibold mr-2"
                        style={{
                          color:
                            payment.status === "succeeded"
                              ? colors.text.primary
                              : payment.status === "pending"
                              ? colors.warning
                              : colors.error,
                        }}
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
                            ? colors.success
                            : payment.status === "pending"
                            ? colors.warning
                            : colors.error
                        }
                      />
                    </View>
                  </View>
                ))}
              </GlassCard>
            </View>
          )}
        </View>
      </ScrollView>
    </WarmBackground>
  );
}
