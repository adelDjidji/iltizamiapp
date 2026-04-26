import { StatusBar } from "expo-status-bar";
import { useTheme } from "./src/hooks/useTheme";
import { store, persistor } from "./src/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider, useSelector } from "react-redux";
import RootStack, { navigationRef } from "./src/navigation";
import {
  useFonts,
  Cairo_400Regular,
  Cairo_700Bold,
} from "@expo-google-fonts/cairo";
import { useEffect } from "react";
import { Platform } from "react-native";
import { MenuProvider } from "react-native-popup-menu";
// import * as Sentry from "@sentry/react-native";
import * as Updates from "expo-updates";
import * as Notifications from "expo-notifications";
import "./src/i18n";
import i18n from "./src/i18n";
import {
  schedulePrayerNotifications,
  cancelAllPrayerNotifications,
} from "./src/utils/notifications";
import { PrayerKey, NotificationSettingsState } from "./src/store/reducers";

// Android 8+ requires a notification channel — without one notifications are silently dropped.
if (Platform.OS === "android") {
  Notifications.setNotificationChannelAsync("prayer-reminders", {
    name: "Prayer Reminders",
    importance: Notifications.AndroidImportance.HIGH,
    sound: "default",
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#FFD700",
  });
}

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

// Sentry.init({
//   dsn: "https://118ae08f494c461eac2ae218b3d8ce49@o1173031.ingest.sentry.io/6267923",
//   debug: __DEV__,
// });

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

/**
 * On startup, reschedule prayer notifications using persisted settings + timings.
 * Handles the case where the OS cleared scheduled notifications (device restart,
 * app reinstall) but today's prayer timings are already cached in Redux.
 */
const NotificationSync = () => {
  const notificationSettings: NotificationSettingsState = useSelector(
    (state: any) => state.notificationSettings,
  );
  const prayerTimings: Record<string, string> | undefined = useSelector(
    (state: any) => state.prayer?.data?.timings,
  );

  useEffect(() => {
    const anyEnabled = (Object.keys(notificationSettings) as PrayerKey[]).some(
      (k) => notificationSettings[k].enabled,
    );

    if (!anyEnabled) {
      cancelAllPrayerNotifications().catch(() => {});
      return;
    }

    if (!prayerTimings) return;

    const labels: Record<PrayerKey, string> = {
      fajr: i18n.t("ind.fajr"),
      dhuhr: i18n.t("ind.dhuhr"),
      asr: i18n.t("ind.asr"),
      maghrib: i18n.t("ind.maghrib"),
      isha: i18n.t("ind.isha"),
    };

    schedulePrayerNotifications(
      prayerTimings,
      notificationSettings,
      labels,
      i18n.t("config.notifBody"),
    ).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount after PersistGate hydrates the store

  return null;
};

/** Syncs the persisted Redux language to the i18n singleton on every change. */
const LanguageSync = () => {
  const language = useSelector(
    (state: any) => (state.settings?.language as "ar" | "en") ?? "ar",
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
    if (process.env.NODE_ENV !== "development") lookForUpdates();

    // Navigate to form screen when user taps a prayer reminder notification
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        if (data?.screen === "form" && navigationRef.isReady()) {
          navigationRef.navigate("form");
        }
      },
    );
    return () => subscription.remove();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NotificationSync />
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
