import { StatusBar } from "expo-status-bar";
import { store, persistor } from "./src/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import RootStack from "./src/navigation";
import Colors from "./src/constants/Colors";
import AppLoading from "expo-app-loading";
import {
  useFonts,
  Cairo_400Regular,
  Cairo_700Bold,
} from "@expo-google-fonts/cairo";
import { Alert, AppRegistry } from "react-native";
import { useEffect } from "react";
import { MenuProvider } from "react-native-popup-menu";
import * as Sentry from "sentry-expo";
import * as Updates from "expo-updates";
import * as Notifications from "expo-notifications";
import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import "react-native-reanimated";

const firebaseConfig = {
  apiKey: "AIzaSyDTbWCgl_bhDJKwqHZKUmQ-PMxHIbppVA4",
  authDomain: "iltizami.firebaseapp.com",
  projectId: "iltizami",
  storageBucket: "iltizami.appspot.com",
  messagingSenderId: "751375864465",
  appId: "1:751375864465:web:8ee2ed805b469bf5612530",
  measurementId: "G-QWYH2Z6QYD",
};

const App = () => {
  Sentry.init({
    dsn: "https://118ae08f494c461eac2ae218b3d8ce49@o1173031.ingest.sentry.io/6267923",
    enableInExpoDevelopment: true,
    debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  });

  initializeApp(firebaseConfig);

  const storeExpoToken = async (token: string) => {
    const firestore = getFirestore();

    await setDoc(doc(firestore, "expoTokens", token), {
      token: token,
      lastActive: new Date().toISOString(),
    });
  };
  let [fontsLoaded] = useFonts({
    Cairo_400Regular,
    Cairo_700Bold,
  });

  const lookForUpdates = async () => {
    const updatesResponse = await Updates.checkForUpdateAsync();
    if (updatesResponse.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
      // Alert.alert("New update available", "حمل آخر التحديثات", [
      //   {
      //     text: "install",
      //     onPress: async () => {
      //       await Updates.fetchUpdateAsync();
      //       await Updates.reloadAsync();
      //     },
      //   },
      //   {
      //     text: "cancel",
      //     onPress: async () => {},
      //   },
      // ]);
    }
  };

  const lookForExpoToken = async () => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    } else {
      const { data: deviceID } = await Notifications.getExpoPushTokenAsync();
      storeExpoToken(deviceID);
    }
  };

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") lookForUpdates();
    lookForExpoToken();
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  } else
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <MenuProvider>
            <RootStack />
          </MenuProvider>
          <StatusBar backgroundColor={Colors.primary} style="light" />
        </PersistGate>
      </Provider>
    );
};
// AppRegistry.registerComponent('main', () => App);
export default App;
