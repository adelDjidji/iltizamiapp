import { View, StyleSheet } from "react-native";
import React from "react";
import Classes from "../constants/Classes";
const styles = StyleSheet.create({
    container:{
        margin: 10,
        backgroundColor: "#eee",
        elevation: 10,
        shadowColor: "black",
        shadowRadius: 10,
        shadowOffset: { width: 20, height: 4 },
        shadowOpacity: 0.9,
        borderRadius: 10,
        overflow:"hidden"
      },
      body:{
          padding:15,
          backgroundColor: "white"
      }
});
export default function Card(props) {
  return <View style={styles.container}>{props.children}</View>;
}
Card.Header = (props) => (
  <View
    style={{
      marginBottom: 10,
      flexDirection: "row-reverse",
      justifyContent: "space-between",
    }}
  >
    {props.children}
  </View>
);
Card.Body = (props) => (
  <View style={styles.body}>{props.children}</View>
);
