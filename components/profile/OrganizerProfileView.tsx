import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View, Text, Image, Pressable, ScrollView, Linking } from "react-native";
import { organizerProfileService } from "@/service/api/organizerProfile";
import { OrganizerProfile } from "@/interface/User";

const ACCENT = "#F97316";

type OrganizerProfileViewProps = {
  setIsEditing: (value: boolean) => void;
};

const organizationTypeLabels: { [key: string]: string } = {
  association: "Association",
  club_sportif: "Club sportif",
  entreprise: "Entreprise",
  collectif: "Collectif",
  autre: "Autre",
};

export function OrganizerProfileView({ setIsEditing }: OrganizerProfileViewProps) {
  const { user } = useAuth();
  const [organizerProfile, setOrganizerProfile] = useState<OrganizerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const profile = await organizerProfileService.getProfile();
        setOrganizerProfile(profile);
      } catch (error) {
        console.error("Erreur lors du chargement du profil organisateur:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.user_type === "organizer") {
      loadProfile();
    }
  }, [user]);

  const handleOpenWebsite = (url: string) => {
    if (url && !url.startsWith("http")) {
      Linking.openURL(`https://${url}`);
    } else if (url) {
      Linking.openURL(url);
    }
  };

  const handleCall = (phone: string) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const handleEmail = (email: string) => {
    if (email) {
      Linking.openURL(`mailto:${email}`);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-fond items-center justify-center">
        <Text className="text-gray-600 font-nunito-medium">Chargement...</Text>
      </View>
    );
  }

  if (!organizerProfile) {
    return (
      <View className="flex-1 bg-fond items-center justify-center px-6">
        <Ionicons name="business-outline" size={64} color="#9CA3AF" />
        <Text className="text-gray-900 font-nunito-bold text-xl mt-4 text-center">
          Aucun profil organisateur
        </Text>
        <Text className="text-gray-600 font-nunito-medium text-sm mt-2 text-center">
          Votre profil organisateur n'a pas encore été créé.
        </Text>
        <Pressable
          onPress={() => setIsEditing(true)}
          className="bg-primary px-6 py-3 rounded-full mt-6"
        >
          <Text className="text-white font-nunito-bold">Créer mon profil</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-fond px-6 py-6 pt-6 pb-24"
      contentContainerStyle={{ paddingBottom: 150 }}
    >
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-nunito-extrabold text-gray-900">Mon Organisation</Text>
        <Pressable
          onPress={() => setIsEditing(true)}
          className="flex-row items-center px-3 py-3 rounded-full bg-tertiary"
          style={{
            shadowColor: ACCENT,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Ionicons name="pencil" size={20} color={ACCENT} />
        </Pressable>
      </View>

      <View className="items-center mb-8">
        <View className="w-32 h-32 rounded-full border-4 border-primary bg-primary/10 items-center justify-center">
          <Ionicons name="business" size={64} color={ACCENT} />
        </View>
        <Text className="text-gray-900 font-nunito-extrabold text-xl mt-4 text-center">
          {organizerProfile.organization_name}
        </Text>
        <Text className="text-gray-600 font-nunito-medium text-sm mt-1">
          {organizationTypeLabels[organizerProfile.organization_type] || organizerProfile.organization_type}
        </Text>
      </View>

      <View className="space-y-4">
        {/* Description */}
        {organizerProfile.description && (
          <View>
            <Text className="text-gray-700 text-sm font-nunito-bold pl-2 mb-2">
              Description
            </Text>
            <View
              className="w-full border border-gray-200 rounded-2xl p-4 bg-white"
              style={{
                shadowColor: ACCENT,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text className="text-gray-900 font-nunito-medium">
                {organizerProfile.description}
              </Text>
            </View>
          </View>
        )}

        {/* Site web */}
        {organizerProfile.website && (
          <View>
            <Text className="text-gray-700 text-sm font-nunito-bold pl-2 mb-2">
              Site web
            </Text>
            <Pressable
              onPress={() => handleOpenWebsite(organizerProfile.website!)}
              className="w-full border border-gray-200 rounded-full p-4 bg-white flex-row items-center justify-between"
              style={{
                shadowColor: ACCENT,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <Text className="text-primary font-nunito-medium flex-1" numberOfLines={1}>
                {organizerProfile.website}
              </Text>
              <Ionicons name="open-outline" size={20} color={ACCENT} />
            </Pressable>
          </View>
        )}

        {/* Email de contact */}
        {organizerProfile.email && (
          <View>
            <Text className="text-gray-700 text-sm font-nunito-bold pl-2 mb-2">
              Email de contact
            </Text>
            <Pressable
              onPress={() => handleEmail(organizerProfile.email!)}
              className="w-full border border-gray-200 rounded-full p-4 bg-white flex-row items-center justify-between"
              style={{
                shadowColor: ACCENT,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <Text className="text-gray-900 font-nunito-medium flex-1" numberOfLines={1}>
                {organizerProfile.email}
              </Text>
              <Ionicons name="mail-outline" size={20} color={ACCENT} />
            </Pressable>
          </View>
        )}

        {/* Téléphone */}
        {organizerProfile.phone && (
          <View>
            <Text className="text-gray-700 text-sm font-nunito-bold pl-2 mb-2">
              Téléphone
            </Text>
            <Pressable
              onPress={() => handleCall(organizerProfile.phone!)}
              className="w-full border border-gray-200 rounded-full p-4 bg-white flex-row items-center justify-between"
              style={{
                shadowColor: ACCENT,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <Text className="text-gray-900 font-nunito-medium flex-1" numberOfLines={1}>
                {organizerProfile.phone}
              </Text>
              <Ionicons name="call-outline" size={20} color={ACCENT} />
            </Pressable>
          </View>
        )}

        {/* Adresse */}
        {(organizerProfile.address || organizerProfile.city) && (
          <View>
            <Text className="text-gray-700 text-sm font-nunito-bold pl-2 mb-2">
              Localisation
            </Text>
            <View
              className="w-full border border-gray-200 rounded-2xl p-4 bg-white"
              style={{
                shadowColor: ACCENT,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              {organizerProfile.address && (
                <Text className="text-gray-900 font-nunito-medium mb-1">
                  {organizerProfile.address}
                </Text>
              )}
              <Text className="text-gray-900 font-nunito-medium">
                {organizerProfile.postcode && `${organizerProfile.postcode} `}
                {organizerProfile.city}
                {organizerProfile.department && ` (${organizerProfile.department})`}
              </Text>
              {organizerProfile.country && (
                <Text className="text-gray-600 font-nunito-medium text-sm mt-1">
                  {organizerProfile.country}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Email du compte */}
        <View>
          <Text className="text-gray-700 text-sm font-nunito-bold pl-2 mb-2">
            Email du compte
          </Text>
          <View
            className="w-full border border-gray-200 rounded-full p-4 bg-white"
            style={{
              shadowColor: ACCENT,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            <Text className="text-gray-900 font-nunito-medium">{user?.email}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

