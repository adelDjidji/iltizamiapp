import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from "../screens/Home";
import Stats from "../screens/Stats";
import { AntDesign } from "@expo/vector-icons";
import Dashboard from "../screens/Dashboard";
import Colors from "../constants/Colors";
import { View, Text } from "react-native";
import DrawerScreen from "../screens/DrawerScreen";
import FormEvaluation from "../screens/FormEvaluation";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function TabsStack() {
  return (
    <Tab.Navigator
      defaultScreenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
      }}
      screenOptions={({ navigation, route }) => ({
        tabBarStyle: { backgroundColor: Colors.primary, borderTopWidth: 0 },
        tabBarShowLabel: false,
        tabBarIconStyle: {},
        tabBarInactiveTintColor: Colors.secondary,
        tabBarActiveTintColor: Colors.gold,
        headerTitle: "",
        headerShown: false,
        // header: () => <CustomHeader navigation={navigation} />,
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={(props) => ({
          tabBarIcon: ({ focused, color, size }) => (
            <AntDesign name="home" size={21} color={color} />
          ),
          headerRight: () => (
            <View>
              <Text onPress={() => props.navigation.navigate("form")}>
                Header right
              </Text>
            </View>
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
            <AntDesign name="profile" size={21} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Stats"
        component={Stats}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <AntDesign name="linechart" size={21} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
const MainStack = () => {
  return (
    <Stack.Navigator initialRouteName={"main"}>
      <Stack.Screen
        component={TabsStack}
        name="main"
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen component={FormEvaluation} name="form"></Stack.Screen>
      {/* <Stack.Screen
        component={() => (
          <Drawer.Navigator initialRouteName="drawer">
            <Drawer.Screen name="drawer" component={DrawerScreen} />
          </Drawer.Navigator>
        )}
        name="drawer-stack"
      ></Stack.Screen> */}
    </Stack.Navigator>
  );
};

const RootStack = () => {
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
};
export default RootStack;
