import { StyleSheet, StatusBar } from "react-native";
const Classes = StyleSheet.create({
    screenContainer:{
        paddingTop:StatusBar.currentHeight
    },
    textReg:{
        fontFamily:"Cairo_400Regular",
        fontSize:13
    },
    textBold:{
        fontFamily:"Cairo_700Bold",
        fontSize:14
    },
    containerCard:{
        margin: 10,
        backgroundColor: "#eee",
        elevation: 10,
        shadowColor: "black",
        shadowRadius: 10,
        shadowOffset: { width: 20, height: 4 },
        shadowOpacity: 0.9,
        borderRadius: 10,
        padding: 10,
        overflow:"hidden"
      }
});
export default Classes
