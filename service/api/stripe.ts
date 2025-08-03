import { apiClient } from "./client";
import { API_CONFIG } from "@/config/api";

// URL de base pour les endpoints Stripe (à remplacer par votre URL de backend)

export const stripeService = {
  /**
   * Crée une intention de paiement pour un montant donné
   * @param amount Montant en centimes (ex: 999 pour 9,99€)
   * @param currency Devise (par défaut EUR)
   * @returns Promise avec la clé secrète client
   */
  createPaymentIntent: async (amount: number, currency: string = "eur") => {
    try {
      return await apiClient.post("/payments/create-intent", {
        amount,
        currency,
      });
    } catch (error) {
      console.error(
        "Erreur lors de la création de l'intention de paiement:",
        error
      );
      throw error;
    }
  },

  /**
   * Crée un abonnement pour un plan donné
   * @param planId Identifiant du plan d'abonnement Stripe
   * @param cardDetails Détails de la carte bancaire
   * @returns Promise avec la clé secrète client et l'ID d'abonnement
   */
  createSubscription: async (planId: string, cardDetails?: any) => {
    console.log("planId", planId);
    try {
      const payload: any = { planId };
      if (cardDetails) {
        payload.cardDetails = cardDetails;
      }
      return await apiClient.post("/payments/create-subscription", payload);
    } catch (error) {
      console.error("Erreur lors de la création de l'abonnement:", error);
      throw error;
    }
  },

  /**
   * Récupère l'historique des paiements de l'utilisateur
   * @returns Promise avec l'historique des paiements
   */
  getPaymentHistory: async () => {
    try {
      return await apiClient.get("/payments/history");
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de l'historique des paiements:",
        error
      );
      throw error;
    }
  },

  /**
   * Annule un abonnement actif
   * @param subscriptionId Identifiant de l'abonnement à annuler
   * @returns Promise avec la confirmation d'annulation
   */
  cancelSubscription: async (subscriptionId: string) => {
    try {
      return await apiClient.post("/payments/cancel-subscription", {
        subscriptionId,
      });
    } catch (error) {
      console.error("Erreur lors de l'annulation de l'abonnement:", error);
      throw error;
    }
  },
};
