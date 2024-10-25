import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "../screens/Home";
import Stats from "../screens/Stats";
import { AntDesign } from "@expo/vector-icons";
import Dashboard from "../screens/Dashboard";
import Colors from "../constants/Colors";
import { View, Text, Alert } from "react-native";
import DrawerScreen from "../screens/DrawerScreen";
import FormEvaluation from "../screens/FormEvaluation";
import { Provider, useSelector, useDispatch } from "react-redux";

import * as SecureStore from "expo-secure-store";

import * as Location from "expo-location";
import ConfigScreen from "../screens/Config";
import Tasbih from "../screens/Tasbih";
import Adkar from "../screens/Adkar";
import CalendarScreen from "../screens/Calendar";
import AdkarList from "../screens/AdkarList";
import About from "../screens/About";

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
        tabBarStyle: { backgroundColor: Colors.secondary, borderTopWidth: 0 },
        tabBarShowLabel: false,
        // tabBarIconStyle: {},
        tabBarInactiveTintColor: "grey",
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
      {/* <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <AntDesign name="profile" size={21} color={color} />
          ),
        }}
      /> */}
      
      <Tab.Screen
        name="Stats"
        component={Stats}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <AntDesign name="linechart" size={21} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="About"
        component={About}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <AntDesign name="infocirlceo" size={21} color={color} />
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
          title: "دفتر المحاسبة",
          headerStyle: { backgroundColor: Colors.primary },
          headerTitleStyle: {
            color: "white",
          },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        component={ConfigScreen}
        name="config"
        options={{
          title: "إعدادات",
          headerStyle: { backgroundColor: Colors.primary },
          headerTitleStyle: {
            color: "white",
          },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        component={Tasbih}
        name="tasbih"
        options={{
          title:"",
          headerShown:false
        }}
      />
      <Stack.Screen
        component={Adkar}
        name="adkar"
        options={{
          title:"أذكار المسلم"
        }}
      />
      <Stack.Screen
        component={AdkarList}
        name="adkar-list"
        options={{
          title:""
        }}
      />
      <Stack.Screen
        component={CalendarScreen}
        name="calendar"
        options={{
          title:""
        }}
      />
      {/* <Stack.Screen
        component={() => (
          <Drawer.Navigator initialRouteName="drawer">
            <Drawer.Screen name="drawer" component={DrawerScreen} />
          </Drawer.Navigator>
        )}
        name="drawer-stack"
      /> */}
    </Stack.Navigator>
  );
};

const RootStack = () => {
  const dispatch = useDispatch();

  const { userPosition } = useSelector((state) => state.settings);

  const verifyPermissions = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Insufficient permissions!",
        "You need to grant location permissions to see prayer times.",
        [{ text: "Okay" }]
      );
      return false;
    }
    return true;
  };
  const getLocationHandler = async () => {
    let loc = null;
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        // timeout: 5000,
      });
      loc = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      // setPickedLocation(location.coords);
    } catch (err) {
      Alert.alert(
        "Could not fetch location!",
        "Please try again later or pick a location on the map.",
        [{ text: "Okay" }]
      );
    }

    return loc;
  };
  const loadLocation = async () => {
    let location;
    let savedPos = (await SecureStore.getItemAsync("user-position")) || "";
    if (savedPos !== "") {
      //already exist
      location = JSON.parse(savedPos);
    } else {
      location = await getLocationHandler();
      await SecureStore.setItemAsync("user-position", JSON.stringify(location));
    }
    dispatch({
      type: "USER_POSITION",
      payload: location,
    });
  };
  React.useEffect(() => {
    // loadLocation();
  }, []);

  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
};
export default RootStack;
