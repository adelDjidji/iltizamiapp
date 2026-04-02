import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

export const navigationRef = createNavigationContainerRef<any>();
import Home from "../screens/Home";
import Stats from "../screens/Stats";
import {
  AntDesign,
  Octicons,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import Dashboard from "../screens/Dashboard";
import Colors from "../constants/Colors";
import { View, Text, Alert } from "react-native";
import DrawerScreen from "../screens/DrawerScreen";
import FormEvaluation from "../screens/FormEvaluation";
import { Provider, useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import * as SecureStore from "expo-secure-store";
import { useTheme } from "../hooks/useTheme";

import * as Location from "expo-location";
import ConfigScreen from "../screens/Config";
import Tasbih from "../screens/Tasbih";
import Adkar from "../screens/Adkar";
import CalendarScreen from "../screens/Calendar";
import AdkarList from "../screens/AdkarList";
import About from "../screens/About";
import FortyDaysChallenge from "../screens/FortyDaysChallenge";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function TabsStack() {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ navigation, route }) => ({
        tabBarStyle: { backgroundColor: theme.tabBar, borderTopWidth: 0 },
        tabBarShowLabel: false,
        tabBarInactiveTintColor: theme.tabBarInactive,
        tabBarActiveTintColor: Colors.gold,
        headerTitle: "",
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={(props) => ({
          tabBarIcon: ({ focused, color, size }) => (
            <Octicons
              name={focused ? "home-fill" : "home"}
              size={21}
              color={color}
            />
          ),
          headerStyle: {
            backgroundColor: Colors.primary,
          },
        })}
      />
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons
              name={focused ? "mosque" : "mosque-outline"}
              size={21}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Stats"
        component={Stats}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "bar-chart-sharp" : "bar-chart-outline"}
              size={21}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="About"
        component={About}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons
              name={
                focused
                  ? "information-variant-circle"
                  : "information-variant-circle-outline"
              }
              size={21}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const MainStack = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Stack.Navigator initialRouteName={"main"}>
      <Stack.Screen
        component={TabsStack}
        name="main"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Stats"
        component={Stats}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={FormEvaluation}
        name="form"
        options={{
          title: t("nav.formTitle"),
          headerStyle: { backgroundColor: theme.header },
          headerTitleStyle: { color: theme.headerText },
          headerTintColor: theme.headerText,
        }}
      />
      <Stack.Screen
        component={ConfigScreen}
        name="config"
        options={{
          title: t("nav.configTitle"),
          headerStyle: { backgroundColor: theme.header },
          headerTitleStyle: { color: theme.headerText },
          headerTintColor: theme.headerText,
        }}
      />
      <Stack.Screen
        component={Tasbih}
        name="tasbih"
        options={{ title: "", headerShown: false }}
      />
      <Stack.Screen
        component={Adkar}
        name="adkar"
        options={{
          title: t("nav.adkarTitle"),
          headerStyle: { backgroundColor: theme.header },
          headerTitleStyle: { color: theme.headerText },
          headerTintColor: theme.headerText,
        }}
      />
      <Stack.Screen
        component={AdkarList}
        name="adkar-list"
        options={{
          title: "",
          headerStyle: { backgroundColor: theme.header },
          headerTintColor: theme.headerText,
        }}
      />
      <Stack.Screen
        component={CalendarScreen}
        name="calendar"
        options={{
          title: "",
          headerStyle: { backgroundColor: theme.header },
          headerTintColor: theme.headerText,
        }}
      />
      <Stack.Screen
        component={FortyDaysChallenge}
        name="challenge"
        options={{
          title: t("challenge.navTitle"),
          headerStyle: { backgroundColor: theme.header },
          headerTitleStyle: { color: theme.headerText },
          headerTintColor: Colors.gold,
        }}
      />
    </Stack.Navigator>
  );
};

const RootStack = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { userPosition } = useSelector((state: any) => state.settings);

  const verifyPermissions = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(t("nav.locationPermTitle"), t("nav.locationPermMsg"), [
        { text: t("cancel") },
      ]);
      return false;
    }
    return true;
  };

  const getLocationHandler = async () => {
    let loc = null;
    const hasPermission = await verifyPermissions();
    if (!hasPermission) return;

    try {
      const location = await Location.getCurrentPositionAsync({});
      loc = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (err) {
      Alert.alert(t("nav.locationErrTitle"), t("nav.locationErrMsg"), [
        { text: t("cancel") },
      ]);
    }

    return loc;
  };

  const loadLocation = async () => {
    try {
      let location;
      const savedPos = (await SecureStore.getItemAsync("user-position")) || "";
      const isValidSaved = savedPos !== "" && savedPos !== "null" && savedPos !== "undefined";
      if (isValidSaved) {
        location = JSON.parse(savedPos);
      } else {
        location = await getLocationHandler();
        // Only store if we got a valid location — JSON.stringify(undefined) is not a string
        if (location) {
          await SecureStore.setItemAsync("user-position", JSON.stringify(location));
        }
      }
      dispatch({ type: "USER_POSITION", payload: location ?? null });
    } catch {
      // SecureStore or location APIs failed; userPosition remains as persisted by Redux
    }
  };

  React.useEffect(() => {
    loadLocation();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <MainStack />
    </NavigationContainer>
  );
};

export default RootStack;
