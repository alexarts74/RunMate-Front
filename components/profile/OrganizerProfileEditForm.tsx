import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { organizerProfileService, CreateOrganizerProfileData } from "@/service/api/organizerProfile";
import { OrganizerProfile } from "@/interface/User";
import { useThemeColors, typography, radii, spacing } from "@/constants/theme";
import GlassInput from "@/components/ui/GlassInput";
import GlassButton from "@/components/ui/GlassButton";
import WarmBackground from "@/components/ui/WarmBackground";
import PulseLoader from "@/components/ui/PulseLoader";

type OrganizerProfileEditFormProps = {
  setIsEditing: (value: boolean) => void;
};

const organizationTypeOptions = [
  { key: "association", value: "Association" },
  { key: "club_sportif", value: "Club sportif" },
  { key: "entreprise", value: "Entreprise" },
  { key: "collectif", value: "Collectif" },
  { key: "autre", value: "Autre" },
];

export function OrganizerProfileEditForm({ setIsEditing }: OrganizerProfileEditFormProps) {
  const { colors, shadows } = useThemeColors();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [existingProfile, setExistingProfile] = useState<OrganizerProfile | null>(null);
  const [formData, setFormData] = useState<CreateOrganizerProfileData>({
    organization_name: "",
    organization_type: "association",
    description: "",
    website: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    department: "",
    postcode: "",
    country: "France",
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await organizerProfileService.getProfile();
        if (profile) {
          setExistingProfile(profile);
          setFormData({
            organization_name: profile.organization_name || "",
            organization_type: profile.organization_type || "association",
            description: profile.description || "",
            website: profile.website || "",
            phone: profile.phone || "",
            email: profile.email || "",
            address: profile.address || "",
            city: profile.city || "",
            department: profile.department || "",
            postcode: profile.postcode || "",
            country: profile.country || "France",
            latitude: profile.latitude || null,
            longitude: profile.longitude || null,
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (name: keyof CreateOrganizerProfileData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async () => {
    if (!formData.organization_name.trim()) {
      setError("Le nom de l'organisation est requis");
      return;
    }

    if (!formData.city.trim()) {
      setError("La ville est requise");
      return;
    }

    if (!formData.department.trim()) {
      setError("Le departement est requis");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (existingProfile) {
        await organizerProfileService.updateProfile(formData);
      } else {
        await organizerProfileService.createProfile(formData);
      }
      setIsEditing(false);
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde:", error);
      setError(error.message || "Une erreur est survenue lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <WarmBackground style={styles.centeredContainer}>
        <PulseLoader size={10} />
        <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
          Chargement...
        </Text>
      </WarmBackground>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.flex}
    >
      <WarmBackground>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.title, { color: colors.text.primary }]}>
            {existingProfile ? "Modifier mon organisation" : "Creer mon organisation"}
          </Text>

          <View style={styles.fieldsContainer}>
            {/* Nom de l'organisation */}
            <GlassInput
              label="Nom de l'organisation *"
              placeholder="Nom de votre organisation"
              value={formData.organization_name}
              onChangeText={(value) => handleChange("organization_name", value)}
            />

            {/* Type d'organisation */}
            <View>
              <Text style={[styles.label, { color: colors.text.secondary }]}>
                Type d'organisation *
              </Text>
              <SelectList
                setSelected={(val: string) => handleChange("organization_type", val as CreateOrganizerProfileData["organization_type"])}
                data={organizationTypeOptions}
                save="key"
                defaultOption={organizationTypeOptions.find(opt => opt.key === formData.organization_type)}
                placeholder="Selectionnez le type"
                boxStyles={{
                  borderWidth: 1,
                  borderColor: colors.glass.border,
                  borderRadius: radii.md,
                  padding: 16,
                  backgroundColor: colors.glass.light,
                  ...shadows.sm,
                }}
                dropdownStyles={{
                  borderWidth: 1,
                  borderColor: colors.glass.border,
                  borderRadius: radii.md,
                  backgroundColor: colors.glass.light,
                  marginTop: 4,
                }}
                inputStyles={{ color: colors.text.primary, fontFamily: "Nunito-Medium" }}
                dropdownTextStyles={{ color: colors.text.primary, fontFamily: "Nunito-Medium" }}
                search={false}
              />
            </View>

            {/* Description */}
            <GlassInput
              label="Description"
              placeholder="Decrivez votre organisation..."
              value={formData.description}
              onChangeText={(value) => handleChange("description", value)}
              multiline
              numberOfLines={4}
              style={styles.multilineInput}
            />

            {/* Site web */}
            <GlassInput
              label="Site web"
              placeholder="https://www.example.com"
              value={formData.website}
              onChangeText={(value) => handleChange("website", value)}
              keyboardType="url"
              autoCapitalize="none"
            />

            {/* Email de contact */}
            <GlassInput
              label="Email de contact"
              placeholder="contact@example.com"
              value={formData.email}
              onChangeText={(value) => handleChange("email", value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Telephone */}
            <GlassInput
              label="Telephone"
              placeholder="01 23 45 67 89"
              value={formData.phone}
              onChangeText={(value) => handleChange("phone", value)}
              keyboardType="phone-pad"
            />

            {/* Separateur Localisation */}
            <View style={styles.separator}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                Localisation
              </Text>
              <View style={[styles.divider, { backgroundColor: colors.glass.border }]} />
            </View>

            {/* Adresse */}
            <GlassInput
              label="Adresse"
              placeholder="123 rue Example"
              value={formData.address}
              onChangeText={(value) => handleChange("address", value)}
            />

            {/* Code postal */}
            <GlassInput
              label="Code postal"
              placeholder="75001"
              value={formData.postcode}
              onChangeText={(value) => handleChange("postcode", value)}
              keyboardType="numeric"
            />

            {/* Ville */}
            <GlassInput
              label="Ville *"
              placeholder="Paris"
              value={formData.city}
              onChangeText={(value) => handleChange("city", value)}
            />

            {/* Departement */}
            <GlassInput
              label="Departement *"
              placeholder="Paris"
              value={formData.department}
              onChangeText={(value) => handleChange("department", value)}
            />

            {/* Pays */}
            <GlassInput
              label="Pays"
              placeholder="France"
              value={formData.country}
              onChangeText={(value) => handleChange("country", value)}
            />
          </View>

          {error ? (
            <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          ) : null}

          <View style={styles.buttonsContainer}>
            <GlassButton
              title="Enregistrer"
              onPress={handleSubmit}
              variant="primary"
              loading={loading}
              disabled={loading}
            />
            <GlassButton
              title="Annuler"
              onPress={() => setIsEditing(false)}
              variant="secondary"
            />
          </View>
        </ScrollView>
      </WarmBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 150,
  },
  title: {
    fontFamily: typography.h1.fontFamily,
    fontSize: typography.h1.fontSize,
    lineHeight: typography.h1.lineHeight,
    marginBottom: spacing.lg,
  },
  fieldsContainer: {
    gap: spacing.md,
  },
  label: {
    fontFamily: typography.label.fontFamily,
    fontSize: typography.label.fontSize,
    marginBottom: 6,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  separator: {
    paddingTop: spacing.md,
  },
  sectionTitle: {
    fontFamily: typography.h3.fontFamily,
    fontSize: typography.h3.fontSize,
    marginBottom: spacing.sm,
  },
  divider: {
    height: 1,
    marginBottom: spacing.md,
  },
  errorText: {
    fontFamily: typography.bodyMedium.fontFamily,
    fontSize: typography.body.fontSize,
    textAlign: "center",
    marginTop: spacing.md,
  },
  buttonsContainer: {
    gap: 12,
    marginTop: spacing.lg,
  },
  loadingText: {
    fontFamily: typography.bodyMedium.fontFamily,
    fontSize: typography.body.fontSize,
    marginTop: spacing.md,
  },
});
