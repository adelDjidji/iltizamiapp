import React from "react";
import {
  View,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  StatusBar,
  Animated,
  Vibration,
  Alert,
  StyleSheet,
  Easing,
} from "react-native";
import ProgressCircle from "react-native-progress-circle";
import Text from "../components/Text";
import Colors from "../constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function Tasbih({ navigation }) {
  const [vibrationActive, setvibrationActive] = React.useState(false);
  const handleTasbih = () => {};
  return (
    <ImageBackground
      style={{
        alignItems: "center",
        height: Dimensions.get("window").height,
        paddingTop: 240,
        marginTop: StatusBar.currentHeight,
      }}
      resizeMode="cover"
      source={require("../../assets/26080.jpg")}
    >
      <AntDesign
        onPress={() => navigation.pop()}
        style={{ position: "absolute", top: 25, left: 20 }}
        name="arrowleft"
        size={24}
        color="white"
      />
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: xOffset } } }],
          { useNativeDriver: true }
        )}
        horizontal
        pagingEnabled
        style={{}}
      >
        <Screen index={0}>
          <Counter
            initNumber={0}
            label={"سبحان الله"}
            vibrationActive={vibrationActive}
          />
        </Screen>
        <Screen index={1}>
          <Counter
            initNumber={0}
            label={"الحمد لله"}
            vibrationActive={vibrationActive}
          />
        </Screen>
        <Screen index={2}>
          <Counter
            initNumber={0}
            label={"سبحان الله و بحمده سبحان الله العظيم"}
            vibrationActive={vibrationActive}
          />
        </Screen>
      </Animated.ScrollView>
      {/* <TouchableOpacity
        style={{ marginBottom: 20 }}
        onPress={() => setvibrationActive(!vibrationActive)}
      >
        {vibrationActive ? (
          <MaterialCommunityIcons name="vibrate" size={24} color="white" />
        ) : (
          <MaterialCommunityIcons name="vibrate-off" size={24} color="white" />
        )}
      </TouchableOpacity> */}
    </ImageBackground>
  );
}

const Counter = (props) => {
  const [number, setnumber] = React.useState<number>(props.initNumber || 0);
  const shakeAnimation = React.useRef(new Animated.Value(0)).current;

  const startShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -6,
        duration: 50,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 6,
        duration: 50,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
    ]).start();
    Vibration.vibrate([70, 20]);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() =>
          setnumber((n) => {
            if ((n + 1) % 100 == 0) startShake();
            props.vibrationActive && Vibration.vibrate([10, 50]);
            return n + 1;
          })
        }
        delayLongPress={200}
        activeOpacity={0.8}
        style={{ margin: 40, alignItems: "center" }}
      >
        <ProgressCircle
          percent={number % 100}
          radius={80}
          borderWidth={10}
          color={Colors.gold}
          shadowColor={Colors.secondary}
          bgColor={Colors.primary}
        >
          <Text color="white" style={{ fontSize: 18 }}>
            {number % 100}
          </Text>
        </ProgressCircle>
        <Text color="white" align="center" h1 style={{ marginTop: 40 }}>
          {props.label}
        </Text>
        <Animated.View
          style={[{ transform: [{ translateY: shakeAnimation }] }]}
        >
          <Text
            align="center"
            style={{ backgroundColor: Colors.blue, width: 100 }}
            color="white"
            h2
          >
            {number}
            {/* {Math.floor(number / 100) * 100} */}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const xOffset = new Animated.Value(0);
const transitionAnimation = (index) => {
  return {
    transform: [
      { perspective: 800 },
      {
        scale: xOffset.interpolate({
          inputRange: [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH,
          ],
          outputRange: [0.25, 1, 0.25],
        }),
      },
      {
        rotateX: xOffset.interpolate({
          inputRange: [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH,
          ],
          outputRange: ["45deg", "0deg", "45deg"],
        }),
      },
      {
        rotateY: xOffset.interpolate({
          inputRange: [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH,
          ],
          outputRange: ["-45deg", "0deg", "45deg"],
        }),
      },
    ],
  };
};
const Screen = (props) => {
  const MAX_TABS = 2;
  return (
    <View style={styles.scrollPage}>
      <View
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          justifyContent: "space-between",
        }}
      >
        <View>
        {props.index < MAX_TABS && (
          <AntDesign name="swapright" size={30} color={Colors.gold} />
        )}
        </View>
        <View>
        {props.index > 0 && (
          <AntDesign name="swapleft" size={30} color={Colors.gold} />
        )}
        </View>
        
      </View>

      <Animated.View style={[styles.screen, transitionAnimation(props.index)]}>
        {props.children}
      </Animated.View>
    </View>
  );
};
//Styles
const styles = StyleSheet.create({
  scrollPage: {
    width: SCREEN_WIDTH,
    padding: 20,
  },
  screen: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 45,
    fontWeight: "bold",
  },
});
