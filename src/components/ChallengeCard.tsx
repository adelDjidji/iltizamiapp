import React, { useMemo } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Colors from "../constants/Colors";
import Text from "./Text";
import { GlassCard } from "./GlassSurface";
import { computeChallengeState } from "../utils/challenge";
import { useRTL } from "../hooks/useRTL";
import { useTheme } from "../hooks/useTheme";

const CHALLENGE_DAYS = 40;

export default function ChallengeCard({ onPress }: { onPress: () => void }) {
  const { t } = useTranslation();
  const { isRTL, flexRow } = useRTL();
  const theme = useTheme();
  const { results } = useSelector((state: any) => state.stats);

  const { totalStars, currentStreak, daysInCurrentCycle } = useMemo(
    () => computeChallengeState(results),
    [results],
  );

  const displayDays =
    currentStreak === 0
      ? 0
      : daysInCurrentCycle === 0
        ? 40
        : daysInCurrentCycle;
  const progress = displayDays / CHALLENGE_DAYS;
  const daysLeft = CHALLENGE_DAYS - displayDays;
  const progressWidth = Dimensions.get("window").width - 72;

  const motivationKey =
    currentStreak === 0
      ? "challenge.startMsg"
      : daysInCurrentCycle === 0
        ? "challenge.completedMsg"
        : daysLeft <= 7
          ? "challenge.almostMsg"
          : "challenge.progressMsg";

  const starsToShow = Math.min(totalStars, 12);
  const isComplete = daysInCurrentCycle === 0 && currentStreak > 0;

  const trackBg =
    theme.mode === "dark" ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.06)";
  const milestoneEmpty =
    theme.mode === "dark" ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.12)";

  return (
    <GlassCard
      style={styles.card}
      accentColor={Colors.gold}
      onPress={onPress}
    >
      <View style={styles.cardBody}>
        <View style={[styles.headerRow, { flexDirection: flexRow }]}>
          <View style={[styles.titleGroup, { flexDirection: flexRow }]}>
            <View style={styles.trophyWrap}>
              <MaterialCommunityIcons
                name="trophy-award"
                size={18}
                color={Colors.gold}
              />
            </View>
            <Text style={styles.title}>{t("challenge.title")}</Text>
          </View>
          <AntDesign
            name="right"
            size={11}
            color={theme.textMuted}
            style={isRTL && { transform: [{ scaleX: -1 }] }}
          />
        </View>

        {totalStars > 0 && (
          <View style={[styles.starsRow, { flexDirection: flexRow }]}>
            {Array.from({ length: starsToShow }).map((_, i) => (
              <AntDesign key={i} name="star" size={14} color={Colors.gold} />
            ))}
            {totalStars > 12 && (
              <Text style={styles.starsMore}>+{totalStars - 12}</Text>
            )}
            <Text style={styles.starsLabel}>
              {" "}
              {t("challenge.completions", { count: totalStars })}
            </Text>
          </View>
        )}

        <View style={styles.progressArea}>
          <View style={[styles.progressHeader, { flexDirection: flexRow }]}>
            <Text style={[styles.dayCount, { color: theme.text }]}>
              {displayDays}
              <Text style={[styles.dayMax, { color: theme.textMuted }]}>
                {" "}
                / {CHALLENGE_DAYS}
              </Text>
            </Text>
            <Text style={[styles.dayLabel, { color: theme.textSub }]}>
              {t("challenge.days")}
            </Text>
          </View>

          <View
            style={[
              styles.trackBg,
              { width: progressWidth, backgroundColor: trackBg },
            ]}
          >
            <View
              style={[
                styles.trackFill,
                { width: progressWidth * progress },
                isComplete && styles.trackComplete,
              ]}
            />
            {[10, 20, 30].map((milestone) => (
              <View
                key={milestone}
                style={[
                  styles.milestone,
                  {
                    left: (progressWidth * milestone) / 40 - 1,
                    backgroundColor:
                      displayDays >= milestone
                        ? Colors.primary
                        : milestoneEmpty,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <Text
          style={[
            styles.motivation,
            { color: isComplete ? Colors.gold : theme.textSub },
            { textAlign: isRTL ? "right" : "left" },
          ]}
        >
          {t(motivationKey, { days: daysLeft, streak: currentStreak })}
        </Text>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 4,
    borderRadius: 24,
  },
  cardBody: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerRow: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  titleGroup: {
    alignItems: "center",
    gap: 8,
  },
  trophyWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.gold + "18",
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: Colors.gold + "35",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: Colors.gold,
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
  starsRow: {
    alignItems: "center",
    gap: 3,
    marginBottom: 10,
    flexWrap: "wrap",
  },
  starsMore: {
    color: Colors.gold,
    fontSize: 12,
  },
  starsLabel: {
    color: Colors.gold + "bb",
    fontSize: 11,
  },
  progressArea: {
    gap: 6,
  },
  progressHeader: {
    alignItems: "baseline",
    gap: 6,
  },
  dayCount: {
    fontSize: 22,
    fontWeight: "600",
  },
  dayMax: {
    fontSize: 13,
    fontWeight: "400",
  },
  dayLabel: {
    fontSize: 11,
  },
  trackBg: {
    height: 6,
    borderRadius: 3,
    overflow: "visible",
    position: "relative",
  },
  trackFill: {
    height: "100%",
    backgroundColor: Colors.gold,
    borderRadius: 3,
  },
  trackComplete: {
    backgroundColor: Colors.success,
  },
  milestone: {
    position: "absolute",
    top: 0,
    width: 2,
    height: "100%",
    borderRadius: 1,
  },
  motivation: {
    fontSize: 11,
    marginTop: 8,
    letterSpacing: 0.1,
  },
});
