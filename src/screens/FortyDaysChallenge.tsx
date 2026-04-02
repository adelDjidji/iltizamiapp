import React, { useMemo } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { AntDesign, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import moment from "moment";
import Colors from "../constants/Colors";
import Text from "../components/Text";
import { computeChallengeState } from "../utils/challenge";
import { useRTL } from "../hooks/useRTL";
import { MONTHS_AR, MONTHS_EN } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { Theme } from "../constants/Theme";

LocaleConfig.locales["ar"] = {
  monthNames: MONTHS_AR,
  monthNamesShort: [
    "جان",
    "فيف",
    "مار",
    "أفر",
    "ماي",
    "جوا",
    "جوي",
    "أوت",
    "سبت",
    "أكت",
    "نوف",
    "ديس",
  ],
  dayNames: [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ],
  dayNamesShort: [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ],
  today: "اليوم",
};
LocaleConfig.locales["en"] = {
  monthNames: MONTHS_EN,
  monthNamesShort: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  dayNames: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  today: "Today",
};

const CHALLENGE_DAYS = 40;
const SCREEN_WIDTH = Dimensions.get("window").width;

// ------------------------------------------------------------------
// Stars display — caps at 20 visible, shows a +N badge after
// ------------------------------------------------------------------
function StarsDisplay({ count }: { count: number }) {
  const visible = Math.min(count, 20);
  const overflow = count - visible;
  return (
    <View style={styles.starsWrap}>
      {Array.from({ length: visible }).map((_, i) => (
        <AntDesign key={i} name="star" size={22} color={Colors.gold} />
      ))}
      {overflow > 0 && (
        <View style={styles.starsOverflow}>
          <Text style={styles.starsOverflowText}>+{overflow}</Text>
        </View>
      )}
    </View>
  );
}

// ------------------------------------------------------------------
// Circular progress badge
// ------------------------------------------------------------------
function ProgressBadge({
  days,
  streak,
  theme,
}: {
  days: number;
  streak: number;
  theme: Theme;
}) {
  const pct = Math.round((days / CHALLENGE_DAYS) * 100);
  const isComplete = days >= CHALLENGE_DAYS;
  const ringColor = isComplete ? "#27ae60" : Colors.gold;

  return (
    <View
      style={[
        styles.badge,
        { borderColor: ringColor, backgroundColor: theme.bgSurface },
      ]}
    >
      <Text style={[styles.badgeNumber, { color: ringColor }]}>{days}</Text>
      <Text style={[styles.badgeDivider, { color: theme.textMuted }]}>
        / {CHALLENGE_DAYS}
      </Text>
      <Text style={[styles.badgePct, { color: theme.textMuted }]}>{pct}%</Text>
    </View>
  );
}

// ------------------------------------------------------------------
// Stat card
// ------------------------------------------------------------------
function StatCard({
  icon,
  value,
  label,
  accent = Colors.gold,
  bgColor,
  labelColor,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  accent?: string;
  bgColor?: string;
  labelColor?: string;
}) {
  return (
    <View
      style={[
        styles.statCard,
        { borderTopColor: accent, backgroundColor: bgColor },
      ]}
    >
      {icon}
      <Text style={[styles.statValue, { color: accent }]}>{value}</Text>
      <Text style={[styles.statLabel, labelColor ? { color: labelColor } : {}]}>
        {label}
      </Text>
    </View>
  );
}

// ------------------------------------------------------------------
// Main screen
// ------------------------------------------------------------------
export default function FortyDaysChallenge({ navigation }: any) {
  const { t } = useTranslation();
  const { isRTL, flexRow } = useRTL();
  const theme = useTheme();
  const language = isRTL ? "ar" : "en";

  React.useEffect(() => {
    LocaleConfig.defaultLocale = language;
  }, [language]);

  const { results } = useSelector((state: any) => state.stats);

  const {
    totalStars,
    bestStreak,
    currentStreak,
    totalSuccessDays,
    daysInCurrentCycle,
    perfectSet,
    completionDates,
  } = useMemo(() => computeChallengeState(results), [results]);

  const displayDays =
    currentStreak === 0
      ? 0
      : daysInCurrentCycle === 0
        ? 40
        : daysInCurrentCycle;
  const daysLeft = CHALLENGE_DAYS - displayDays;

  const motivationKey =
    currentStreak === 0
      ? "challenge.startMsg"
      : daysInCurrentCycle === 0
        ? "challenge.completedMsg"
        : daysLeft <= 7
          ? "challenge.almostMsg"
          : "challenge.progressMsg";

  // ------- Calendar marking ----------------------------------------
  const markedDates = useMemo(() => {
    const today = moment().locale("en").format("YYYY-MM-DD");
    const marks: Record<string, any> = {};

    // Mark every day that has data
    results.forEach((r: any) => {
      if (!r.date || !r.data?.length) return;
      const date = moment(r.date).locale("en").format("YYYY-MM-DD");
      const isPerfect = perfectSet.has(date);

      marks[date] = {
        marked: true,
        customStyles: {
          container: isPerfect
            ? {
                backgroundColor: "rgba(39,174,96,0.18)",
                borderRadius: 8,
                borderWidth: 1.5,
                borderColor: "#27ae60",
              }
            : {
                backgroundColor: "rgba(231,76,60,0.12)",
                borderRadius: 8,
                borderWidth: 1.5,
                borderColor: "#e74c3c55",
              },
          text: {
            color: isPerfect ? "#27ae60" : "#e74c3c",
            fontWeight: "600",
          },
        },
      };
    });

    // Overlay completion milestone dates (star badge)
    completionDates.forEach((date) => {
      const existing = marks[date] || {};
      marks[date] = {
        ...existing,
        marked: true,
        customStyles: {
          container: {
            backgroundColor: Colors.gold + "33",
            borderRadius: 8,
            borderWidth: 2,
            borderColor: Colors.gold,
          },
          text: { color: Colors.goldDark, fontWeight: "700" },
        },
      };
    });

    // Today marker
    marks[today] = {
      ...(marks[today] || {}),
      marked: true,
      customStyles: {
        container: {
          ...(marks[today]?.customStyles?.container || {}),
          backgroundColor: perfectSet.has(today)
            ? "rgba(39,174,96,0.3)"
            : Colors.blue + "40",
          borderColor: Colors.blue,
          borderWidth: 2,
          borderRadius: 8,
        },
        text: { color: Colors.blue, fontWeight: "bold" },
      },
    };

    return marks;
  }, [results, perfectSet, completionDates]);

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero ─────────────────────────────────────── */}
      <View style={[styles.hero, { backgroundColor: theme.bgCard }]}>
        {/* Trophy + title */}
        <View style={styles.heroTitleRow}>
          <MaterialCommunityIcons
            name="trophy-award"
            size={34}
            color={Colors.gold}
          />
          <Text style={[styles.heroTitle, { color: theme.text }]}>
            {t("challenge.title")}
          </Text>
        </View>

        {/* Stars */}
        {totalStars > 0 ? (
          <StarsDisplay count={totalStars} />
        ) : (
          <Text style={[styles.noStarsHint, { color: theme.textMuted }]}>
            {t("challenge.noStarsYet")}
          </Text>
        )}

        {/* Progress badge */}
        <ProgressBadge
          days={displayDays}
          streak={currentStreak}
          theme={theme}
        />

        {/* Motivation */}
        <Text
          style={[
            styles.motivation,
            { textAlign: "center", color: theme.textSub },
            daysInCurrentCycle === 0 &&
              currentStreak > 0 &&
              styles.motivationSuccess,
          ]}
        >
          {t(motivationKey, { days: daysLeft, streak: currentStreak })}
        </Text>

        {/* Progress track */}
        <View style={styles.heroTrackWrap}>
          <View
            style={[
              styles.heroTrackBg,
              {
                backgroundColor: theme.bgSurface,
                flexDirection: flexRow,
              },
            ]}
          >
            <View
              style={[
                styles.heroTrackFill,
                { width: `${(displayDays / CHALLENGE_DAYS) * 100}%` },
                daysInCurrentCycle === 0 &&
                  currentStreak > 0 &&
                  styles.heroTrackComplete,
              ]}
            />
            {/* Milestone ticks */}
            {[10, 20, 30].map((m) => (
              <View
                key={m}
                style={[
                  styles.heroTick,
                  {
                    left: `${(m / CHALLENGE_DAYS) * 100}%`,
                    backgroundColor: theme.border,
                  },
                ]}
              />
            ))}
          </View>
          <View style={[styles.heroTrackLabels, { flexDirection: flexRow }]}>
            {[0, 10, 20, 30, 40].map((m) => (
              <Text
                key={m}
                style={[styles.heroTickLabel, { color: theme.textMuted }]}
              >
                {m}
              </Text>
            ))}
          </View>
        </View>
      </View>

      {/* ── Stats row ────────────────────────────────── */}
      <View style={[styles.statsRow, { flexDirection: flexRow }]}>
        <StatCard
          icon={<Feather name="zap" size={18} color={Colors.gold} />}
          value={currentStreak}
          label={t("challenge.currentStreak")}
          accent={Colors.gold}
          bgColor={theme.bgCard}
          labelColor={theme.textSub}
        />
        <StatCard
          icon={<AntDesign name="trophy" size={18} color="#e67e22" />}
          value={bestStreak}
          label={t("challenge.bestStreak")}
          accent="#e67e22"
          bgColor={theme.bgCard}
          labelColor={theme.textSub}
        />
        <StatCard
          icon={<AntDesign name="check-circle" size={18} color="#27ae60" />}
          value={totalSuccessDays}
          label={t("challenge.totalDays")}
          accent="#27ae60"
          bgColor={theme.bgCard}
          labelColor={theme.textSub}
        />
      </View>

      {/* ── How to achieve ───────────────────────────── */}
      {currentStreak === 0 && (
        <View
          style={[
            styles.hintCard,
            { backgroundColor: theme.bgCard, borderColor: theme.border },
          ]}
        >
          <Text
            style={[styles.hintTitle, { textAlign: isRTL ? "right" : "left" }]}
          >
            {t("challenge.howTitle")}
          </Text>
          <Text
            style={[
              styles.hintBody,
              { textAlign: isRTL ? "right" : "left", color: theme.textSub },
            ]}
          >
            {t("challenge.howBody")}
          </Text>
          <TouchableOpacity
            style={styles.hintBtn}
            onPress={() => navigation.navigate("form")}
            activeOpacity={0.8}
          >
            <Text style={styles.hintBtnText}>{t("challenge.fillForm")}</Text>
          </TouchableOpacity>
        </View>
      )}

      <View
        style={[
          styles.hintCard,
          { backgroundColor: theme.bgCard, borderColor: theme.border },
        ]}
      >
        <Text style={[styles.motivation, { color: theme.textSub }]}>
          عن أنس بن مالك ـ رضي الله عنه ـ قال: قال رسول الله صلى الله عليه وسلم:
        </Text>
        <Text
          style={[styles.motivation, { color: theme.textSub, fontSize: 16 }]}
        >
          من صلى لله أربعين يومًا في جماعة يدرك التكبيرة الأولى، كتبت له
          براءتان: براءة من النار، وبراءة من النفاق.
        </Text>
        <Text style={[styles.motivation, { color: theme.textSub }]}>
          وهذا الحديث قد حسنه الألباني في صحيح سنن الترمذي.
        </Text>
      </View>

      {/* ── Calendar ─────────────────────────────────── */}
      <View style={[styles.calendarWrap, { backgroundColor: theme.bgCard }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t("challenge.calendarTitle")}
        </Text>
        <Calendar
          hideExtraDays
          firstDay={6}
          enableSwipeMonths
          markingType="custom"
          markedDates={markedDates}
          onDayPress={(day: any) => navigation.navigate("form", { day })}
          theme={{
            backgroundColor: "transparent",
            calendarBackground: theme.bgCard,
            todayTextColor: Colors.blue,
            arrowColor: Colors.gold,
            monthTextColor: theme.text,
            textMonthFontWeight: "bold",
            textDayFontFamily: "Cairo_400Regular",
            textMonthFontFamily: "Cairo_700Bold",
            textDayHeaderFontFamily: "Cairo_400Regular",
            dayTextColor: theme.text,
            textDisabledColor: theme.textMuted,
          }}
        />

        {/* Legend */}
        <View style={[styles.legend, { flexDirection: flexRow }]}>
          <View style={[styles.legendItem, { flexDirection: flexRow }]}>
            <View
              style={[
                styles.legendDot,
                {
                  borderColor: "#27ae60",
                  backgroundColor: "rgba(39,174,96,0.18)",
                },
              ]}
            />
            <Text style={[styles.legendText, { color: theme.textSub }]}>
              {t("challenge.legendPerfect")}
            </Text>
          </View>
          <View style={[styles.legendItem, { flexDirection: flexRow }]}>
            <View
              style={[
                styles.legendDot,
                {
                  borderColor: "#e74c3c",
                  backgroundColor: "rgba(231,76,60,0.12)",
                },
              ]}
            />
            <Text style={[styles.legendText, { color: theme.textSub }]}>
              {t("challenge.legendImperfect")}
            </Text>
          </View>
          <View style={[styles.legendItem, { flexDirection: flexRow }]}>
            <View
              style={[
                styles.legendDot,
                {
                  borderColor: Colors.gold,
                  backgroundColor: Colors.gold + "22",
                },
              ]}
            />
            <Text style={[styles.legendText, { color: theme.textSub }]}>
              {t("challenge.legendMilestone")}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },

  // ── Hero
  hero: {
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  starsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 4,
    marginBottom: 20,
    maxWidth: SCREEN_WIDTH - 60,
  },
  starsOverflow: {
    backgroundColor: Colors.goldDark,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  starsOverflowText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
  },
  noStarsHint: {
    fontSize: 13,
    marginBottom: 20,
    textAlign: "center",
  },
  badge: {
    width: 148,
    height: 148,
    borderRadius: 74,
    borderWidth: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  badgeNumber: {
    fontSize: 46,
    fontWeight: "700",
    lineHeight: 52,
  },
  badgeDivider: {
    fontSize: 14,
  },
  badgePct: {
    fontSize: 11,
    marginTop: 2,
  },
  motivation: {
    fontSize: 13,
    marginBottom: 18,
    paddingHorizontal: 10,
  },
  motivationSuccess: {
    color: "#27ae60",
    fontWeight: "700",
  },
  heroTrackWrap: {
    width: "100%",
    gap: 4,
  },
  heroTrackBg: {
    height: 10,
    borderRadius: 5,
    overflow: "visible",
    position: "relative",
  },
  heroTrackFill: {
    height: "100%",
    backgroundColor: Colors.gold,
    borderRadius: 5,
  },
  heroTrackComplete: {
    backgroundColor: "#27ae60",
  },
  heroTick: {
    position: "absolute",
    top: 0,
    width: 2,
    height: "100%",
    borderRadius: 1,
  },
  heroTrackLabels: {
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  heroTickLabel: {
    fontSize: 10,
  },

  // ── Stats
  statsRow: {
    marginHorizontal: 16,
    marginTop: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    gap: 4,
    borderTopWidth: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 10,
    textAlign: "center",
  },

  // ── Hint card (empty state)
  hintCard: {
    margin: 16,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    gap: 8,
  },
  hintTitle: {
    color: Colors.gold,
    fontSize: 15,
    fontWeight: "700",
  },
  hintBody: {
    fontSize: 13,
    lineHeight: 20,
  },
  hintBtn: {
    backgroundColor: Colors.gold,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  hintBtnText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },

  // ── Calendar
  calendarWrap: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 16,
    overflow: "hidden",
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
  },
  legend: {
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 10,
    flexWrap: "wrap",
  },
  legendItem: {
    alignItems: "center",
    gap: 5,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 4,
    borderWidth: 1.5,
  },
  legendText: {
    fontSize: 11,
  },
});
