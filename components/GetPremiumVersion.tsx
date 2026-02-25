// import React from "react";
// import { View, Text, Pressable } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { router } from "expo-router";
// import GlassCard from "@/components/ui/GlassCard";
// import { useThemeColors } from "@/constants/theme";

// const GetPremiumVersion = () => {
//   const { colors, shadows } = useThemeColors();
//
//   return (
//     <View className="mx-4 my-3">
//       <Pressable
//         onPress={() => router.push("/premium")}
//       >
//         <GlassCard variant="medium">
//           <View className="flex-row items-center justify-between">
//             <View className="flex-1">
//               <View className="flex-row items-center mb-2">
//                 <Ionicons name="diamond-outline" size={24} color={colors.primary.DEFAULT} />
//                 <Text style={{ color: colors.primary.DEFAULT }} className="font-bold text-lg ml-2">
//                   Version Premium
//                 </Text>
//               </View>
//               <Text style={{ color: colors.text.primary }} className="text-sm mb-3">
//                 Accédez à toutes les courses à proximité de chez vous !
//               </Text>
//               <View className="flex-row items-center">
//                 <Text style={{ color: colors.text.secondary }} className="text-sm">À partir de </Text>
//                 <Text style={{ color: colors.primary.DEFAULT }} className="font-bold text-lg mx-1">9.99€</Text>
//                 <Text style={{ color: colors.text.secondary }} className="text-sm">/mois</Text>
//               </View>
//             </View>
//             <Ionicons name="chevron-forward" size={24} color={colors.primary.DEFAULT} />
//           </View>
//         </GlassCard>
//       </Pressable>
//     </View>
//   );
// };

// export default GetPremiumVersion;
