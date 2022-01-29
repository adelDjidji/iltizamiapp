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
import { AppRegistry } from "react-native";

const App = () => {
  let [fontsLoaded] = useFonts({
    Cairo_400Regular,
    Cairo_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <RootStack />
          <StatusBar backgroundColor={Colors.primary} style="light" />
        </PersistGate>
      </Provider>
    );
};
AppRegistry.registerComponent('iltizam', () => App);
// export default App;
