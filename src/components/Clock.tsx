import { View, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Text from "./Text";

export default function Clock() {
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const it = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(it);
  }, []);

  return (
    <View style={styles.wrap}>
      <Text style={styles.time}>{now.format("HH:mm")}</Text>
      <Text style={styles.seconds}>{now.format("ss")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 6,
    margin: 20,
  },
  time: {
    fontSize: 54,
    lineHeight: 62,
    color: "#ffffff",
    letterSpacing: 1.5,
    fontVariant: ["tabular-nums"],
  },
  seconds: {
    fontSize: 18,
    lineHeight: 38,
    color: "rgba(255,255,255,0.65)",
    letterSpacing: 1,
    fontVariant: ["tabular-nums"],
  },
});
