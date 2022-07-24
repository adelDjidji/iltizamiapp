import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  Pressable,
  TextInput,
  Dimensions,
} from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Classes from "../constants/Classes";
import Text from "./Text";
import Colors from "../constants/Colors";
import RTLScrollView from "./RTLScrollView";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { AntDesign } from '@expo/vector-icons'; 

export type Goal = {
  id: string;
  title: string;
  done: boolean;
  date: Date;
};
const styles = StyleSheet.create({
  cardGoal: {
    padding: 10,
    borderWidth: 1.5,
    borderRadius: 9,
    marginHorizontal: 5,
    borderColor: Colors.gold,
    width: 140,
    backgroundColor: "#ddd",
    alignItems:"center",
    justifyContent:"center"
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 4,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: Colors.gold,
  },
  buttonClose: {
    backgroundColor: "grey",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
export default function GoalsManager() {
  const { goals } = useSelector((state) => state.goals);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [text, setText] = React.useState("");
  const dispatch = useDispatch();

  const filtredGoals = goals.filter((i: Goal) => {
    return (
      !!i &&
      moment(i.date).format("YYYY-MM-DD") ==
        moment(new Date()).format("YYYY-MM-DD")
    );
  });
  const filtredGoalsDone = filtredGoals.filter((i: Goal) => i.done);

  const openModal = () => {
    setModalVisible(true);
  };
  const handleAdd = () => {
    let obj = {
      id: Math.random() * Math.random(),
      title: text,
      done: false,
      date: new Date(),
    };
    dispatch({
      type: "ADD_GOAL",
      payload: obj,
    });
    setText("");
    setModalVisible(!modalVisible);
  };
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>هدف جديد لهذا اليوم</Text>
            <TextInput
              style={{
                padding: 16,
                marginTop: 20,
                textAlign: "center"
              }}
              onChangeText={setText}
              value={text}
              placeholder={"اكتب الهدف باختصار هنا"}
            />
            <View
              style={{
                flexDirection: "row-reverse",
                justifyContent: "space-around",
                width: Dimensions.get("window").width * 0.6,
              }}
            >
              <Pressable
                style={[styles.button, styles.buttonOpen]}
                disabled={!text}
                onPress={handleAdd}
              >
                  <AntDesign name="check" size={20} color="white" />
                {/* <Text style={styles.textStyle}>تأكيد</Text> */}
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                  <AntDesign name="close" size={20} color="white" />
                {/* <Text style={styles.textStyle}>الغاء</Text> */}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

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
            {`${filtredGoalsDone?.length}/${filtredGoals?.length}`}
          </Text>
        </View>
        <RTLScrollView horizontal>
          {!!goals &&
            filtredGoals.sort((a,b)=>b.date-a.date).map((goal: any) => <Card key={goal.id} {...goal} />)}
          <TouchableOpacity
            style={[
              styles.cardGoal,
              {
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row-reverse",
                borderWidth:0
              },
            ]}
            onPress={openModal}
          >
            <Ionicons name="add" size={24} color="black" />

            <Text bold color={Colors.goldDark}>
              أضف هدف
            </Text>
          </TouchableOpacity>
        </RTLScrollView>
      </View>
    </View>
  );
}

function Card({
  id = "12343",
  title = " صلاة الفجر في المسجد",
  done = false,
  date = undefined,
}) {
  const dispatch = useDispatch();
  const handleDone = () => {
    dispatch({
      type: "CHECK_GOAL",
      payload: id,
    });
  };
  return (
    <View style={[styles.cardGoal, {borderColor: done ? Colors.success: Colors.gold}]}>
      <Text style={{ lineHeight: 18 }} align="center">
        {title} {done ? "✅" : ""}
      </Text>
      {!done && (
        <TouchableOpacity onPress={handleDone}>
          <Text bold color={Colors.goldDark}>
            {"تــم"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
