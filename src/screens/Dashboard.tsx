import React, { useMemo } from "react";
import {
  View,
  Image,
  Dimensions,
  StatusBar,
  ScrollView,
  StyleSheet,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import Container from "../components/Container";
import Text from "../components/Text";
import Colors from "../constants/Colors";
import GoalsManager from "../components/GoalsManager";
import ChallengeCard from "../components/ChallengeCard";
import {
  GlassBackdrop,
  GlassButton,
  GlassCard,
  GlassPill,
} from "../components/GlassSurface";
import { useRTL } from "../hooks/useRTL";
import { useTheme } from "../hooks/useTheme";

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
    <GlassPill intensity={theme.mode === "dark" ? 32 : 44}>
      <View style={langStyles.pillInner}>
        <GlassButton
          onPress={() => select("en")}
          active={!isRTL}
          activeColor={Colors.gold + "cc"}
          style={langStyles.btn}
        >
          <Text
            style={[
              langStyles.btnText,
              { color: theme.text },
              !isRTL && { color: Colors.primary, fontWeight: "700" },
            ]}
          >
            EN
          </Text>
        </GlassButton>
        <GlassButton
          onPress={() => select("ar")}
          active={isRTL}
          activeColor={Colors.gold + "cc"}
          style={langStyles.btn}
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
        </GlassButton>
      </View>
    </GlassPill>
  );
};

const langStyles = StyleSheet.create({
  pillInner: {
    flexDirection: "row",
    padding: 3,
    gap: 4,
    zIndex: 1,
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontSize: 13,
    letterSpacing: 0.2,
  },
});

// ── Theme toggle ─────────────────────────────────────────────────────
const ThemeToggle = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDark = theme.mode === "dark";
  return (
    <GlassButton
      style={iconBtn.base}
      onPress={() =>
        dispatch({ type: "SET_THEME", payload: isDark ? "light" : "dark" })
      }
    >
      <Feather name={isDark ? "sun" : "moon"} size={17} color={theme.textSub} />
    </GlassButton>
  );
};

// ── Settings button ──────────────────────────────────────────────────
const SettingsButton = ({ onPress }: { onPress: () => void }) => {
  const theme = useTheme();
  return (
    <GlassButton style={iconBtn.base} onPress={onPress}>
      <Feather name="settings" size={17} color={theme.textSub} />
    </GlassButton>
  );
};

const iconBtn = StyleSheet.create({
  base: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
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

  return (
    <GlassCard
      style={styles.halfCard}
      accentColor={accentColor}
      onPress={onPress}
    >
      <View style={styles.halfCardBody}>
        <View
          style={[
            styles.iconCircle,
            {
              backgroundColor: accentColor + "14",
              borderColor: accentColor + "30",
            },
          ]}
        >
          {icon}
        </View>

        <Text
          style={[styles.halfTitle, { color: theme.text, textAlign: "center" }]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.halfSub,
            { color: theme.textSub, textAlign: "center" },
          ]}
        >
          {subtitle}
        </Text>

        <AntDesign
          name="right"
          size={10}
          color={theme.textMuted}
          style={[
            styles.chevron,
            isRTL ? { left: 12, right: undefined } : { right: 12 },
            isRTL && { transform: [{ scaleX: -1 }] },
          ]}
        />
      </View>
    </GlassCard>
  );
};

