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
import dayjs from "dayjs";
import "dayjs/locale/ar";
import "dayjs/locale/en";
import {
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from "react-native-popup-menu";
import { Indicators, MONTHS_AR, MONTHS_EN } from "../constants";
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
  const theme = useTheme();
  const pct = max > 0 ? Math.min(score / max, 1) : 0;
  const barColor =
    pct < 0.5 ? "#e07373" : pct < 0.8 ? Colors.gold : "#5cb85c";
  const track =
    theme.mode === "dark" ? "rgba(255,255,255,0.09)" : "rgba(2,16,27,0.07)";
  return (
    <View style={[progressStyles.progressTrack, { backgroundColor: track }]}>
      {pct > 0 && (
        <View
          style={[
            progressStyles.progressFill,
            { width: `${pct * 100}%` as any, backgroundColor: barColor },
          ]}
        />
      )}
    </View>
  );
};

const progressStyles = StyleSheet.create({
  progressTrack: {
    height: 5,
    borderRadius: 2.5,
    marginHorizontal: 5,
    marginBottom: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2.5,
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
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        theme.mode === "dark"
          ? "rgba(255,255,255,0.08)"
          : "rgba(2,16,27,0.05)",
    },
    dateHeader: {
      flex: 1,
      textAlign: "center",
    },
    card: {
      marginHorizontal: 10,
      marginBottom: 14,
      padding: 12,
      borderRadius: 20,
      borderCurve: "continuous",
      backgroundColor: theme.bgCard,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    cardHeader: {
      marginBottom: 6,
      justifyContent: "space-between",
      paddingHorizontal: 5,
      alignItems: "center",
    },
    cardContent: {
      backgroundColor: theme.bgCard,
      borderRadius: 14,
      borderCurve: "continuous",
      overflow: "hidden",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    itemRow: {
      width: "100%",
      justifyContent: "space-between",
      paddingHorizontal: 14,
      minHeight: 52,
      borderBottomColor: theme.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      alignItems: "center",
    },
    itemRowLast: {
      borderBottomWidth: 0,
    },
    itemLabel: {
      flex: 1,
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
      backgroundColor: theme.bgCard,
      maxHeight: Dimensions.get("window").height / 2,
      alignItems: "center",
      justifyContent: "flex-start",
      overflow: "hidden",
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
    },
    menuOptionText: {
      color: theme.text,
      fontSize: 14,
      fontFamily: Classes.textReg.fontFamily,
    },
    menuOptionWrapper: {
      width: "100%",
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border,
      alignItems: "center",
    },
    menuOptionsContainer: {
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      backgroundColor: theme.bgCard,
    },
    sheetHandle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.border,
      marginTop: 10,
      marginBottom: 6,
    },
    sheetTitle: {
      fontSize: 15,
      marginBottom: 6,
      paddingHorizontal: 20,
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
      borderColor: theme.inputBorder,
      borderWidth: 1.5,
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 16,
      fontSize: 22,
      width: "100%",
      marginTop: 10,
      color: theme.inputText,
      backgroundColor: theme.inputBg,
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
      borderRadius: 14,
      borderCurve: "continuous",
      paddingVertical: 10,
      paddingHorizontal: 24,
      marginTop: 14,
      width: "100%",
      gap: 6,
    },
    inputLabel: {
      fontSize: 12,
      marginTop: 5,
      color: theme.textSub,
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
      gap: 8,
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
      backgroundColor:
        theme.mode === "dark"
          ? "rgba(255,255,255,0.12)"
          : "rgba(2,16,27,0.06)",
      padding: 8,
      borderRadius: 12,
    },
  });
}

