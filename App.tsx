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


const App = () => {

  let [fontsLoaded] = useFonts({
    Cairo_400Regular,
    Cairo_700Bold,
  });

  const lookForUpdates = async () => {
    const updatesResponse = await Updates.checkForUpdateAsync();
    if (updatesResponse.isAvailable) {
      Alert.alert("New update available", "", [
        {
          text: "install",
          onPress: async () => {
            await Updates.fetchUpdateAsync();
            await Updates.reloadAsync();
          },
        },
        {
          text: "cancel",
          onPress: async () => {},
        },
      ]);
    }
  };


  useEffect(() => {
    // lookForUpdates();
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
