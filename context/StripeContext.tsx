import React, { createContext, useContext, useState } from "react";
import { StripeProvider, useConfirmPayment } from "@stripe/stripe-react-native";
import { Alert } from "react-native";
import { stripeService } from "@/service/api/stripe";

// Remplacez par votre clé publique Stripe
const STRIPE_PUBLIC_KEY = "pk_test_VOTRE_CLE_PUBLIQUE";

type StripeContextType = {
  createPaymentIntent: (
    amount: number,
    currency: string
  ) => Promise<{ clientSecret: string }>;
  makeSubscription: (
    planId: string
  ) => Promise<{ clientSecret: string; subscriptionId: string }>;
  confirmPayment: (
    clientSecret: string,
    paymentMethodId: string
  ) => Promise<{ error?: any; paymentIntent?: any }>;
  handleNextAction: (clientSecret: string) => Promise<{ error?: any }>;
  isLoading: boolean;
};

const StripeContext = createContext<StripeContextType | null>(null);

export const useStripe = () => {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error("useStripe doit être utilisé avec un StripeProvider");
  }
  return context;
};

export const StripeContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    confirmPayment: stripeConfirmPayment,
    handleNextAction: stripeHandleNextAction,
  } = useConfirmPayment();

  // Créer une intention de paiement unique en utilisant le service
  const createPaymentIntent = async (
    amount: number,
    currency: string = "eur"
  ) => {
    try {
      setIsLoading(true);
      const response = await stripeService.createPaymentIntent(
        amount,
        currency
      );
      return response;
    } catch (error) {
      console.error(
        "Erreur lors de la création de l'intention de paiement",
        error
      );
      Alert.alert("Erreur", "Impossible de créer l'intention de paiement");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Créer un abonnement en utilisant le service
  const makeSubscription = async (planId: string) => {
    try {
      setIsLoading(true);
      const response = await stripeService.createSubscription(planId);
      return response;
    } catch (error) {
      console.error("Erreur lors de la création de l'abonnement", error);
      Alert.alert("Erreur", "Impossible de créer l'abonnement");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Confirmer le paiement
  const confirmPayment = async (
    clientSecret: string,
    paymentMethodId: string
  ) => {
    try {
      setIsLoading(true);
      const { error, paymentIntent } = await stripeConfirmPayment(
        clientSecret,
        {
          paymentMethodType: "card",
          paymentMethod: paymentMethodId,
        }
      );
      return { error, paymentIntent };
    } catch (error) {
      console.error("Erreur lors de la confirmation du paiement", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer l'action suivante (3D Secure)
  const handleNextAction = async (clientSecret: string) => {
    try {
      setIsLoading(true);
      const { error } = await stripeHandleNextAction(clientSecret);
      return { error };
    } catch (error) {
      console.error("Erreur lors du traitement de l'action suivante", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    createPaymentIntent,
    makeSubscription,
    confirmPayment,
    handleNextAction,
    isLoading,
  };

  return (
    <StripeProvider publishableKey={STRIPE_PUBLIC_KEY}>
      <StripeContext.Provider value={value}>{children}</StripeContext.Provider>
    </StripeProvider>
  );
};
