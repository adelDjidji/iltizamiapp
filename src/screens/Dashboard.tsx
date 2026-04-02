import React, { useMemo } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  StatusBar,
  ScrollView,
  StyleSheet,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import * as Notifications from "expo-notifications";

import Container from "../components/Container";
import Text from "../components/Text";
import Colors from "../constants/Colors";
import GoalsManager from "../components/GoalsManager";
import ChallengeCard from "../components/ChallengeCard";
import { useRTL } from "../hooks/useRTL";
import { useTheme } from "../hooks/useTheme";
import { Theme } from "../constants/Theme";

const { width: SW } = Dimensions.get("window");
const HALF_W = SW / 2 - 15;
const FULL_W = SW - 20;

// ── Language toggle ─────────────────────────────────────────────────
const LanguageSelector = () => {
  const dispatch = useDispatch();
  const { isRTL } = useRTL();
  const theme = useTheme();
  const select = (lang: "ar" | "en") =>
    dispatch({ type: "SET_LANGUAGE", payload: lang });

  return (
    <View style={[langStyles.pill, { backgroundColor: theme.bgCard + "cc" }]}>
      <TouchableOpacity
        style={[
          langStyles.btn,
          { borderColor: theme.border },
          !isRTL && { backgroundColor: Colors.gold, borderColor: Colors.gold },
        ]}
        onPress={() => select("en")}
        activeOpacity={0.8}
      >
        <Text
          style={[
            langStyles.btnText,
            { color: theme.textMuted },
            !isRTL && { color: Colors.primary, fontWeight: "700" },
          ]}
        >
          EN
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          langStyles.btn,
          { borderColor: theme.border },
          isRTL && { backgroundColor: Colors.gold, borderColor: Colors.gold },
        ]}
        onPress={() => select("ar")}
        activeOpacity={0.8}
      >
        <Text
          style={[
            langStyles.btnText,
            { color: theme.text },
            isRTL && { color: Colors.primary, fontWeight: "700" },
          ]}
        >
          عربي
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const langStyles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    borderRadius: 20,
    overflow: "hidden",
    gap: 4,
    padding: 3,
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 20,
  },
  btnText: {
    fontSize: 13,
  },
});

// ── Theme toggle ─────────────────────────────────────────────────────
const ThemeToggle = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDark = theme.mode === "dark";
  return (
    <TouchableOpacity
      style={[
        iconBtn.base,
        {
          backgroundColor: theme.bgCard,
          borderColor: theme.border,
        },
      ]}
      onPress={() =>
        dispatch({ type: "SET_THEME", payload: isDark ? "light" : "dark" })
      }
      activeOpacity={0.8}
    >
      <Feather name={isDark ? "sun" : "moon"} size={18} color={theme.textSub} />
    </TouchableOpacity>
  );
};

// ── Settings button ──────────────────────────────────────────────────
const SettingsButton = ({ onPress }: { onPress: () => void }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      style={[
        iconBtn.base,
        {
          backgroundColor: theme.bgCard,
          borderColor: theme.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Feather name="settings" size={18} color={theme.textSub} />
    </TouchableOpacity>
  );
};

const iconBtn = StyleSheet.create({
  base: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 20,
  },
});

// ── Half-width card (Adkar / Journal) ───────────────────────────────
const HalfCard = ({
  icon,
  title,
  subtitle,
  accentColor,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  accentColor: string;
  onPress: () => void;
}) => {
  const { isRTL } = useRTL();
  const theme = useTheme();
  const cardBg = theme.mode === "dark" ? "rgba(1,19,35,0.82)" : theme.bgCard;
  return (
    <TouchableOpacity
      style={[
        styles.halfCard,
        {
          backgroundColor: cardBg,
          borderColor: accentColor + "40",
        },
      ]}
      onPress={onPress}
      activeOpacity={0.82}
    >
      {/* Accent top-bar */}
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

      {/* Icon circle */}
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: accentColor + "18",
            borderColor: accentColor + "45",
          },
        ]}
      >
        {icon}
      </View>

      {/* Title + subtitle */}
      <Text
        style={[styles.halfTitle, { color: theme.text, textAlign: "center" }]}
      >
        {title}
      </Text>
      <Text
        style={[styles.halfSub, { color: theme.textSub, textAlign: "center" }]}
      >
        {subtitle}
      </Text>

      {/* Chevron */}
      <AntDesign
        name="right"
        size={11}
        color={accentColor + "99"}
        style={[
          styles.chevron,
          isRTL ? { left: 10, right: undefined } : { right: 10 },
          isRTL && { transform: [{ scaleX: -1 }] },
        ]}
      />
    </TouchableOpacity>
  );
};

