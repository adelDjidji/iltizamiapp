import React, { useMemo } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Colors from "../constants/Colors";
import Text from "./Text";
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

  // Theme-aware values
  const cardBg = theme.mode === "dark" ? "rgba(1,19,35,0.82)" : theme.bgCard;
  const trackBg =
    theme.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const milestoneEmpty =
    theme.mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)";

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: cardBg,
          borderColor: Colors.gold + "40",
        },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Header row */}
      <View style={[styles.headerRow, { flexDirection: flexRow }]}>
        <View style={[styles.titleGroup, { flexDirection: flexRow }]}>
          <MaterialCommunityIcons
            name="trophy-award"
            size={20}
            color={Colors.gold}
          />
          <Text style={styles.title}>{t("challenge.title")}</Text>
        </View>
        <AntDesign
          name="right"
          size={14}
          color={Colors.gold}
          style={isRTL && { transform: [{ scaleX: -1 }] }}
        />
      </View>

      {/* Stars row */}
      {totalStars > 0 && (
        <View style={[styles.starsRow, { flexDirection: flexRow }]}>
          {Array.from({ length: starsToShow }).map((_, i) => (
            <AntDesign key={i} name="star" size={15} color={Colors.gold} />
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

      {/* Progress area */}
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

        {/* Track */}
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
                    displayDays >= milestone ? Colors.primary : milestoneEmpty,
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Motivation */}
      <Text
        style={[
          styles.motivation,
          { color: isComplete ? Colors.gold : theme.textSub },
          { textAlign: isRTL ? "right" : "left" },
        ]}
      >
        {t(motivationKey, { days: daysLeft, streak: currentStreak })}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    // marginHorizontal: 10,
    marginBottom: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerRow: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  titleGroup: {
    alignItems: "center",
    gap: 7,
  },
  title: {
    color: Colors.gold,
    fontSize: 15,
    fontWeight: "700",
  },
  starsRow: {
    alignItems: "center",
    gap: 3,
    marginBottom: 10,
    flexWrap: "wrap",
  },
  starsMore: {
    color: Colors.gold,
    fontSize: 13,
  },
  starsLabel: {
    color: Colors.gold + "bb",
    fontSize: 12,
  },
  progressArea: {
    gap: 6,
  },
  progressHeader: {
    alignItems: "baseline",
    gap: 6,
  },
  dayCount: {
    fontSize: 24,
    fontWeight: "700",
  },
  dayMax: {
    fontSize: 14,
    fontWeight: "400",
  },
  dayLabel: {
    fontSize: 12,
  },
  trackBg: {
    height: 8,
    borderRadius: 4,
    overflow: "visible",
    position: "relative",
  },
  trackFill: {
    height: "100%",
    backgroundColor: Colors.gold,
    borderRadius: 4,
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
    fontSize: 12,
    marginTop: 8,
  },
});
