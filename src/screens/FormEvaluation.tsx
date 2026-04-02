import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
  TextInput,
  Platform,
} from "react-native";
import celebrationAnimation from "../../assets/animations/Celebrations.json";
import LottieView from "lottie-react-native";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import Classes from "../constants/Classes";
import Text from "../components/Text";
import Colors from "../constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import moment from "moment";
import "moment/locale/ar";
import { Ionicons, AntDesign } from "@expo/vector-icons";

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from "react-native-popup-menu";
import { Indicators } from "../constants";
import { useTranslation } from "react-i18next";
import { useRTL } from "../hooks/useRTL";
import { useTheme } from "../hooks/useTheme";
import { Theme } from "../constants/Theme";

const { SlideInMenu } = renderers;
const MAX_ITEM_SCORE = 10;

const getScoreColor = (value: number) => {
  if (value === 0) return "#bbb";
  if (value <= 4) return "#e07373";
  if (value <= 7) return Colors.gold;
  return "#5cb85c";
};

const CategoryProgressBar = ({
  score,
  max,
}: {
  score: number;
  max: number;
}) => {
  const pct = max > 0 ? Math.min(score / max, 1) : 0;
  const barColor =
    pct === 0
      ? "#e0e0e0"
      : pct < 0.5
        ? "#e07373"
        : pct < 0.8
          ? Colors.gold
          : "#5cb85c";
  return (
    <View style={progressStyles.progressTrack}>
      <View
        style={[
          progressStyles.progressFill,
          { width: `${pct * 100}%` as any, backgroundColor: barColor },
        ]}
      />
    </View>
  );
};

const progressStyles = StyleSheet.create({
  progressTrack: {
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    marginHorizontal: 5,
    marginBottom: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
});

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.bg,
    },
    dateNavRow: {
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 10,
      marginTop: 20,
      marginBottom: 10,
    },
    navArrow: {
      padding: 8,
    },
    dateHeader: {
      flex: 1,
      textAlign: "center",
    },
    card: {
      ...Classes.containerCard,
      backgroundColor: theme.bgCard,
      marginBottom: 15,
    },
    cardHeader: {
      marginBottom: 6,
      justifyContent: "space-between",
      paddingHorizontal: 5,
      alignItems: "center",
    },
    cardContent: {
      backgroundColor: theme.bgCard,
      borderRadius: 8,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.border,
    },
    itemRow: {
      width: "100%",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      height: 52,
      borderBottomColor: theme.border,
      borderBottomWidth: 1,
      alignItems: "center",
    },
    scoreBadge: {
      borderRadius: 14,
      paddingHorizontal: 10,
      paddingVertical: 3,
      minWidth: 34,
      alignItems: "center",
    },
    optionBadge: {
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 2,
      minWidth: 28,
      alignItems: "center",
    },
    menuOptionsWrapper: {
      backgroundColor: Colors.goldLight,
      maxHeight: Dimensions.get("window").height / 2,
      alignItems: "center",
      justifyContent: "flex-start",
      overflow: "hidden",
      borderTopWidth: 4,
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
    numberPadContainer: {
      width: 220,
      alignSelf: "center",
      paddingVertical: 20,
      alignItems: "center",
    },
    numberInput: {
      borderColor: Colors.gold,
      borderWidth: 1.5,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 16,
      fontSize: 22,
      width: "100%",
      marginTop: 10,
      color: "#222",
      backgroundColor: "#fafafa",
      textAlign: "center",
    },
    numberPreview: {
      marginTop: 12,
      borderRadius: 24,
      paddingHorizontal: 20,
      paddingVertical: 6,
      alignItems: "center",
    },
    confirmButton: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors.gold,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 24,
      marginTop: 14,
      width: "100%",
      gap: 6,
    },
    inputLabel: {
      fontSize: 12,
      marginTop: 5,
      color: "#666",
    },
    optionRow: {
      width: "100%",
      paddingVertical: 12,
      paddingHorizontal: 20,
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerButtonsContainer: {
      flexDirection: "row",
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
      backgroundColor: "rgba(255,255,255,0.15)",
      padding: 8,
      borderRadius: 8,
    },
  });
}