// ── Full-width card (Stats) ──────────────────────────────────────────
const FullCard = ({
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
  badgeValue?: string | number;
  badgeLabel?: string;
  onPress: () => void;
}) => {
  const { isRTL, flexRow } = useRTL();
  const theme = useTheme();

  return (
    <GlassCard
      style={styles.fullCard}
      accentColor={accentColor}
      accentPosition={isRTL ? "right" : "left"}
      onPress={onPress}
    >
      <View
        style={[
          styles.fullCardInner,
          { flexDirection: flexRow },
          isRTL && styles.fullCardInnerRtl,
        ]}
      >
        <View
          style={[
            styles.fullCardIcon,
            {
              backgroundColor: accentColor + "14",
              borderColor: accentColor + "30",
              marginRight: isRTL ? 0 : 14,
              marginLeft: isRTL ? 14 : 0,
            },
          ]}
        >
          {icon}
        </View>

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

        <AntDesign
          name="right"
          size={11}
          color={theme.textMuted}
          style={[
            { marginLeft: isRTL ? 0 : 6, marginRight: isRTL ? 6 : 0 },
            isRTL && { transform: [{ scaleX: -1 }] },
          ]}
        />
      </View>
    </GlassCard>
  );
};

// ── Dashboard ────────────────────────────────────────────────────────
export default function Dashboard({ navigation }: any) {
  const { t } = useTranslation();
  const { flexRow } = useRTL();
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

  const overlayColors = (
    theme.mode === "dark"
      ? ["rgba(1,19,35,0.10)", "rgba(1,19,35,0.22)", "rgba(1,19,35,0.38)"]
      : [
          "rgba(255,255,255,0.04)",
          "rgba(255,255,255,0.12)",
          "rgba(245,246,248,0.28)",
        ]
  ) as [string, string, string];

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Container navigation={navigation}>
        <GlassBackdrop source={bgImage} style={styles.bg}>
          <LinearGradient
            colors={overlayColors}
            style={StyleSheet.absoluteFill}
          />

          <View
            style={[
              styles.header,
              { marginTop: StatusBar.currentHeight, flexDirection: flexRow },
            ]}
          >
            <LanguageSelector />
            <View style={[styles.headerRight, { flexDirection: flexRow }]}>
              <ThemeToggle />
              <SettingsButton onPress={() => navigation.push("config")} />
            </View>
          </View>

          <GoalsManager />

          <View style={styles.grid}>
            <View style={[styles.row, { flexDirection: flexRow }]}>
              <HalfCard
                accentColor="#eee"
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
                accentColor="#eee"
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

            <FullCard
              accentColor="#9b59b6"
              title={t("dashboard.stats")}
              subtitle={t("dashboard.statsSub")}
              icon={<Feather name="bar-chart-2" size={20} color="#9b59b6" />}
              badgeValue={recordedDays}
              badgeLabel={t("stats.days")}
              onPress={() => navigation.push("Stats")}
            />

            <ChallengeCard onPress={() => navigation.push("challenge")} />
          </View>
        </GlassBackdrop>
      </Container>
    </ScrollView>
  );
}

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
    paddingTop: 6,
    paddingBottom: 36,
    gap: 14,
  },
  row: {
    gap: 10,
  },
  halfCard: {
    width: HALF_W,
    borderRadius: 24,
  },
  halfCardBody: {
    paddingTop: 22,
    paddingBottom: 22,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: StyleSheet.hairlineWidth * 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardImg: {
    width: 26,
    height: 26,
  },
  halfTitle: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.1,
    marginBottom: 4,
  },
  halfSub: {
    fontSize: 11.5,
    lineHeight: 16,
    letterSpacing: 0.1,
  },
  chevron: {
    position: "absolute",
    bottom: 12,
    opacity: 0.7,
  },
  fullCard: {
    width: FULL_W,
    borderRadius: 24,
  },
  fullCardInner: {
    paddingVertical: 18,
    paddingHorizontal: 18,
    paddingLeft: 20,
    alignItems: "center",
  },
  fullCardInnerRtl: {
    paddingLeft: 18,
    paddingRight: 20,
  },
  fullCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth * 2,
    justifyContent: "center",
    alignItems: "center",
  },
  fullCardText: {
    flex: 1,
    paddingHorizontal: 10,
    gap: 2,
  },
  fullTitle: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
  fullSub: {
    fontSize: 11.5,
    letterSpacing: 0.1,
  },
});
