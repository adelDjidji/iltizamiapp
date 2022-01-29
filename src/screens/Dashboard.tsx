import React, { useEffect } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  StatusBar,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import Container from "../components/Container";
import Text from "../components/Text";
import RTLScrollView from "../components/RTLScrollView";
import Classes from "../constants/Classes";
import Colors from "../constants/Colors";

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
      <TouchableOpacity onPress={() => props.navigation.push("form")}>
        <AntDesign name="pluscircle" size={30} color={Colors.gold} />
      </TouchableOpacity>
    </View>
  );
};

function Card() {
  return (
    <View
      style={{
        padding: 10,
        borderWidth: 1.5,
        borderRadius: 9,
        marginHorizontal: 5,
        borderColor: Colors.gold,
        width: 140,
        backgroundColor: "#ddd",
      }}
    >
      <Text style={{ lineHeight: 18 }}> صلاة الفجر في المسجد</Text>
      <TouchableOpacity>
        <Text bold color={Colors.goldDark}>
          حاسب
        </Text>
      </TouchableOpacity>
    </View>
  );
}
const CardButton = ({ icon, title = "", color = "#a2f" }) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: color,
        width: Dimensions.get("window").width / 2 - 20,
        margin: 10,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
      }}
    >
      {icon}
      <Text style={{ marginTop: 10, fontSize: 18 }}>{title}</Text>
    </TouchableOpacity>
  );
};
export default function Dashboard({ navigation }) {
  return (
    <Container navigation={navigation}>
      <ImageBackground
        style={{ height: Dimensions.get("window").height, paddingTop: 240 }}
        resizeMode="cover"
        source={require("../../assets/26080.jpg")}
      >
        <CustomHeader navigation={navigation} />
        <View style={Classes.containerCard}>
          <View
            style={{
              marginBottom: 10,
              flexDirection: "row-reverse",
              justifyContent: "space-between",
            }}
          >
            <Text bold> أهدافي لهذا اليوم</Text>
            <Text bold color={Colors.goldDark}>
              {" "}
              0/3{" "}
            </Text>
          </View>
          <RTLScrollView horizontal>
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
          </RTLScrollView>
        </View>

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
          />
          <CardButton
            title="التسبيح"
            color="#EFDAD7"
            icon={
              <Image
                style={{
                  width: 30,
                  height: 30,
                }}
                source={require("../../assets/beads.png")}
              />
            }
          />
        </View>
      </ImageBackground>
    </Container>
  );
}
