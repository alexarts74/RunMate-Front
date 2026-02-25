import React, { useState } from "react";
import {
  View,
  Pressable,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@/context/AuthContext";
import User from "@/interface/User";
import { useThemeColors, typography, radii, spacing } from "@/constants/theme";
import GlassInput from "@/components/ui/GlassInput";
import GlassButton from "@/components/ui/GlassButton";
import GlassAvatar from "@/components/ui/GlassAvatar";
import WarmBackground from "@/components/ui/WarmBackground";

type ProfileEditFormProps = {
  setIsEditing: (value: boolean) => void;
};

export function ProfileEditForm({ setIsEditing }: ProfileEditFormProps) {
  const { user, updateUser } = useAuth();
  const { colors, shadows } = useThemeColors();
  const [loading, setLoading] = useState(false);
  const [error] = useState("");
  const [formData, setFormData] = useState({
    email: user?.email || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    age: user?.age?.toString() || "",
    gender: user?.gender || "",
    profile_image: user?.profile_image || "",
    bio: user?.bio || "",
    location: user?.city || "",
    department: user?.department || "",
    level: user?.level || "beginner",
  });

  const handleChange = (name: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        handleChange("profile_image", result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erreur lors de la selection de l'image:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const userUpdate = {
        ...formData,
        age: parseInt(formData.age) || 0,
        city: formData.location || "",
        id: user?.id || 0,
        department: formData.department || "",
        level: formData.level || "beginner",
      } as User;

      await updateUser(userUpdate);
      setIsEditing(false);
      setLoading(true);
    } catch (error) {
      console.error("Erreur lors de la mise a jour:", error);
    } finally {
      setLoading(false);
    }
  };

  const genderOptions = [
    { key: "male", value: "Homme" },
    { key: "female", value: "Femme" },
    { key: "other", value: "Autre" },
  ];

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
            Modifier mon profil
          </Text>

          <Pressable onPress={pickImage} style={styles.avatarContainer}>
            <GlassAvatar
              uri={formData.profile_image || undefined}
              size={128}
              showRing
            />
            <Text style={[styles.changePhotoText, { color: colors.primary.DEFAULT }]}>
              Changer la photo
            </Text>
          </Pressable>

          <View style={styles.fieldsContainer}>
            <GlassInput
              label="Prenom"
              placeholder="Prenom"
              value={formData.first_name}
              onChangeText={(value) => handleChange("first_name", value)}
            />

            <GlassInput
              label="Nom"
              placeholder="Nom"
              value={formData.last_name}
              onChangeText={(value) => handleChange("last_name", value)}
            />

            <GlassInput
              label="Age"
              placeholder="Age"
              value={formData.age}
              onChangeText={(value) => handleChange("age", value)}
              keyboardType="numeric"
            />

            <View>
              <Text style={[styles.label, { color: colors.text.secondary }]}>
                Genre
              </Text>
              <SelectList
                setSelected={(val: string) => handleChange("gender", val)}
                data={genderOptions}
                save="key"
                defaultOption={{ key: formData.gender, value: formData.gender }}
                placeholder="Selectionnez votre genre"
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

            <GlassInput
              label="Bio"
              placeholder="Bio"
              value={formData.bio}
              onChangeText={(value) => handleChange("bio", value)}
              multiline
              numberOfLines={4}
              style={styles.bioInput}
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
  avatarContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  changePhotoText: {
    fontFamily: typography.label.fontFamily,
    fontSize: typography.label.fontSize,
    marginTop: 12,
  },
  fieldsContainer: {
    gap: spacing.md,
  },
  label: {
    fontFamily: typography.label.fontFamily,
    fontSize: typography.label.fontSize,
    marginBottom: 6,
  },
  bioInput: {
    minHeight: 80,
    textAlignVertical: "top",
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
});