export default function FormEvaluation({ navigation, route }: any) {
  const { t } = useTranslation();
  const { isRTL, flexRow, textAlign } = useRTL();
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  // Zero scores get a neutral chip instead of a colored one
  const zeroBadgeBg =
    theme.mode === "dark" ? "rgba(255,255,255,0.10)" : "rgba(2,16,27,0.06)";
  const badgeBg = (value: number) =>
    value === 0 ? zeroBadgeBg : getScoreColor(value);
  const badgeText = (value: number) =>
    value === 0 ? theme.textMuted : "white";

  const { results } = useSelector(
    (state: RootState) => state.stats,
  ) as unknown as { results: Array<{ date: string; data: number[][] }> };
  const [day, setDay] = useState(
    route.params?.day?.timestamp || new Date().getTime(),
  );
  const formattedDate = useMemo(() => dayjs(day).format("YYYY-MM-DD"), [day]);
  const dispatch = useDispatch();

  // Always normalise to the current Indicators shape. Reading stored values
  // positionally (with fallbacks) prevents out-of-bounds crashes when the
  // indicator schema changes between app versions.
  const initialData = useMemo(() => {
    const stored = results.find((res: any) => res.date === formattedDate)?.data;
    return Indicators.map((indicator, secIdx) =>
      indicator.items.map((_, itemIdx) => {
        const v = stored?.[secIdx]?.[itemIdx];
        return typeof v === "number" ? v : 0;
      }),
    );
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
            <MaterialCommunityIcons
              name="calendar-month"
              size={24}
              color={theme.headerText}
            />
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
    const d = dayjs(day);
    return {
      day: d.locale("en").format("D"),
      month: isRTL ? MONTHS_AR[d.month()] : MONTHS_EN[d.month()],
      year: d.locale("en").format("YYYY"),
    };
  }, [day, isRTL]);

  const renderMenuOption = useCallback(
    (option: any, index: number, itemId: string | number) => {
      if (typeof option === "object") {
        return (
          <MenuOption key={`${itemId}-${index}`} value={option.value}>
            <View style={[styles.optionRow, { flexDirection: flexRow }]}>
              <Text color={theme.text}>
                {option.key ? t(option.key) : option.label}
              </Text>
              <View
                style={[
                  styles.optionBadge,
                  { backgroundColor: badgeBg(option.value) },
                ]}
              >
                <Text bold color={badgeText(option.value)}>
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
    [flexRow, t, styles, theme],
  );

  if (!data) {
    return <View style={{ backgroundColor: theme.bg, flex: 1 }} />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
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
            pointerEvents: "none",
          }}
        />
      )}
      <View style={[styles.dateNavRow, { flexDirection: "row-reverse" }]}>
        <TouchableOpacity
          onPress={() => setDay(dayjs(day).subtract(1, "day").valueOf())}
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
          onPress={() => setDay(dayjs(day).add(1, "day").valueOf())}
          style={styles.navArrow}
          disabled={!dayjs(day).isBefore(dayjs(), "day")}
        >
          <AntDesign
            name="caret-left"
            size={20}
            color={
              !dayjs(day).isBefore(dayjs(), "day")
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
              <Text
                bold
                color={
                  scores[indexInd] === 0
                    ? theme.textMuted
                    : getScoreColor(scores[indexInd])
                }
              >
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
                    <View
                      style={[
                        styles.itemRow,
                        { flexDirection: flexRow },
                        indexItem === indicator.items.length - 1 &&
                          styles.itemRowLast,
                      ]}
                    >
                      <Text
                        style={styles.itemLabel}
                        align={textAlign}
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
                            backgroundColor: badgeBg(
                              data[indexInd]?.[indexItem] ?? 0,
                            ),
                          },
                        ]}
                      >
                        <Text
                          bold
                          color={badgeText(data[indexInd]?.[indexItem] ?? 0)}
                        >
                          {data[indexInd]?.[indexItem] ?? 0}
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
                    <View style={styles.sheetHandle} />
                    <Text bold align="center" style={styles.sheetTitle}>
                      {t(item.titleKey)}
                    </Text>
                    <ScrollView style={styles.menuScroll}>
                      {item.options && item.options.length ? (
                        item.options.map((op, idx) =>
                          renderMenuOption(op, idx, item.id),
                        )
                      ) : (
                        <View style={styles.numberPadContainer}>
                          <Text align={textAlign} style={styles.inputLabel}>
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
                                  backgroundColor: badgeBg(
                                    parseInt(number) || 0,
                                  ),
                                },
                              ]}
                            >
                              <Text
                                bold
                                color={badgeText(parseInt(number) || 0)}
                                style={{ fontSize: 20 }}
                              >
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
