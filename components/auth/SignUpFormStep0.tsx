import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useThemeColors } from "@/constants/theme";
import WarmBackground from "@/components/ui/WarmBackground";
import GlassCard from "@/components/ui/GlassCard";
import GlassButton from "@/components/ui/GlassButton";

type RunnerType = "chill" | "perf";

type Props = {
  onNext: (type: RunnerType, isFlexible: boolean) => void;
};

export function SignUpFormStep0({ onNext }: Props) {
  const [isFlexible, setIsFlexible] = useState(false);
  const router = useRouter();
  const { colors, shadows } = useThemeColors();

  const handleNext = (type: RunnerType) => {
    onNext(type, isFlexible);
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
              <Text style={{ color: colors.primary.DEFAULT }}> runner</Text> {"\n"}es tu ?
            </Text>
          </View>
          <View style={{ flex: 1, justifyContent: "center", paddingBottom: 96 }}>
            <View style={{ gap: 16 }}>
              <Pressable onPress={() => handleNext("chill")}>
                <GlassCard variant="medium" style={{ paddingHorizontal: 20, paddingVertical: 16, height: 180 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                    <View
                      style={{
                        backgroundColor: colors.primary.subtle,
                        padding: 12,
                        borderRadius: 12,
                      }}
                    >
                      <Ionicons name="leaf-outline" size={24} color={colors.text.secondary} />
                    </View>
                    <Text
                      style={{
                        color: colors.text.primary,
                        fontSize: 18,
                        fontFamily: "Nunito-Bold",
                        marginLeft: 12,
                      }}
                    >
                      Je suis un runner Chill
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
                    Je cours pour le plaisir, la sant{"\u00e9"} et la socialisation. Je ne
                    suis pas focalis{"\u00e9"} sur la performance.
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

              <Pressable onPress={() => handleNext("perf")}>
                <GlassCard variant="medium" style={{ paddingHorizontal: 20, paddingVertical: 16, height: 180 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                    <View
                      style={{
                        backgroundColor: colors.primary.subtle,
                        padding: 12,
                        borderRadius: 12,
                      }}
                    >
                      <Ionicons name="trophy-outline" size={24} color={colors.primary.DEFAULT} />
                    </View>
                    <Text
                      style={{
                        color: colors.text.primary,
                        fontSize: 18,
                        fontFamily: "Nunito-Bold",
                        marginLeft: 12,
                      }}
                    >
                      Je suis un runner Perf
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
                    Je cours pour la performance, avec des objectifs pr{"\u00e9"}cis et un
                    plan d'entra{"\u00ee"}nement structur{"\u00e9"}.
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

              <View style={{ marginTop: 24 }}>
                <Text
                  style={{
                    color: colors.text.primary,
                    fontSize: 16,
                    fontFamily: "Nunito-Bold",
                    marginBottom: 16,
                  }}
                >
                  Option suppl{"\u00e9"}mentaire
                </Text>
                <Pressable onPress={() => setIsFlexible(!isFlexible)}>
                  <GlassCard
                    variant={isFlexible ? "medium" : "light"}
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 16,
                      borderWidth: 2,
                      borderColor: isFlexible ? colors.primary.DEFAULT : colors.glass.border,
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 8,
                          borderWidth: 2,
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 12,
                          backgroundColor: isFlexible ? colors.primary.DEFAULT : "transparent",
                          borderColor: isFlexible ? colors.primary.DEFAULT : colors.text.tertiary,
                        }}
                      >
                        {isFlexible && (
                          <Ionicons name="checkmark" size={16} color="white" />
                        )}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            color: colors.text.primary,
                            fontSize: 16,
                            fontFamily: "Nunito-Bold",
                          }}
                        >
                          Je suis flexible
                        </Text>
                        <Text
                          style={{
                            color: colors.text.secondary,
                            fontSize: 14,
                            lineHeight: 20,
                            marginTop: 4,
                            fontFamily: "Nunito-Medium",
                          }}
                        >
                          Je peux m'adapter aux objectifs, et entrainements de mes
                          partenaires.
                        </Text>
                      </View>
                    </View>
                  </GlassCard>
                </Pressable>
              </View>
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