export default function FormEvaluation({ navigation, route }: any) {
  const { t } = useTranslation();
  const { isRTL, flexRow, textAlign } = useRTL();
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const { results } = useSelector(
    (state: RootState) => state.stats,
  ) as unknown as { results: Array<{ date: string; data: number[][] }> };
  const [day, setDay] = useState(
    route.params?.day?.timestamp || new Date().getTime(),
  );
  const formattedDate = useMemo(
    () => moment(day).locale("en").format("YYYY-MM-DD"),
    [day],
  );
  const dispatch = useDispatch();

  const initialData = useMemo(() => {
    const resultsData = results.find((res: any) => res.date === formattedDate);
    if (resultsData?.data) return resultsData.data;
    return Indicators.map((indicator) => Array(indicator.items.length).fill(0));
  }, [results, formattedDate]);

  const [data, setData] = useState(initialData);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [number, setNumber] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtonsContainer}>
          <TouchableOpacity
            onPress={() => navigation.push("calendar")}
            style={styles.headerButton}
          >
            <AntDesign name="calendar" size={24} color={theme.headerText} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.push("Stats")}
            style={[styles.headerButton, { marginRight: 15 }]}
          >
            <AntDesign name="line-chart" size={24} color={theme.headerText} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, theme]);

  useEffect(() => {
    if (route.params?.day?.timestamp) {
      setDay(route.params.day.timestamp);
    }
  }, [route.params?.day?.timestamp]);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const scores = useMemo(
    () =>
      data.map((section: number[]) =>
        section.reduce((acc: number, cur: number) => acc + cur, 0),
      ),
    [data],
  );

  const handleInput = useCallback(
    (value: string | number) => {
      if (!selectedModule && selectedModule !== 0) return;

      const raw = parseInt(String(value));
      const numValue = isNaN(raw)
        ? 0
        : Math.min(MAX_ITEM_SCORE, Math.max(0, raw));

      const newData = data.map((section: number[], idx: number) =>
        idx === selectedModule
          ? section.map((item: number, i: number) =>
              i === selectedItem ? numValue : item,
            )
          : section,
      );

      setData(newData);
      dispatch({ type: "UPDATE_RESULT", payload: { data: newData, day } });
      const allPrayersPerfect = newData[0]
        ?.slice(0, 5)
        .every((v: number) => v === MAX_ITEM_SCORE);
      if (allPrayersPerfect) setShowCelebration(true);
      setSelectedModule(null);
      setSelectedItem(null);
      setNumber("");
      if (Platform.OS === "android") {
        ToastAndroid.show(t("form.saved"), ToastAndroid.SHORT);
      }
    },
    [selectedModule, selectedItem, data, dispatch, day],
  );

  const dateDisplay = useMemo(() => {
    const m = moment(day).local();
    return {
      day: m.clone().locale("en").format("D"),
      month: m
        .clone()
        .locale(isRTL ? "ar" : "en")
        .format("MMMM"),
      year: m.clone().locale("en").format("YYYY"),
    };
  }, [day, isRTL]);

  const renderMenuOption = useCallback(
    (option: any, index: number, itemId: string | number) => {
      if (typeof option === "object") {
        return (
          <MenuOption key={`${itemId}-${index}`} value={option.value}>
            <View style={[styles.optionRow, { flexDirection: flexRow }]}>
              <Text color="black">
                {option.key ? t(option.key) : option.label}
              </Text>
              <View
                style={[
                  styles.optionBadge,
                  { backgroundColor: getScoreColor(option.value) },
                ]}
              >
                <Text bold color="white">
                  {option.value}
                </Text>
              </View>
            </View>
          </MenuOption>
        );
      }
      return (
        <MenuOption key={`${itemId}-${index}`} value={option} text={option} />
      );
    },
    [flexRow, t, styles],
  );

  if (!data) {
    return <View style={{ backgroundColor: theme.bg, flex: 1 }} />;
  }

  return (
    <ScrollView style={styles.container}>
      {showCelebration && (
        <LottieView
          source={celebrationAnimation}
          autoPlay
          loop={false}
          onAnimationFinish={() => setShowCelebration(false)}
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height / 2,
            position: "absolute",
            top: 0,
            zIndex: 12,
          }}
        />
      )}
      <View style={[styles.dateNavRow, { flexDirection: "row-reverse" }]}>
        <TouchableOpacity
          onPress={() => setDay(moment(day).subtract(1, "day").valueOf())}
          style={styles.navArrow}
        >
          <AntDesign name="caret-right" size={20} color={theme.text} />
        </TouchableOpacity>

        <Text align="center" style={styles.dateHeader}>
          {t("form.dailyTitle")}{" "}
          <Text bold color={Colors.gold}>
            {dateDisplay.day} {dateDisplay.month} {dateDisplay.year}
          </Text>
        </Text>

        <TouchableOpacity
          onPress={() => setDay(moment(day).add(1, "day").valueOf())}
          style={styles.navArrow}
          disabled={moment(day).isSameOrAfter(moment(), "day")}
        >
          <AntDesign
            name="caret-left"
            size={20}
            color={
              moment(day).isSameOrAfter(moment(), "day")
                ? theme.textMuted
                : theme.text
            }
          />
        </TouchableOpacity>
      </View>

      {Indicators.map((indicator, indexInd) => {
        const maxScore = indicator.items.length * MAX_ITEM_SCORE;
        return (
          <View key={indicator.id} style={styles.card}>
            <View style={[styles.cardHeader, { flexDirection: flexRow }]}>
              <Text bold>{t(indicator.titleKey)}</Text>
              <Text bold color={getScoreColor(scores[indexInd])}>
                {scores[indexInd]}
                <Text color={theme.textMuted}> / {maxScore}</Text>
              </Text>
            </View>
            <CategoryProgressBar score={scores[indexInd]} max={maxScore} />

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
                      setNumber("");
                    }}
                    customStyles={{
                      triggerWrapper: {
                        backgroundColor:
                          selectedItem === indexItem &&
                          selectedModule === indexInd
                            ? Colors.goldLight
                            : theme.bgCard,
                      },
                    }}
                  >
                    <View style={[styles.itemRow, { flexDirection: flexRow }]}>
                      <Text
                        color={
                          selectedItem === indexItem &&
                          selectedModule === indexInd
                            ? Colors.goldDark
                            : theme.text
                        }
                      >
                        {t(item.titleKey)}
                      </Text>
                      <View
                        style={[
                          styles.scoreBadge,
                          {
                            backgroundColor: getScoreColor(
                              data[indexInd][indexItem],
                            ),
                          },
                        ]}
                      >
                        <Text bold color="white">
                          {data[indexInd][indexItem]}
                        </Text>
                      </View>
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
                      {item.options && item.options.length ? (
                        item.options.map((op, idx) =>
                          renderMenuOption(op, idx, item.id),
                        )
                      ) : (
                        <View style={styles.numberPadContainer}>
                          <Text
                            align={textAlign}
                            style={styles.inputLabel}
                            color="#666"
                          >
                            {t("form.enterValue")}
                          </Text>
                          <TextInput
                            value={number}
                            onChangeText={(text) => {
                              const digits = text.replace(/[^0-9]/g, "");
                              const num = parseInt(digits);
                              if (
                                digits === "" ||
                                (!isNaN(num) && num <= MAX_ITEM_SCORE)
                              ) {
                                setNumber(digits);
                              }
                            }}
                            style={styles.numberInput}
                            placeholder="0 – 10"
                            keyboardType="numeric"
                            maxLength={2}
                            textAlign="center"
                          />
                          {number !== "" && (
                            <View
                              style={[
                                styles.numberPreview,
                                {
                                  backgroundColor: getScoreColor(
                                    parseInt(number) || 0,
                                  ),
                                },
                              ]}
                            >
                              <Text bold color="white" style={{ fontSize: 20 }}>
                                {number}
                              </Text>
                            </View>
                          )}
                          <TouchableOpacity
                            onPress={() => handleInput(number)}
                            style={[
                              styles.confirmButton,
                              { flexDirection: flexRow },
                            ]}
                          >
                            <Ionicons
                              name="checkmark-circle"
                              size={22}
                              color="white"
                            />
                            <Text bold color="white" style={{ marginRight: 8 }}>
                              {t("form.save")}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </ScrollView>
                  </MenuOptions>
                </Menu>
              ))}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}
