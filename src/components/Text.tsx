import { View, Text as RNText, StyleSheet } from "react-native";
import React from "react";

export default function Text(props) {
  const {
    bold = false,
    size = "",
    h1 = false,
    h2 = false,
    h3 = false,
    h4 = false,
    p = false,
    color = "black",
  } = props;
  const calcSize = () => {
    switch (size) {
      case "p":
        return 12;
      case "h4":
        return 14;
      case "h3":
        return 16;
      case "h2":
        return 18;
      case "h1":
        return 22;
    }
    if (h1) return 22;
    if (h2) return 18;
    if (h3) return 16;
    if (h4) return 14;
    if (p) return 12;
  };
  return (
    <RNText
      style={[
        {
          fontFamily: bold ? "Cairo_700Bold" : "Cairo_400Regular",
          fontSize: calcSize(),
          color: color,
        },
        props.style,
      ]}
    >
      {props.children}
    </RNText>
  );
}
