import { StatusBar } from "expo-status-bar";
import { useTheme } from "./src/hooks/useTheme";
import { store, persistor } from "./src/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider, useSelector } from "react-redux";
import RootStack, { navigationRef } from "./src/navigation";
import Colors from "./src/constants/Colors";
import {
  useFonts,
  Cairo_400Regular,
  Cairo_700Bold,
} from "@expo-google-fonts/cairo";
import { useEffect } from "react";
import { MenuProvider } from "react-native-popup-menu";
import * as Sentry from "@sentry/react-native";
import * as Updates from "expo-updates";
import * as Notifications from "expo-notifications";
import Constants, { ExecutionEnvironment } from "expo-constants";
import "./src/i18n";
import i18n from "./src/i18n";

// Show notifications while app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

Sentry.init({
  dsn: "https://118ae08f494c461eac2ae218b3d8ce49@o1173031.ingest.sentry.io/6267923",
  debug: __DEV__,
});

const storeExpoToken = async (token: string) => {
  try {
    const projectId = "iltizami";
    const apiKey = "AIzaSyDTbWCgl_bhDJKwqHZKUmQ-PMxHIbppVA4";
    await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/expoTokens/${encodeURIComponent(token)}?key=${apiKey}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: {
            token: { stringValue: token },
            lastActive: { stringValue: new Date().toISOString() },
          },
        }),
      }
    );
  } catch {
    // Token storage is non-critical
  }
};

const lookForUpdates = async () => {
  try {
    const updatesResponse = await Updates.checkForUpdateAsync();
    if (updatesResponse.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
  } catch (e) {
    // Updates not available in dev or bare builds
  }
};

const lookForExpoToken = async () => {
  // Push notifications are not supported in Expo Go (removed in SDK 53)
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
    return;
  }
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus === "granted") {
      const projectId = Constants.easConfig?.projectId;
      const { data: deviceID } = await Notifications.getExpoPushTokenAsync(
        projectId ? { projectId } : undefined
      );
      await storeExpoToken(deviceID);
    }
  } catch (e) {
    console.warn("Push token registration failed:", e);
  }
};

/** Syncs the persisted Redux language to the i18n singleton on every change. */
const LanguageSync = () => {
  const language = useSelector(
    (state: any) => (state.settings?.language as "ar" | "en") ?? "ar"
  );
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);
  return null;
};

const ThemeStatusBar = () => {
  const theme = useTheme();
  return <StatusBar backgroundColor={theme.header} style={theme.statusBar} />;
};

const App = () => {
  let [fontsLoaded] = useFonts({
    Cairo_400Regular,
    Cairo_700Bold,
  });

  useEffect(() => {
    const tasks: Promise<void>[] = [lookForExpoToken()];
    if (process.env.NODE_ENV !== "development") tasks.push(lookForUpdates());
    Promise.all(tasks);

    // Navigate to form screen when user taps a prayer reminder notification
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        if (data?.screen === "form" && navigationRef.isReady()) {
          navigationRef.navigate("form");
        }
      }
    );
    return () => subscription.remove();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LanguageSync />
        <ThemeStatusBar />
        <MenuProvider>
          <RootStack />
        </MenuProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
