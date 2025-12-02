import * as Font from "expo-font";

export const loadFonts = async () => {
  await Font.loadAsync({
    Fredoka: require("../assets/fonts/Fredoka/Fredoka.ttf"),
    "Nunito-ExtraLight": require("../assets/fonts/Nunito Font/static/Nunito-ExtraLight.ttf"),
    "Nunito-Light": require("../assets/fonts/Nunito Font/static/Nunito-Light.ttf"),
    "Nunito-Regular": require("../assets/fonts/Nunito Font/static/Nunito-Regular.ttf"),
    "Nunito-Medium": require("../assets/fonts/Nunito Font/static/Nunito-Medium.ttf"),
    "Nunito-SemiBold": require("../assets/fonts/Nunito Font/static/Nunito-SemiBold.ttf"),
    "Nunito-Bold": require("../assets/fonts/Nunito Font/static/Nunito-Bold.ttf"),
    "Nunito-ExtraBold": require("../assets/fonts/Nunito Font/static/Nunito-ExtraBold.ttf"),
    "Nunito-Black": require("../assets/fonts/Nunito Font/static/Nunito-Black.ttf"),
  });
};
