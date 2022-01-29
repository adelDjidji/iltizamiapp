import { View, StyleSheet } from "react-native";
import React, {
  ReactChild,
  ReactFragment,
  ReactPortal,
  useEffect,
  useState,
} from "react";
import Text from "./Text";
import moment from "moment";

const SalatText = (props: {
  children:
    | boolean
    | ReactChild
    | ReactFragment
    | ReactPortal
    | null
    | undefined;
}) => <Text h3 style={styles.flex1}>{props.children}</Text>;

const t = (salat) => {
  switch (salat) {
    case "Fajr":
      return "الفجر";
    case "Sunrise":
      return "الشروق";
    case "Dhuhr":
      return "الظهر";
    case "Asr":
      return "العصر";
    case "Sunset":
      return "الغروب";
    case "Maghrib":
      return "المغرب";
    case "Isha":
      return "العشاء";
  }
};
export default function SalatItem({ time, salat, diff, signedDiff, showDiff=false, diff_str }) {
    var diff_min = diff
    if(diff>60){
        diff_min = `${Math.trunc(diff/60)}:${diff%60}`
        // console.log(diff_min);
        // diff_min=diff_str
    }
  return (
    <View style={styles.salatItem}>
      <SalatText>{time}</SalatText>
      <SalatText>{t(salat)}</SalatText>
      <SalatText>{showDiff ? `${signedDiff > 0 ? "+" : "-"} ${diff_min} ` : " " }</SalatText>
      <SalatText>تنبيه</SalatText>
    </View>
  );
}
const styles = StyleSheet.create({
  salatItem: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 5,
  },
  flex1: {
    flex: 1,
    textAlign: "center",
  },
});
