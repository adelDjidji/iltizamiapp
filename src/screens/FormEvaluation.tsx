import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Classes from "../constants/Classes";
import Text from "../components/Text";
import Colors from "../constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { AntDesign } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { renderers } from "react-native-popup-menu";
import { Input } from "react-native-elements";
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
    title: "مادة الصلاة",
    id: "0000",
    color:"black",
    items: [
      {
        id: "0001",
        title: "الفجر",
        options: salatOptions,
        weight: 1,
      },
      {
        id: "0002",
        title: "الظهر",
        options: salatOptions,
        weight: 1,
      },
      {
        id: "0003",
        title: "العصر",
        options: salatOptions,
        weight: 1,
      },
      {
        id: "0004",
        title: "المغرب",
        options: salatOptions,
        weight: 1,
      },
      {
        id: "0005",
        title: "العشاء",
        options: salatOptions,
        weight: 1,
      },
      {
        id: "0006",
        title: "النوافل",
        options: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
        weight: 0.7,
      },
      {
        id: "0007",
        title: "القيام",
        options: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
        weight: 1.3,
      },
    ],
  },
  {
    title: "مادة الأذكار",
    id: "0100",
    color:"white",
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
    title: "مادة القرآن",
    id: "0200",
    color:"grey",
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
    title: "مادة الصيام",
    id: "0300",
    color:"grey",
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
    title: "مادة الصدقات",
    id: "0400",
    color:"grey",
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
    color:"grey",
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

export default function FormEvaluation({ navigation }) {
  const { results } = useSelector((state) => state.stats);

  const [tmpData, settmpData] = useState<Itype[]>();
  const [data, setdata] = useState();
  const dispatch = useDispatch();
  const getData = () => {
    // get array of results for current date
    const resultsData = results.find(
      (res) => res.date === moment().format("YYYY-MM-DD")
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
  };

  useEffect(() => {
    navigation.setOptions({
      title: "دفتر المحاسبة",
      //   headerRight: () => (
      //     <TouchableOpacity
      //       onPress={save}
      //       style={{
      //         flexDirection: "row",
      //         alignItems: "center",
      //         justifyContent: "space-between",
      //         // width: 83,
      //         backgroundColor: "grey",
      //         padding: 8,
      //         borderRadius: 5,
      //       }}
      //     >
      //       <Text style={{ marginRight: 5 }}>حفظ</Text>
      //       <AntDesign name="checkcircle" size={18} color={Colors.primary} />
      //     </TouchableOpacity>
      //   ),
    });
    // clear()
    let tt = getData();
    settmpData(tt);
  }, []);

  useEffect(() => {
    // console.log("results update", results);
  }, [results]);

  //   const init = () => {
  //     let arr_values: Itype[] = [];
  //     for (let index = 0; index < Indicators.length; index++) {
  //       const Indicator = Indicators[index];
  //       arr_values[index] = [];
  //       for (let index2 = 0; index2 < Indicator.items.length; index2++) {
  //         const item = Indicator.items[index2];
  //         arr_values[index][index2] = 0;
  //       }
  //     }
  //     //   console.log("arrr",arr_values);
  //     if (!results[0] || !results[0].length)
  //       dispatch({
  //         type: "UPDATE_RESULT",
  //         payload: arr_values,
  //       });
  //   };
  //   React.useEffect(() => {
  //     // init();
  //   }, []);
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
    setdata(tmp);
    dispatch({
      type: "UPDATE_RESULT",
      payload: tmp,
    });
    setselectedModule(null);
    setselectedItem(null);
  };
  const save = () => {
    console.log("save data tmp", tmpData);
    dispatch({
      type: "UPDATE_RESULT",
      payload: tmpData,
    });
  };
  const clear = () => {
    dispatch({
      type: "CLEAR",
    });
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

  const [overlayOptions, setoverlayOptions] = useState();
  const [customValue, setcustomValue] = useState<string>();

  if (!tmpData)
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  return (
    <ScrollView>
      <Text> تقييم إلتزامي اليومي ليوم </Text>

      {/* <Button title={"Clear"} onPress={clear} /> */}
      {/* <Text> {JSON.stringify(tmpData)} </Text> */}
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
                    tmpData[index_ind].reduce((acc, cur) => acc + cur)) ||
                    0}
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
                      name="numbers"
                      renderer={SlideInMenu}
                      onSelect={(value) => {
                        console.log("selected =", value);
                        handleInput(value);
                      }}
                    >
                      <MenuTrigger
                        onPress={() => {
                          console.log(index_ind, index_item);
                          setselectedModule(index_ind);
                          setselectedItem(index_item);
                          setoverlayOptions(item.options);
                        }}
                        customStyles={{
                          triggerWrapper: {
                            backgroundColor:
                              selectedItem === index_item &&
                              selectedModule === index_ind
                                ? Colors.gold
                                : "white",
                          },
                        }}
                      >
                        <View style={styles.itemRow}>
                          <Text>{item.title}</Text>
                          <Text>{tmpData[index_ind][index_item]}</Text>
                        </View>
                      </MenuTrigger>
                      <MenuOptions
                        customStyles={{
                          optionsWrapper: {
                            backgroundColor: Colors.goldDark,
                            height: Dimensions.get("window").height / 2,
                            alignItems: "center",
                            justifyContent: "space-around",
                            overflow: "scroll",
                          },
                          optionText: {
                            color: "white",
                            // padding: 15,
                            fontSize: 14,
                            fontFamily: Classes.textReg.fontFamily,
                          },
                          optionWrapper: {
                            width: "100%",
                            borderBottomWidth: 1,
                            alignItems: "center",

                            //   justifyContent:"center"
                          },
                          optionsContainer: {
                            //   height:290
                          },
                        }}
                      >
                        <ScrollView style={{ width:"100%"}}>
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
                                    <Text color="white">{op.label}</Text>
                                    <Text color="white">{op.value}</Text>
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
                            <View style={{ width: 200 }}>
                              <Input
                                placeholder="ادخل علامة هنا"
                                onChangeText={(v) => setcustomValue(v)}
                                style={{ width: "100%", color: "white" }}
                                leftIcon={{
                                  name: "check",
                                  color: "white",
                                  onPress: () => handleInput(customValue + ""),
                                }}
                              />
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
    height: 30,
    borderBottomColor: Colors.gold,
    borderBottomWidth: 0.2,
    alignItems: "center",
  },
});
