import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
  TouchableHighlight,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Classes from "../constants/Classes";
import Text from "../components/Text";
import Colors from "../constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { renderers } from "react-native-popup-menu";
import { Input } from "react-native-elements";
import { AntDesign } from "@expo/vector-icons";

const { SlideInMenu } = renderers;
const salatOptions = [
  {
    value: 10,
    label: "كاملة مع الجماعة",
  },
  {
    value: 8,
    label: "جزء مع الجماعة",
  },
  {
    value: 6,
    label: "منفردا في وقتها",
  },
  {
    value: 4,
    label: "منفردا خارج وقتها",
  },
  {
    value: 1,
    label: "قضاء",
  },
];

export const Indicators = [
  {
    title: "🕌 مادة الصلاة",
    id: "0000",
    color: "#e26a00",
    items: [
      {
        id: "0001",
        title: "🌖 الفجر ",
        options: salatOptions,
        weight: 1,
      },
      {
        id: "0002",
        title: "☀️ الظهر ",
        options: salatOptions,
        weight: 1,
      },
      {
        id: "0003",
        title: "🌤 العصر ",
        options: salatOptions,
        weight: 1,
      },
      {
        id: "0004",
        title: "🌅 المغرب ",
        options: salatOptions,
        weight: 1,
      },
      {
        id: "0005",
        title: "🌃 العشاء ",
        options: salatOptions,
        weight: 1,
      },
      {
        id: "0006",
        title: "🕋 السنن الرواتب ",
        options: [],
        weight: 0.7,
      },
      {
        id: "0007",
        title: "🌙 القيام ",
        options: [],
        weight: 1.3,
      },
    ],
  },
  {
    title: "🤲 مادة الأذكار",
    id: "0100",
    color: "white",
    items: [
      {
        id: "0101",
        title: "أذكار الصباح",
        options: [],
        weight: 1,
      },
      {
        id: "0102",
        title: "أذكار المساء",
        options: [],
        weight: 1,
      },
      {
        id: "0103",
        title: "الاستغفار",
        options: [],
        weight: 1,
      },
      {
        id: "0104",
        title: "التسبيح",
        options: [],
        weight: 1,
      },
      {
        id: "0104",
        title: "أذكار أخرى",
        options: [],
        weight: 1,
      },
    ],
  },
  {
    title: "🕋 مادة القرآن",
    id: "0200",
    color: "grey",
    items: [
      {
        id: "0201",
        title: "الورد اليومي ، تلاوة",
        options: [],
        weight: 1,
      },
      {
        id: "0202",
        title: "حفظ ما تيسر",
        options: [],
        weight: 1,
      },
    ],
  },
  {
    title: "🍶 مادة الصيام",
    id: "0300",
    color: "grey",
    items: [
      {
        id: "0301",
        title: "صيام التطوع",
        options: [],
        weight: 1,
      },
      {
        id: "0302",
        title: "صيام الفرض",
        options: [],
        weight: 1,
      },
      {
        id: "0303",
        title: "صيام القضاء",
        options: [],
        weight: 1,
      },
      {
        id: "0304",
        title: "لا",
        options: [],
        weight: 1,
      },
    ],
  },
  {
    title: "💰 مادة الصدقات",
    id: "0400",
    color: "grey",
    items: [
      {
        id: "0401",
        title: "نعم",
        options: [],
        weight: 1,
      },
      {
        id: "0402",
        title: "لا",
        options: [],
        weight: 1,
      },
    ],
  },
  {
    title: "أعمال أخرى",
    id: "0500",
    color: "grey",
    items: [
      {
        id: "0501",
        title: "نعم",
        options: [],
        weight: 1,
      },
      {
        id: "0502",
        title: "لا",
        options: [],
        weight: 1,
      },
    ],
  },
];

type Itype = number[];