// ── Full-width card (Stats) ──────────────────────────────────────────
const FullCard = ({
  icon,
  title,
  subtitle,
  accentColor,
  badgeValue,
  badgeLabel,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  accentColor: string;
  badgeValue?: string | number;
  badgeLabel?: string;
  onPress: () => void;
}) => {
  const { isRTL, flexRow } = useRTL();
  const theme = useTheme();
  const cardBg = theme.mode === "dark" ? "rgba(1,19,35,0.82)" : theme.bgCard;
  return (
    <TouchableOpacity
      style={[
        styles.fullCard,
        {
          backgroundColor: cardBg,
          borderColor: accentColor + "40",
        },
      ]}
      onPress={onPress}
      activeOpacity={0.82}
    >
      {/* Accent side-bar */}
      <View
        style={[
          styles.accentBarLeft,
          {
            backgroundColor: accentColor,
            [isRTL ? "right" : "left"]: 0,
          },
        ]}
      />

      <View style={[styles.fullCardInner, { flexDirection: flexRow }]}>
        {/* Icon */}
        <View
          style={[
            styles.fullCardIcon,
            {
              backgroundColor: accentColor + "18",
              borderColor: accentColor + "45",
              marginRight: isRTL ? 0 : 14,
              marginLeft: isRTL ? 14 : 0,
            },
          ]}
        >
          {icon}
        </View>

        {/* Text */}
        <View
          style={[
            styles.fullCardText,
            { alignItems: isRTL ? "flex-end" : "flex-start" },
          ]}
        >
          <Text style={[styles.fullTitle, { color: theme.text }]}>{title}</Text>
          <Text style={[styles.fullSub, { color: theme.textSub }]}>
            {subtitle}
          </Text>
        </View>

        {/* Live badge */}
        {/* {badgeValue !== undefined && (
          <View
            style={[
              styles.badge,
              {
                backgroundColor: accentColor + "18",
                borderColor: accentColor + "50",
                marginLeft: isRTL ? 0 : "auto",
                marginRight: isRTL ? "auto" : 0,
              },
            ]}
          >
            <Text style={[styles.badgeValue, { color: accentColor }]}>
              {badgeValue}
            </Text>
            <Text style={[styles.badgeLabel, { color: theme.textMuted }]}>
              {badgeLabel}
            </Text>
          </View>
        )} */}

        {/* Chevron */}
        <AntDesign
          name="right"
          size={12}
          color={accentColor + "88"}
          style={[
            { marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0 },
            isRTL && { transform: [{ scaleX: -1 }] },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

// ── Dashboard ────────────────────────────────────────────────────────
export default function Dashboard({ navigation }: any) {
  const { t } = useTranslation();
  const { flexRow, isRTL } = useRTL();
  const theme = useTheme();
  const { results } = useSelector((state: any) => state.stats);

  const recordedDays = useMemo(
    () => results.filter((r: any) => r.date && r.data?.length > 0).length,
    [results],
  );

  const todayRecorded = useMemo(() => {
    const today = dayjs().format("YYYY-MM-DD");
    return results.some((r: any) => r.date === today && r.data?.length > 0);
  }, [results]);

  const bgImage =
    theme.mode === "dark"
      ? require("../../assets/26080.jpg")
      : require("../../assets/bg-w.png");

  const overlay =
    theme.mode === "dark" ? "rgba(1,19,35,0.45)" : "rgba(255,255,255,0.35)";

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Container navigation={navigation}>
        <ImageBackground source={bgImage} resizeMode="cover" style={styles.bg}>
          {/* Tint overlay */}
          <View
            style={[StyleSheet.absoluteFill, { backgroundColor: overlay }]}
          />

          {/* Header */}
          <View
            style={[
              styles.header,
              { marginTop: StatusBar.currentHeight, flexDirection: flexRow },
            ]}
          >
            <LanguageSelector />
            <View
              style={[
                styles.headerRight,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
            >
              <ThemeToggle />
              <SettingsButton onPress={() => navigation.push("config")} />
            </View>
          </View>

          <GoalsManager />

          {/* ── Card grid ─────────────────────────────── */}
          <View style={styles.grid}>
            {/* Row 1 — Adkar + Journal */}
            <View style={[styles.row, { flexDirection: flexRow }]}>
              <HalfCard
                accentColor="#3d9de8"
                title={t("dashboard.adkar")}
                subtitle={t("dashboard.adkarSub")}
                icon={
                  <Image
                    style={styles.cardImg}
                    source={require("../../assets/prayer.png")}
                  />
                }
                onPress={() => navigation.push("adkar")}
              />
              <HalfCard
                accentColor="#e07e3c"
                title={t("dashboard.form")}
                subtitle={
                  todayRecorded
                    ? t("dashboard.formSubDone")
                    : t("dashboard.formSub")
                }
                icon={
                  <Image
                    style={styles.cardImg}
                    source={require("../../assets/checklist.png")}
                  />
                }
                onPress={() => navigation.push("form")}
              />
            </View>

            {/* Row 2 — Stats */}
            <FullCard
              accentColor="#9b59b6"
              title={t("dashboard.stats")}
              subtitle={t("dashboard.statsSub")}
              icon={<Feather name="bar-chart-2" size={22} color="#9b59b6" />}
              badgeValue={recordedDays}
              badgeLabel={t("stats.days")}
              onPress={() => navigation.push("Stats")}
            />

            {/* Row 3 — Challenge */}
            <ChallengeCard onPress={() => navigation.push("challenge")} />

            {/* ── DEV: test push notification ───────────────────── */}
            {/* {__DEV__ && (
              <TouchableOpacity
                style={[
                  styles.devTestBtn,
                  { backgroundColor: theme.bgCard, borderColor: theme.border },
                ]}
                activeOpacity={0.7}
                onPress={async () => {
                  await Notifications.scheduleNotificationAsync({
                    content: {
                      title: "تذكير الصلاة 🕌",
                      body: "لا تنسَ تسجيل تقييم صلاتك 🕌",
                      data: { screen: "form" },
                      sound: true,
                    },
                    trigger: {
                      type: "timeInterval",
                      seconds: 3,
                      repeats: false,
                    } as any,
                  });
                }}
              >
                <Feather name="bell" size={14} color={theme.textMuted} />
                <Text style={[styles.devTestLabel, { color: theme.textMuted }]}>
                  TEST NOTIF (3s)
                </Text>
              </TouchableOpacity>
            )} */}
          </View>
        </ImageBackground>
      </Container>
    </ScrollView>
  );
}

// ── Styles ───────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  bg: {
    minHeight: Dimensions.get("window").height,
    paddingTop: 100,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    zIndex: 2,
  },
  headerRight: {
    gap: 8,
    alignItems: "center",
  },
  grid: {
    paddingHorizontal: 10,
    paddingTop: 4,
    paddingBottom: 30,
    gap: 10,
  },
  row: {
    gap: 10,
  },

  // ─ Half card
  halfCard: {
    width: HALF_W,
    borderRadius: 16,
    borderWidth: 1,
    paddingTop: 0,
    paddingBottom: 18,
    paddingHorizontal: 12,
    alignItems: "center",
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  accentBar: {
    width: "100%",
    height: 3,
    marginBottom: 16,
    borderRadius: 2,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  cardImg: {
    width: 26,
    height: 26,
  },
  halfTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
  },
  halfSub: {
    fontSize: 11,
    lineHeight: 16,
  },
  chevron: {
    position: "absolute",
    bottom: 10,
  },

  // ─ Full card
  fullCard: {
    width: FULL_W,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  accentBarLeft: {
    position: "absolute",
    top: 0,
    width: 3,
    height: "100%",
    borderRadius: 2,
  },
  fullCardInner: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: "center",
  },
  fullCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullCardText: {
    flex: 1,
    paddingHorizontal: 12,
    gap: 3,
  },
  fullTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  fullSub: {
    fontSize: 11,
  },
  badge: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
    minWidth: 52,
  },
  badgeValue: {
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 22,
  },
  badgeLabel: {
    fontSize: 10,
  },
  devTestBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 10,
    paddingVertical: 10,
    opacity: 0.6,
  },
  devTestLabel: {
    fontSize: 11,
    fontFamily: "Cairo_400Regular",
    letterSpacing: 0.5,
  },
});
