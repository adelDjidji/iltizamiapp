import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import React from "react";
import Text from "../components/Text";
import { TouchableOpacity } from "react-native";
import { AdkarTypes } from "../../utils";
import Colors from "../constants/Colors";
const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex:1,
    flexDirection: "row",
    flexWrap: "wrap",
    
    backgroundColor:Colors.primary
  },
  contentContainer:{
    alignItems: "center",
    // justifyContent: "space-between",
  },
  item: {
    backgroundColor: "white",
    width: Dimensions.get("window").width - 30,
    margin: 10,
    padding: 8,
    borderBottomColor: Colors.gold,
    borderBottomWidth: 2,
    borderRadius:7
  },
});
export default function Adkar({ navigation }) {
  const handleNavigation = (id: string, title: string) => {
    navigation.navigate("adkar-list", { id, title });
  };
  const textProps = {
    size: 20,
    align: "center",
  };
  return (
    <ScrollView contentContainerStyle={styles.contentContainer} style={styles.container}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => handleNavigation(AdkarTypes.SABAH, "أذكار الصباح")}
      >
        <Text {...textProps}>أذكار الصباح</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.item}
        onPress={() => handleNavigation(AdkarTypes.MASA, "أذكار المساء")}
      >
        <Text {...textProps}>أذكار المساء</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.item}
        onPress={() => handleNavigation(AdkarTypes.NAWM, "أذكار النوم")}
      >
        <Text {...textProps}>أذكار النوم</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.item}
        onPress={() => handleNavigation(AdkarTypes.SALAWAT, "أذكار بعد الصلاة")}
      >
        <Text {...textProps}>أذكار بعد الصلاة</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          handleNavigation(AdkarTypes.SALAT_DIVERS, "أذكار الصلاة متنوعة")
        }
      >
        <Text {...textProps}>أذكار الصلاة متنوعة</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.item}
        onPress={() => handleNavigation(AdkarTypes.TASABIH, "تسبيحات")}
      >
        <Text {...textProps}> تسبيحات </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.item}
        onPress={() => handleNavigation(AdkarTypes.DIVERS, "أذكار متنوعة")}
      >
        <Text {...textProps}> أذكار متنوعة </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
