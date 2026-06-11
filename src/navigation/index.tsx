import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import * as Notifications from "expo-notifications";
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
import FormEvaluation from "../screens/FormEvaluation";
import { useTranslation } from "react-i18next";

import { useTheme } from "../hooks/useTheme";

import ConfigScreen from "../screens/Config";
import Tasbih from "../screens/Tasbih";
import Adkar from "../screens/Adkar";
import CalendarScreen from "../screens/Calendar";
import AdkarList from "../screens/AdkarList";
import About from "../screens/About";
import FortyDaysChallenge from "../screens/FortyDaysChallenge";

export const navigationRef = createNavigationContainerRef<any>();

/** Navigate to the evaluation form when the user taps a prayer reminder. */
export function navigateFromNotificationResponse(
  response: Notifications.NotificationResponse | null | undefined,
): void {
  if (!response) return;

  const screen = response.notification.request.content.data?.screen;
  if (screen !== "form") return;

  if (navigationRef.isReady()) {
    navigationRef.navigate("form");
  }
}

/** Handle notification taps that launched the app from a killed state. */
function handleColdStartNotification(): void {
  Notifications.getLastNotificationResponseAsync().then((response) => {
    navigateFromNotificationResponse(response);
  });
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabsStack() {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={({ navigation, route }) => ({
        tabBarStyle: {
          backgroundColor: theme.bg,
          borderTopWidth: 1,
          borderTopColor: theme.border,
        },
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
  // Location permission is requested only when the user chooses "Use My Current
  // Location" in the location picker on the Prayers (Home) screen.
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={handleColdStartNotification}
    >
      <MainStack />
    </NavigationContainer>
  );
};

export default RootStack;
