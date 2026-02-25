import "dotenv/config";

export default {
  expo: {
    name: "RunMate",
    slug: "RunMate2",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/splaash.png",
    splash: {
      image: "./assets/images/splaash.png",
      resizeMode: "cover",
      backgroundColor: "#F8FAF8",
    },
    scheme: "runmate",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    notification: {
      icon: "./assets/images/splaash.png",
      color: "#000000",
      androidMode: "default",
      androidCollapsedTitle: "RunMate",
      iosDisplayInForeground: true,
    },
    ios: {
      bundleIdentifier: "com.alexarts.runmate",
      supportsTablet: true,
      splash: {
        image: "./assets/images/splaash.png",
        resizeMode: "cover",
        backgroundColor: "#F8FAF8",
      },
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/splaash.png",
        backgroundColor: "#F8FAF8",
      },
      splash: {
        image: "./assets/images/splaash.png",
        resizeMode: "cover",
        backgroundColor: "#F8FAF8",
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/splaash.png",
      splash: {
        image: "./assets/images/splaash.png",
        resizeMode: "cover",
        backgroundColor: "#F8FAF8",
      },
    },
    plugins: [
      "expo-router",
      "expo-image-picker",
      "expo-location",
      "expo-font",
      "expo-web-browser",
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      apiBaseUrl:
        process.env.API_BASE_URL_LOCAL ||
        process.env.API_BASE_URL_PROD ||
        "http://localhost:3000",
      eas: {
        projectId: "8fca9dbf-a426-4a68-9082-a46e2109da67",
      },
    },
  },
};
