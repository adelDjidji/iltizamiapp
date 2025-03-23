import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
  TouchableHighlight,
  TextInput,
} from "react-native";
import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import Classes from "../constants/Classes";
import Text from "../components/Text";
import Colors from "../constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Ionicons, AntDesign } from "@expo/vector-icons";

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from "react-native-popup-menu";
import { Indicators, MONTHS_AR } from "../constants";
import Slider from "@react-native-community/slider";

const { SlideInMenu } = renderers;

// Fixed ID key issue in the original Indicators array

export default function FormEvaluation({ navigation, route }) {
  const { results } = useSelector((state) => state.stats);
  const day = route.params?.day?.timestamp || new Date().getTime();
  const formattedDate = useMemo(() => moment(day).format("YYYY-MM-DD"), [day]);
  const dispatch = useDispatch();

  // Memoized calculation of initial data
  const initialData = useMemo(() => {
    const resultsData = results.find((res) => res.date === formattedDate);

    if (resultsData?.data) return resultsData.data;

    // Generate initial empty data structure if no existing data found
    return Indicators.map((indicator) => Array(indicator.items.length).fill(0));
  }, [results, formattedDate]);

  const [data, setData] = useState(initialData);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [overlayOptions, setOverlayOptions] = useState(null);
  const [number, setNumber] = useState("");

  // Update navigation options
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtonsContainer}>
          <TouchableOpacity
            onPress={() => navigation.push("calendar")}
            style={styles.headerButton}
          >
            <AntDesign name="calendar" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.push("Stats")}
            style={[styles.headerButton, { marginRight: 15 }]}
          >
            <AntDesign name="linechart" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  // Update local data when route params change
  useEffect(() => {
    setData(initialData);
  }, [initialData, route.params]);

  // Calculate scores for each indicator section
  const scores = useMemo(
    () => data.map((section) => section.reduce((acc, cur) => acc + cur, 0)),
    [data]
  );

  // Handle input value changes
  const handleInput = useCallback(
    (value) => {
      if (!selectedModule && selectedModule !== 0) return;

      const numValue = value === "" ? 0 : parseInt(value);

      setData((prevData) => {
        const newData = [...prevData];
        if (newData[selectedModule]) {
          newData[selectedModule] = [...newData[selectedModule]];
          newData[selectedModule][selectedItem] = numValue;
        }
        return newData;
      });

      // Update Redux store
      dispatch({
        type: "UPDATE_RESULT",
        payload: {
          data: data.map((section, idx) =>
            idx === selectedModule
              ? section.map((item, i) => (i === selectedItem ? numValue : item))
              : section
          ),
          day,
        },
      });

      setSelectedModule(null);
      setSelectedItem(null);
      setNumber("");
      ToastAndroid.show("✅ تم الحفظ", ToastAndroid.SHORT);
    },
    [selectedModule, selectedItem, data, dispatch, day]
  );

  // Calculate formatted date
  const dateDisplay = useMemo(() => {
    const dateObj = new Date(day);
    return {
      day: dateObj.getDate(),
      month: MONTHS_AR[dateObj.getMonth()],
      year: dateObj.getFullYear(),
    };
  }, [day]);

  // Render number pad buttons
  const renderNumberPad = useCallback(() => {
    const numberGrid = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const menuref = useRef(null);

    return (
      <View>
        <Text align="right" style={styles.inputLabel}>
          ادخل العلامة هنا
        </Text>
        <Text style={styles.numberDisplay}>{number}0%</Text>
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={2}
          maximumValue={10}
          step={1}
          value={number ? parseInt(number) : 2}
          onValueChange={(value) => setNumber(value.toString())}
        />
        <View style={styles.sliderLabels}>
          {[...Array(9)].map((_, i) => (
            <Text key={i} style={styles.sliderLabel}>
              {i * 10 + 20}
            </Text>
          ))}
        </View>
        <View>
          <MenuOption key={`numberbad-$`} value={number}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                backgroundColor: Colors.gold,
                padding: 10,
                borderRadius: 5,
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                }}
              >
                حفظ
              </Text>
              <AntDesign name="check" size={24} color="white" />
            </View>
          </MenuOption>
        </View>
      </View>
    );
    return (
      <View>
        <Text align="right" style={styles.inputLabel}>
          ادخل العلامة هنا
        </Text>
        <Text style={styles.numberDisplay}>{number}</Text>

        {numberGrid.map((line, idx) => (
          <View key={idx} style={styles.numberRow}>
            {line.map((num) => (
              <TouchableHighlight
                key={`num-${num}`}
                underlayColor={Colors.secondary}
                onPress={() => setNumber((prev) => prev + num)}
                style={styles.numberButton}
              >
                <Text h1 bold>
                  {num}
                </Text>
              </TouchableHighlight>
            ))}
          </View>
        ))}

        <View style={styles.numberRow}>
          <TouchableOpacity
            onPress={() => setNumber((prev) => prev.slice(0, -1))}
            style={styles.numberButton}
          >
            <Ionicons name="backspace" size={26} color="black" />
          </TouchableOpacity>

          <TouchableHighlight
            onPress={() => setNumber((prev) => prev + "0")}
            style={styles.numberButton}
          >
            <Text h1 bold>
              0
            </Text>
          </TouchableHighlight>

          <TouchableOpacity
            onPress={() => handleInput(number)}
            style={styles.numberButton}
          >
            <Ionicons name="checkmark-circle" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [number, handleInput]);

  // Render an individual menu option
  const renderMenuOption = useCallback((option, index, itemId) => {
    if (typeof option === "object") {
      return (
        <MenuOption key={`${itemId}-${index}`} value={option.value}>
          <View style={styles.optionRow}>
            <Text>{option.label}</Text>
            <Text>{option.value}</Text>
          </View>
        </MenuOption>
      );
    }

    return (
      <MenuOption key={`${itemId}-${index}`} value={option} text={option} />
    );
  }, []);

  if (!data) {
    return <View style={{ backgroundColor: Colors.primary }} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text color="white" align="center" style={styles.dateHeader}>
        تقييم إلتزامي اليومي ليوم{" "}
        <Text bold color={Colors.gold}>
          {dateDisplay.day} {dateDisplay.month} {dateDisplay.year}
        </Text>
      </Text>

      {Indicators.map((indicator, indexInd) => (
        <View key={indicator.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text bold>{indicator.title}</Text>
            <Text bold color={Colors.goldDark}>
              {scores[indexInd]} نقطة
            </Text>
          </View>

          <View style={styles.cardContent}>
            {indicator.items.map((item, indexItem) => (
              <Menu
                key={item.id}
                renderer={SlideInMenu}
                onSelect={handleInput}
                onClose={() => {
                  setSelectedModule(null);
                  setSelectedItem(null);
                }}
              >
                <MenuTrigger
                  onPress={() => {
                    setSelectedModule(indexInd);
                    setSelectedItem(indexItem);
                    setOverlayOptions(item.options);
                    setNumber("");
                  }}
                  customStyles={{
                    triggerWrapper: {
                      backgroundColor:
                        selectedItem === indexItem &&
                        selectedModule === indexInd
                          ? "#eee"
                          : "white",
                    },
                  }}
                >
                  <View style={styles.itemRow}>
                    <Text
                      color={
                        selectedItem === indexItem &&
                        selectedModule === indexInd
                          ? Colors.goldDark
                          : "black"
                      }
                    >
                      {item.title}
                    </Text>
                    <Text
                      h2
                      bold={
                        selectedItem === indexItem &&
                        selectedModule === indexInd
                      }
                    >
                      {data[indexInd][indexItem]}
                    </Text>
                  </View>
                </MenuTrigger>

                <MenuOptions
                  customStyles={{
                    optionsWrapper: styles.menuOptionsWrapper,
                    optionText: styles.menuOptionText,
                    optionWrapper: styles.menuOptionWrapper,
                    optionsContainer: styles.menuOptionsContainer,
                  }}
                >
                  <ScrollView style={styles.menuScroll}>
                    {overlayOptions && overlayOptions.length ? (
                      overlayOptions.map((op, idx) =>
                        renderMenuOption(op, idx, item.id)
                      )
                    ) : (
                      <View style={styles.numberPadContainer}>
                        {renderNumberPad()}
                      </View>
                    )}
                  </ScrollView>
                </MenuOptions>
              </Menu>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  dateHeader: {
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    ...Classes.containerCard,
    marginBottom: 15,
  },
  cardHeader: {
    marginBottom: 10,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  cardContent: {
    backgroundColor: "white",
    borderRadius: 5,
    overflow: "hidden",
  },
  itemRow: {
    flexDirection: "row-reverse",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: 50,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    alignItems: "center",
  },
  menuOptionsWrapper: {
    backgroundColor: Colors.goldLight,
    maxHeight: Dimensions.get("window").height / 2,
    alignItems: "center",
    justifyContent: "flex-start",
    overflow: "hidden",
    borderTopWidth: 5,
    borderTopColor: Colors.gold,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  menuOptionText: {
    color: "black",
    fontSize: 14,
    fontFamily: Classes.textReg.fontFamily,
  },
  menuOptionWrapper: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  menuOptionsContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "white",
  },
  menuScroll: {
    width: "100%",
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  sliderLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  numberPadContainer: {
    width: 200,
    alignSelf: "center",
    paddingVertical: 15,
  },
  numberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  numberButton: {
    flex: 0.33333,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
  },
  numberDisplay: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
  },
  inputLabel: {
    fontSize: 12,
    marginTop: 5,
  },
  optionRow: {
    width: "100%",
    padding: 15,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
  headerButtonsContainer: {
    flexDirection: "row-reverse",
  },
  submitButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.gold,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  headerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "grey",
    padding: 8,
    borderRadius: 5,
  },
});
