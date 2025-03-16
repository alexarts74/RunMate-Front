import * as Font from "expo-font";

export const loadFonts = async () => {
  await Font.loadAsync({
    Fredoka: require("../assets/fonts/Fredoka/Fredoka.ttf"),
    "Kanit-Thin": require("../assets/fonts/Kanit/Kanit-Thin.ttf"),
    "Kanit-Light": require("../assets/fonts/Kanit/Kanit-Light.ttf"),
    "Kanit-Regular": require("../assets/fonts/Kanit/Kanit-Regular.ttf"),
    "Kanit-Medium": require("../assets/fonts/Kanit/Kanit-Medium.ttf"),
    "Kanit-SemiBold": require("../assets/fonts/Kanit/Kanit-SemiBold.ttf"),
    "Kanit-Bold": require("../assets/fonts/Kanit/Kanit-Bold.ttf"),
    "Kanit-ExtraBold": require("../assets/fonts/Kanit/Kanit-ExtraBold.ttf"),
    "Kanit-Black": require("../assets/fonts/Kanit/Kanit-Black.ttf"),
  });
};
