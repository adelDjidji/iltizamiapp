import {
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Container from "../components/Container";
import { LineChart } from "react-native-chart-kit";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

import * as React from "react";
import Text from "../components/Text";
import dayjs from "dayjs";
import Colors from "../constants/Colors";
import * as ScreenOrientation from "expo-screen-orientation";
import { Indicators } from "../constants";
import { useTranslation } from "react-i18next";
import { useRTL } from "../hooks/useRTL";
import { useTheme } from "../hooks/useTheme";
import { Theme } from "../constants/Theme";

// Distinct colors per indicator
const INDICATOR_COLORS: Record<string, string> = {
  "0000": "#e26a00",
  "0100": "#27ae60",
  "0200": "#2980b9",
  "0300": "#8e44ad",
  "0400": "#e74c3c",
  "0500": "#7f8c8d",
};

type DateRange = "7d" | "30d" | "90d" | "all";

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    root: {
      backgroundColor: theme.bg,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 32,
    },
    header: {
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.bgCard,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOpacity: 0.07,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    rangeRow: {
      paddingHorizontal: 16,
      marginBottom: 16,
      gap: 8,
    },
    rangeChip: {
      flex: 1,
      paddingVertical: 7,
      borderRadius: 20,
      backgroundColor: theme.bgCard,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
    },
    rangeChipActive: {
      backgroundColor: Colors.primary,
      borderColor: Colors.blue,
    },
    rangeLabel: {
      fontSize: 11,
      fontFamily: "Cairo_400Regular",
      color: theme.textSub,
    },
    rangeLabelActive: {
      color: "white",
      fontFamily: "Cairo_700Bold",
    },
    summaryRow: {
      paddingHorizontal: 16,
      marginBottom: 12,
      gap: 10,
    },
    summaryCard: {
      flex: 1,
      backgroundColor: theme.bgCard,
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.04,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
    },
    summaryCardHighlight: {
      borderBottomWidth: 2.5,
      borderBottomColor: Colors.gold,
    },
    summaryValue: {
      fontSize: 22,
      fontFamily: "Cairo_700Bold",
      color: theme.text,
      lineHeight: 28,
    },
    summaryLabel: {
      fontSize: 11,
      fontFamily: "Cairo_400Regular",
      color: theme.textMuted,
      marginTop: 2,
    },
    chartCard: {
      marginHorizontal: 16,
      backgroundColor: theme.bgCard,
      borderRadius: 16,
      paddingTop: 16,
      paddingBottom: 0,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
      marginBottom: 12,
    },
    chart: {
      borderRadius: 0,
    },
    legendWrap: {
      paddingHorizontal: 16,
      marginBottom: 8,
    },
    legendGrid: {
      flexWrap: "wrap",
    },
    legendChip: {
      flexDirection: "row",
      alignItems: "center",
      margin: 4,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.bgCard,
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
    },
    legendText: {
      fontSize: 11,
      fontFamily: "Cairo_400Regular",
      color: theme.text,
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 80,
    },
    actions: {
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingVertical: 16,
      marginTop: 12,
    },
    fabPrimary: {
      width: 40,
      height: 40,
      borderRadius: 26,
      backgroundColor: Colors.gold,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: Colors.gold,
      shadowOpacity: 0.45,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    fabSecondary: {
      width: 40,
      height: 40,
      borderRadius: 22,
      backgroundColor: theme.bgCard,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
  });
}

export default function Stats({ navigation }: any) {
  const { t } = useTranslation();
  const { isRTL, flexRow } = useRTL();
  const theme = useTheme();
  const styles = React.useMemo(() => makeStyles(theme), [theme]);
  const dispatch = useDispatch();
  const { results } = useSelector((state: any) => state.stats);

  const confirmReset = () => {
    Alert.alert(t("stats.resetTitle"), t("stats.resetMsg"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("stats.resetConfirm"),
        style: "destructive",
        onPress: () => dispatch({ type: "CLEAR" }),
      },
    ]);
  };
  const [chartWidth, setChartWidth] = React.useState(
    Dimensions.get("window").width - 32,
  );
  const [dateRange, setDateRange] = React.useState<DateRange>("30d");

  const chartConfig = React.useMemo(
    () => ({
      backgroundGradientFromOpacity: 0,
      backgroundGradientToOpacity: 0,
      fillShadowGradientToOpacity: 0,
      decimalPlaces: 0,
      color: (opacity = 1) =>
        theme.mode === "dark"
          ? `rgba(255,255,255,${opacity})`
          : `rgba(2,16,27,${opacity})`,
      labelColor: (opacity = 1) =>
        theme.mode === "dark"
          ? `rgba(200,210,220,${opacity})`
          : `rgba(100,116,139,${opacity})`,
      style: { borderRadius: 0 },
      propsForDots: { r: "0" },
      propsForBackgroundLines: {
        stroke: theme.mode === "dark" ? "rgba(255,255,255,0.08)" : "#f0f2f5",
        strokeDasharray: "",
      },
    }),
    [theme],
  );

  React.useEffect(() => {
    const sub = ScreenOrientation.addOrientationChangeListener((e) => {
      const isPortrait =
        e.orientationInfo.orientation ===
        ScreenOrientation.Orientation.PORTRAIT_UP;
      setChartWidth(
        isPortrait
          ? Dimensions.get("window").width - 32
          : Dimensions.get("window").height - 32,
      );
    });
    return () => ScreenOrientation.removeOrientationChangeListener(sub);
  }, []);

  const allClean = React.useMemo(
    () =>
      results.filter(
        (res: any) => !!res?.data && !!res.data.length && res.data[0].length,
      ),
    [results],
  );

  const filtered = React.useMemo(() => {
    if (dateRange === "all") return allClean;
    const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90;
    const cutoff = dayjs().subtract(days, "days").startOf("day").format("YYYY-MM-DD");
    return allClean.filter((r: any) => r.date >= cutoff);
  }, [allClean, dateRange]);

  const sorted = React.useMemo(
    () =>
      [...filtered].sort((a, b) =>
        a.date < b.date ? -1 : a.date > b.date ? 1 : 0,
      ),
    [filtered],
  );

  const dates = sorted.map((res: any) => res.date);
  const datas: number[][] = sorted.map((res: any) =>
    res.data.map((section: number[]) =>
      section.reduce((a: number, b: number) => a + b, 0),
    ),
  );

  const finalData = Indicators.map((ind, j) => ({
    id: ind.id,
    data: datas.map((d) => d[j] ?? 0),
  }));

  const [visibleIds, setVisibleIds] = React.useState(
    Indicators.map((ind) => ind.id),
  );

  const toggleIndicator = (id: string) => {
    setVisibleIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const chartDatasets = finalData
    .filter((item) => visibleIds.includes(item.id))
    .map((item) => ({
      data: item.data.length > 0 ? item.data : [0],
      color: () => INDICATOR_COLORS[item.id] ?? "#888",
      strokeWidth: 2,
    }));

  const hasData = dates.length > 0;

  const dayTotals = datas.map((day) => day.reduce((a, b) => a + b, 0));
  const avgScore =
    dayTotals.length > 0
      ? Math.round(dayTotals.reduce((a, b) => a + b, 0) / dayTotals.length)
      : 0;
  const bestDay = dayTotals.length > 0 ? Math.max(...dayTotals) : 0;

  const ranges: { key: DateRange; label: string }[] = [
    { key: "7d", label: t("stats.last7") },
    { key: "30d", label: t("stats.last30") },
    { key: "90d", label: t("stats.last90") },
    { key: "all", label: t("stats.allTime") },
  ];

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Container navigation={navigation}>
        {/* Header */}
        <View style={[styles.header, { flexDirection: "row" }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <AntDesign name="arrow-left" size={18} color={theme.text} />
          </TouchableOpacity>
          <Text
            h3
            bold
            style={{ flex: 1, marginHorizontal: 12 }}
            align={isRTL ? "right" : "left"}
          >
            {t("stats.title")}
          </Text>
          {/* <TouchableOpacity onPress={confirmReset} style={styles.backBtn}>
            <MaterialIcons name="delete-outline" size={18} color="#e74c3c" />
          </TouchableOpacity> */}
        </View>

        {/* Date range filter */}
        <View style={[styles.rangeRow, { flexDirection: flexRow }]}>
          {ranges.map((r) => (
            <TouchableOpacity
              key={r.key}
              style={[
                styles.rangeChip,
                dateRange === r.key && styles.rangeChipActive,
              ]}
              onPress={() => setDateRange(r.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.rangeLabel,
                  dateRange === r.key && styles.rangeLabelActive,
                ]}
              >
                {r.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {hasData ? (
          <>
            {/* Summary row */}
            <View style={[styles.summaryRow, { flexDirection: flexRow }]}>
              <View style={styles.summaryCard}>
                <Text bold style={styles.summaryValue}>
                  {dates.length}
                </Text>
                <Text style={styles.summaryLabel}>{t("stats.days")}</Text>
              </View>
              <View style={[styles.summaryCard, styles.summaryCardHighlight]}>
                <Text
                  bold
                  style={[styles.summaryValue, { color: Colors.goldDark }]}
                >
                  {avgScore}
                </Text>
                <Text style={styles.summaryLabel}>{t("stats.avg")}</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text bold style={styles.summaryValue}>
                  {bestDay}
                </Text>
                <Text style={styles.summaryLabel}>{t("stats.best")}</Text>
              </View>
            </View>

            {/* Chart */}
            <View style={styles.chartCard}>
              <LineChart
                key={`${dateRange}-${dates.length}`}
                data={{
                  labels: dates.map((d: string, i: number) => {
                    const step =
                      dates.length > 60
                        ? 14
                        : dates.length > 20
                          ? 7
                          : dates.length > 10
                            ? 3
                            : 1;
                    return i % step === 0
                      ? dayjs(d).format("MM/DD")
                      : "";
                  }),
                  datasets:
                    chartDatasets.length > 0 ? chartDatasets : [{ data: [0] }],
                }}
                withDots={false}
                withVerticalLines={false}
                withHorizontalLines={true}
                withHorizontalLabels={true}
                width={chartWidth}
                height={200}
                yAxisInterval={1}
                chartConfig={chartConfig}
                bezier
                fromZero
                style={styles.chart}
              />
            </View>

            {/* Legend */}
            <View style={styles.legendWrap}>
              <View style={[styles.legendGrid, { flexDirection: "row" }]}>
                {Indicators.map((ind) => {
                  const active = visibleIds.includes(ind.id);
                  const color = INDICATOR_COLORS[ind.id] ?? "#888";
                  return (
                    <TouchableOpacity
                      key={ind.id}
                      style={[
                        styles.legendChip,
                        active && {
                          borderColor: color + "55",
                          backgroundColor: color + "12",
                        },
                      ]}
                      onPress={() => toggleIndicator(ind.id)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.legendDot,
                          { backgroundColor: active ? color : "#ccc" },
                        ]}
                      />
                      <Text
                        style={[
                          styles.legendText,
                          { opacity: active ? 1 : 0.35 },
                        ]}
                      >
                        {t(ind.titleKey)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <AntDesign name="line-chart" size={52} color={theme.textMuted} />
            <Text
              h3
              color={theme.textMuted}
              align="center"
              style={{ marginTop: 20 }}
            >
              {t("stats.noData")}
            </Text>
            <Text
              p
              color={theme.textSub}
              align="center"
              style={{ marginTop: 6, paddingHorizontal: 32 }}
            >
              {t("stats.addRatings")}
            </Text>
          </View>
        )}

        {/* FABs */}
        <View style={[styles.actions, { flexDirection: flexRow }]}>
          <TouchableOpacity
            style={styles.fabPrimary}
            onPress={() => navigation.navigate("form")}
          >
            <AntDesign name="plus" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.fabSecondary}
            onPress={() => navigation.navigate("calendar")}
          >
            <AntDesign name="calendar" size={20} color={theme.text} />
          </TouchableOpacity>
        </View>
      </Container>
    </ScrollView>
  );
}
