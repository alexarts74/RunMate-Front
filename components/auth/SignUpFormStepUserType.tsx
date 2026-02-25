import React from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useThemeColors } from "@/constants/theme";
import WarmBackground from "@/components/ui/WarmBackground";
import GlassCard from "@/components/ui/GlassCard";
import GlassButton from "@/components/ui/GlassButton";

type UserType = "runner" | "organizer";

type Props = {
  onNext: (userType: UserType) => void;
};

export function SignUpFormStepUserType({ onNext }: Props) {
  const router = useRouter();
  const { colors, shadows } = useThemeColors();

  const handleNext = (userType: UserType) => {
    onNext(userType);
  };

  return (
    <WarmBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 24 }}>
          <View style={{ marginTop: 32, marginBottom: 16 }}>
            <Text
              style={{
                color: colors.text.primary,
                fontSize: 24,
                fontFamily: "Nunito-ExtraBold",
                textAlign: "center",
              }}
            >
              Quel type de
              <Text style={{ color: colors.primary.DEFAULT }}> compte</Text>
              {"\n"}souhaitez-vous cr{"\u00e9"}er ?
            </Text>
          </View>
          <View style={{ flex: 1, justifyContent: "center", paddingBottom: 96 }}>
            <View style={{ gap: 16 }}>
              <Pressable
                onPress={() => handleNext("runner")}
                style={{ opacity: 1 }}
              >
                <GlassCard variant="medium" style={{ height: 200, paddingHorizontal: 20, paddingVertical: 16 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                    <View
                      style={{
                        backgroundColor: colors.primary.subtle,
                        padding: 12,
                        borderRadius: 12,
                      }}
                    >
                      <Ionicons name="person-outline" size={24} color={colors.primary.DEFAULT} />
                    </View>
                    <Text
                      style={{
                        color: colors.text.primary,
                        fontSize: 18,
                        fontFamily: "Nunito-Bold",
                        marginLeft: 12,
                      }}
                    >
                      Je suis un Coureur
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: colors.text.secondary,
                      fontSize: 14,
                      lineHeight: 20,
                      fontFamily: "Nunito-Medium",
                      marginBottom: 12,
                    }}
                  >
                    Je veux trouver des partenaires de course, participer {"\u00e0"} des {"\u00e9"}v{"\u00e9"}nements et rejoindre des groupes de running.
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name="arrow-forward-circle-outline"
                      size={18}
                      color={colors.primary.DEFAULT}
                    />
                    <Text
                      style={{
                        color: colors.primary.DEFAULT,
                        marginLeft: 8,
                        fontFamily: "Nunito-Medium",
                        fontSize: 14,
                      }}
                    >
                      Choisir ce profil
                    </Text>
                  </View>
                </GlassCard>
              </Pressable>

              <Pressable
                onPress={() => handleNext("organizer")}
                style={{ opacity: 1 }}
              >
                <GlassCard variant="medium" style={{ height: 200, paddingHorizontal: 20, paddingVertical: 16 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                    <View
                      style={{
                        backgroundColor: colors.primary.subtle,
                        padding: 12,
                        borderRadius: 12,
                      }}
                    >
                      <Ionicons name="people-outline" size={24} color={colors.text.secondary} />
                    </View>
                    <Text
                      style={{
                        color: colors.text.primary,
                        fontSize: 18,
                        fontFamily: "Nunito-Bold",
                        marginLeft: 12,
                      }}
                    >
                      Je suis un Organisateur
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: colors.text.secondary,
                      fontSize: 14,
                      lineHeight: 20,
                      fontFamily: "Nunito-Medium",
                      marginBottom: 12,
                    }}
                  >
                    Je repr{"\u00e9"}sente une association, un club ou une organisation et je veux cr{"\u00e9"}er des {"\u00e9"}v{"\u00e9"}nements et des groupes de running.
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name="arrow-forward-circle-outline"
                      size={18}
                      color={colors.text.secondary}
                    />
                    <Text
                      style={{
                        color: colors.text.secondary,
                        marginLeft: 8,
                        fontFamily: "Nunito-Medium",
                        fontSize: 14,
                      }}
                    >
                      Choisir ce profil
                    </Text>
                  </View>
                </GlassCard>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={{ position: "absolute", bottom: 32, left: 0, right: 0, paddingHorizontal: 24 }}>
          <GlassButton
            title="Retour"
            onPress={() => router.back()}
            variant="secondary"
            icon={<Ionicons name="arrow-back" size={18} color={colors.primary.DEFAULT} />}
          />
        </View>
      </SafeAreaView>
    </WarmBackground>
  );
}
