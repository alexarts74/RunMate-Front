import { OrganizerProfile } from "@/interface/User";
import { apiClient } from "./client";

export interface CreateOrganizerProfileData {
  organization_name: string;
  organization_type: "association" | "club_sportif" | "entreprise" | "collectif" | "autre";
  description?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  city: string;
  department: string;
  postcode?: string;
  country?: string;
}

class OrganizerProfileService {
  async getProfile(): Promise<OrganizerProfile> {
    try {
      const response = await apiClient.get("/organizer_profiles");
      return response.profile;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error("Cette action est réservée aux organisateurs");
      }
      console.error("Erreur lors de la récupération du profil organisateur:", error);
      throw error;
    }
  }

  async createProfile(profileData: CreateOrganizerProfileData): Promise<OrganizerProfile> {
    try {
      const response = await apiClient.post("/organizer_profiles", {
        organizer_profile: profileData,
      });
      return response.profile;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error("Cette action est réservée aux organisateurs");
      }
      if (error.response?.status === 422) {
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Erreur de validation lors de la création du profil";
        throw new Error(errorMessage);
      }
      console.error("Erreur lors de la création du profil organisateur:", error);
      throw error;
    }
  }

  async updateProfile(profileData: CreateOrganizerProfileData): Promise<OrganizerProfile> {
    try {
      const response = await apiClient.put("/organizer_profiles", {
        organizer_profile: profileData,
      });
      return response.profile;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error("Cette action est réservée aux organisateurs");
      }
      if (error.response?.status === 422) {
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Erreur de validation lors de la mise à jour du profil";
        throw new Error(errorMessage);
      }
      console.error("Erreur lors de la mise à jour du profil organisateur:", error);
      throw error;
    }
  }
}

export const organizerProfileService = new OrganizerProfileService();

