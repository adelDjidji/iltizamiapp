import { View, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
// import { useTime } from "react-timer-hook";
import moment from "moment";
import Text from "./Text";

const styles = StyleSheet.create({
  clockDigital: {
    fontSize: 40,
    color: "#eee",
    textAlign: "center",
    margin: 20,
  },
});
export default function Clock() {
  // const { seconds, minutes, hours } = useTime({});
  const [time, settime] = useState("");
  useEffect(() => {
    let it = setInterval(() => {
      settime(moment().format("HH : mm : ss"));
    }, 1000);

    return () => {
      clearInterval(it);
    };
  }, []);

  return (
    <View>
      <Text style={styles.clockDigital}>{time}</Text>
    </View>
  );
}