export default function FormEvaluation({ navigation, route }) {
  const { results } = useSelector((state) => state.stats);
  const day = route.params?.day?.timestamp || new Date().getTime();
  const [tmpData, settmpData] = useState<Itype[]>();
  // const [data, setdata] = useState();
  const dispatch = useDispatch();
  const getData = React.useCallback(() => {
    // get array of results for a date
    const resultsData = results.find(
      (res) => res.date === moment(day).format("YYYY-MM-DD")
    );
    if (resultsData?.data) return resultsData.data;
    else {
      let arr_values: Itype[] = [];
      for (let index = 0; index < Indicators.length; index++) {
        const Indicator = Indicators[index];
        arr_values[index] = [];
        for (let index2 = 0; index2 < Indicator.items.length; index2++) {
          const item = Indicator.items[index2];
          arr_values[index][index2] = 0;
        }
      }
      return arr_values;
    }
  }, [day]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{flexDirection:"row-reverse"}}>
          <TouchableOpacity
          onPress={() => navigation.push("calendar")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            // width: 83,
            backgroundColor: "grey",
            padding: 8,
            borderRadius: 5,
          }}
        >
          <AntDesign name="calendar" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.push("Stats")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "grey",
            padding: 8,
            borderRadius: 5,
            marginRight:15
          }}
        >
          <AntDesign name="linechart" size={24} color="white" />
        </TouchableOpacity>
        </View>
      ),
    });
    let tt = getData();
    settmpData(tt);
  }, [route.params]);

  useEffect(() => {
    // console.log("results update", results);
  }, [results]);

  const [selectedModule, setselectedModule] = useState();
  const [selectedItem, setselectedItem] = useState();
  const handleInput = (val_: string) => {
    const module = selectedModule;
    const item = selectedItem;
    let val = val_;
    if (!val_) val = "0";
    var tmp = !!tmpData ? tmpData : getData();
    tmp[module][item] = parseInt(val);
    settmpData(tmp);
    // setdata(tmp);
    dispatch({
      type: "UPDATE_RESULT",
      payload: { data: tmp, day },
    });
    setselectedModule(null);
    setselectedItem(null);
    ToastAndroid.show("✅ تم الحفظ ", ToastAndroid.SHORT);
  };

  const SliderSelector = ({ value = 0, onValueChange = (v) => {} }) => {
    const [val, setvalue] = useState(value);
    const handleChange = (v) => {
      setvalue(v);
      onValueChange(v);
      //   console.log(v);
    };
    useEffect(() => {
      setvalue(value);
    }, [value]);

    return (
      <View>
        {/* <Text>{val}</Text> */}
        <Slider
          onValueChange={handleChange}
          value={val}
          style={{ width: 200, height: 40 }}
          minimumValue={0}
          maximumValue={10}
          step={1}
          tapToSeek
          inverted
          minimumTrackTintColor="grey"
          thumbTintColor="black"
          maximumTrackTintColor="green"
          // maximumTrackImage={require("../../assets/kaaba.png")}
          // thumbImage={require("../../assets/kaaba.png")}
        />
      </View>
    );
  };

  const [number, setnumber] = useState("");

  const [overlayOptions, setoverlayOptions] = useState();
  const [customValue, setcustomValue] = useState<string>();

  const months_ar = [
    "جانفي",
    "فيفري",
    "مارس",
    "أفريل",
    "ماي",
    "جوان",
    "جويلية",
    "أوت",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];
  if (!tmpData)
    return <View style={{ backgroundColor: Colors.primary }}></View>;
  return (
    <ScrollView style={{ backgroundColor: Colors.primary }}>
      <Text color="white" align="center" style={{ marginTop: 20 }}>
        {" "}
        تقييم إلتزامي اليومي ليوم{"   "}
        <Text bold color={Colors.gold}>
          {new Date(day).getDate()} {months_ar[new Date(day).getMonth()]}{" "}
          {new Date(day).getFullYear()}
        </Text>{" "}
      </Text>

      {Indicators.map((indicator, index_ind) => {
        return (
          <View key={index_ind + indicator.id} style={Classes.containerCard}>
            <View
              style={{
                marginBottom: 10,
                flexDirection: "row-reverse",
                justifyContent: "space-between",
              }}
            >
              <Text bold> {indicator.title}</Text>
              {tmpData && (
                <Text bold color={Colors.goldDark}>
                  {(Array.isArray(tmpData[index_ind]) &&
                    tmpData[index_ind].reduce((acc, cur) => acc + cur)) +
                    " نقطة " || 0}{" "}
                </Text>
              )}
            </View>
            <View style={{ backgroundColor: "white" }}>
              {indicator.items.map((item, index_item) => {
                return (
                  <TouchableOpacity
                    key={item.id + index_item}
                    style={{
                      flexDirection: "row-reverse",
                      width: "100%",
                      justifyContent: "space-around",
                    }}
                  >
                    <Menu
                      name={"numbers-"}
                      renderer={SlideInMenu}
                      onSelect={(value) => {
                        handleInput(value);
                      }}
                      onClose={() => {
                        setselectedModule(null);
                        setselectedItem(null);
                      }}
                    >
                      <MenuTrigger
                        onPress={() => {
                          setselectedModule(index_ind);
                          setselectedItem(index_item);
                          setoverlayOptions(item.options);
                        }}
                        customStyles={{
                          triggerWrapper: {
                            backgroundColor:
                              selectedItem === index_item &&
                              selectedModule === index_ind
                                ? "#eee"
                                : "white",
                          },
                        }}
                      >
                        <View style={styles.itemRow}>
                          <Text
                            color={
                              selectedItem === index_item &&
                              selectedModule === index_ind
                                ? Colors.goldDark
                                : "black"
                            }
                          >
                            {item.title}
                          </Text>
                          <Text
                            h2
                            bold={
                              selectedItem === index_item &&
                              selectedModule === index_ind
                            }
                          >
                            {tmpData[index_ind][index_item]}{" "}
                          </Text>
                        </View>
                      </MenuTrigger>
                      <MenuOptions
                        customStyles={{
                          optionsWrapper: {
                            backgroundColor: Colors.goldLight,
                            height: overlayOptions?.length
                              ? overlayOptions?.length * 70
                              : Dimensions.get("window").height / 1.9, // ,
                            alignItems: "center",
                            justifyContent: "space-around",
                            overflow: "scroll",
                            borderTopWidth: 5,
                            borderTopColor: Colors.gold,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                          },
                          optionText: {
                            color: "black",
                            // padding: 15,
                            fontSize: 14,
                            fontFamily: Classes.textReg.fontFamily,
                          },
                          optionWrapper: {
                            width: "100%",
                            borderBottomWidth: 1,
                            alignItems: "center",
                          },
                          optionsContainer: {
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,

                            backgroundColor: "white",
                          },
                        }}
                      >
                        <ScrollView style={{ width: "100%" }}>
                          {!!overlayOptions && !!overlayOptions.length ? (
                            overlayOptions.map((op, indx) => {
                              return typeof op === "object" ? (
                                <MenuOption
                                  key={indx + item.id}
                                  value={op.value}
                                >
                                  <View
                                    style={{
                                      width: "100%",
                                      padding: 15,
                                      flexDirection: "row-reverse",
                                      justifyContent: "space-around",
                                    }}
                                  >
                                    <Text>{op.label}</Text>
                                    <Text>{op.value}</Text>
                                  </View>
                                </MenuOption>
                              ) : (
                                <MenuOption
                                  key={indx + item.id}
                                  value={op}
                                  text={op}
                                ></MenuOption>
                              );
                            })
                          ) : (
                            <View style={{ width: 200, alignSelf: "center" }}>
                              <Text align="right" xs>
                                {" "}
                                ادخل العلامة هنا
                              </Text>
                              {/* <Input
                                placeholder=""
                                onChangeText={(v) => setcustomValue(v)}
                                style={{ width: "100%", color: "black" }}
                                leftIcon={{
                                  name: "check",
                                  color: "black",
                                  onPress: () => handleInput(customValue + ""),
                                }}
                              /> */}
                              <Text>{number}</Text>
                              <View>
                                {[
                                  [1, 2, 3],
                                  [4, 5, 6],
                                  [7, 8, 9],
                                ].map((line, indx) => (
                                  <View key={indx} style={styles.container}>
                                    {line.map((item, index) => (
                                      <TouchableHighlight
                                        underlayColor={Colors.secondary}
                                        key={index + "-number"}
                                        onPress={() =>
                                          setnumber(number + item + "")
                                        }
                                        style={styles.item}
                                      >
                                        <Text h1 bold>
                                          {item}
                                        </Text>
                                      </TouchableHighlight>
                                    ))}
                                  </View>
                                ))}
                              </View>
                              <View style={styles.container}>
                              <TouchableOpacity
                                  onPress={() =>
                                    setnumber((n) => n.slice(0, -1))
                                  }
                                  style={styles.item}
                                >
                                  <Ionicons
                                    name="backspace"
                                    size={26}
                                    color="black"
                                  />
                                </TouchableOpacity>
                                <TouchableHighlight
                                  onPress={() => setnumber(number + "0")}
                                  style={styles.item}
                                >
                                  <Text h1 bold>
                                    0
                                  </Text>
                                </TouchableHighlight>
                                <TouchableOpacity
                                  onPress={() =>
                                    handleInput(number)
                                  }
                                  style={styles.item}
                                >
                                  <Ionicons
                                    name="checkmark-circle"
                                    size={30}
                                    color="black"
                                  />
                                </TouchableOpacity>
                              </View>
                            </View>
                          )}
                        </ScrollView>
                      </MenuOptions>
                    </Menu>
                    {/* <SliderSelector
                      value={tmpData[index_ind][index_item]}
                      onValueChange={(v) =>
                        handleInput(index_ind, index_item, v)
                      }
                    /> */}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: "row-reverse",
    width: "100%",
    justifyContent: "space-around",
    height: 50,
    borderBottomColor: "grey",
    borderBottomWidth: 0.2,
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    flex: 0.33333,
    // textAlign:"center",
    alignItems: "center",
    justifyContent: "center",
    height: 60,
  },
});
