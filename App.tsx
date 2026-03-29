import { StatusBar } from "expo-status-bar";
import { store, persistor } from "./src/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider, useSelector } from "react-redux";
import RootStack from "./src/navigation";
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
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import "./src/i18n";
import i18n from "./src/i18n";

const firebaseConfig = {
  apiKey: "AIzaSyDTbWCgl_bhDJKwqHZKUmQ-PMxHIbppVA4",
  authDomain: "iltizami.firebaseapp.com",
  projectId: "iltizami",
  storageBucket: "iltizami.appspot.com",
  messagingSenderId: "751375864465",
  appId: "1:751375864465:web:8ee2ed805b469bf5612530",
  measurementId: "G-QWYH2Z6QYD",
};

Sentry.init({
  dsn: "https://118ae08f494c461eac2ae218b3d8ce49@o1173031.ingest.sentry.io/6267923",
  debug: __DEV__,
});

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const storeExpoToken = async (token: string) => {
  const firestore = getFirestore();
  await setDoc(doc(firestore, "expoTokens", token), {
    token: token,
    lastActive: new Date().toISOString(),
  });
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

const App = () => {
  let [fontsLoaded] = useFonts({
    Cairo_400Regular,
    Cairo_700Bold,
  });

  useEffect(() => {
    const tasks: Promise<void>[] = [lookForExpoToken()];
    if (process.env.NODE_ENV !== "development") tasks.push(lookForUpdates());
    Promise.all(tasks);
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LanguageSync />
        <MenuProvider>
          <RootStack />
        </MenuProvider>
        <StatusBar backgroundColor={Colors.primary} style="light" />
      </PersistGate>
    </Provider>
  );
};

export default App;
