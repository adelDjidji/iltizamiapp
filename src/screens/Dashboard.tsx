import React, { useEffect } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  StatusBar,
  ScrollView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import Container from "../components/Container";
import Text from "../components/Text";
import RTLScrollView from "../components/RTLScrollView";
import Classes from "../constants/Classes";
import Colors from "../constants/Colors";
import { useSelector } from "react-redux";
import GoalsManager from "../components/GoalsManager";

const CustomHeader = (props) => {
  return (
    <View
      style={{
        backgroundColor: "transparent",
        position: "absolute",
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        zIndex: 2,
        width: "100%",
        elevation: 2,
        paddingTop: 10,
        paddingHorizontal: 30,
        marginTop: StatusBar.currentHeight,
      }}
    >
      <TouchableOpacity onPress={() => props.navigation.push("drawer-stack")}>
        <AntDesign name="menufold" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const CardButton = ({
  icon,
  title = "",
  color = "#a2f",
  onPress = () => {},
  fullWidth = false,
}) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: color,
        width: fullWidth ? "95%" : Dimensions.get("window").width / 2 - 20,
        margin: 10,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
      }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon}
      <Text style={{ marginTop: 10, fontSize: 18 }}>{title}</Text>
    </TouchableOpacity>
  );
};
export default function Dashboard({ navigation }) {
  const { userPosition } = useSelector((state) => state.settings);

  return (
    <ScrollView>
      <Container navigation={navigation}>
        <ImageBackground
          style={{ height: Dimensions.get("window").height, paddingTop: 240 }}
          resizeMode="cover"
          source={require("../../assets/26080.jpg")}
        >
          {/* <CustomHeader navigation={navigation} /> */}

          <GoalsManager />

          <View style={{ flexDirection: "row" }}>
            <CardButton
              title="أذكار المسلم"
              color="#9AD0EC"
              icon={
                <Image
                  style={{
                    width: 30,
                    height: 30,
                  }}
                  source={require("../../assets/prayer.png")}
                />
              }
              onPress={() => navigation.push("adkar")}
            />
            <CardButton
              title="دفتر المحاسبة"
              color="#EFDAD7"
              icon={
                <Image
                  style={{
                    width: 30,
                    height: 30,
                  }}
                  source={require("../../assets/checklist.png")}
                />
              }
              onPress={() => navigation.push("form")}
            />
          </View>
          <CardButton
            title="احصائيات التزامي"
            color="white"
            fullWidth
            icon={<AntDesign name="linechart" size={24} color="black" />}
            onPress={() => navigation.push("Stats")}
          />

          {/* <TouchableOpacity
            style={{
              position: "absolute",
              bottom: 80,
              right: 30,
              backgroundColor: "white",
              borderRadius: 50,
              padding: 0,
            }}
            onPress={() => navigation.push("form")}
          >
            <AntDesign name="pluscircle" size={50} color={Colors.gold} />
          </TouchableOpacity> */}
        </ImageBackground>
      </Container>
    </ScrollView>
  );
}
