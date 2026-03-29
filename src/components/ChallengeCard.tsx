import React, { useMemo } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Colors from "../constants/Colors";
import Text from "./Text";
import { computeChallengeState } from "../utils/challenge";
import { useRTL } from "../hooks/useRTL";

const CHALLENGE_DAYS = 40;

export default function ChallengeCard({ onPress }: { onPress: () => void }) {
  const { t } = useTranslation();
  const { isRTL, flexRow } = useRTL();
  const { results } = useSelector((state: any) => state.stats);

  const { totalStars, currentStreak, daysInCurrentCycle } = useMemo(
    () => computeChallengeState(results),
    [results],
  );

  // When streak just hit a multiple of 40, treat as "full" for display
  const displayDays =
    currentStreak === 0
      ? 0
      : daysInCurrentCycle === 0
        ? 40
        : daysInCurrentCycle;
  const progress = displayDays / CHALLENGE_DAYS;
  const daysLeft = CHALLENGE_DAYS - displayDays;
  const progressWidth = Dimensions.get("window").width - 52; // card padding

  const motivationKey =
    currentStreak === 0
      ? "challenge.startMsg"
      : daysInCurrentCycle === 0
        ? "challenge.completedMsg"
        : daysLeft <= 7
          ? "challenge.almostMsg"
          : "challenge.progressMsg";

  const starsToShow = Math.min(totalStars, 12);

  return (
    <TouchableOpacity
      style={styles.card}
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
          <Text style={styles.dayCount}>
            {displayDays}
            <Text style={styles.dayMax}> / {CHALLENGE_DAYS}</Text>
          </Text>
          <Text style={styles.dayLabel}>{t("challenge.days")}</Text>
        </View>

        {/* Track */}
        <View style={[styles.trackBg, { width: progressWidth }]}>
          <View
            style={[
              styles.trackFill,
              { width: progressWidth * progress },
              daysInCurrentCycle === 0 &&
                currentStreak > 0 &&
                styles.trackComplete,
            ]}
          />
          {/* Milestone markers at 10, 20, 30 days */}
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
                      : "rgba(255,255,255,0.2)",
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
          { textAlign: isRTL ? "right" : "left" },
          daysInCurrentCycle === 0 &&
            currentStreak > 0 &&
            styles.motivationComplete,
        ]}
      >
        {t(motivationKey, { days: daysLeft, streak: currentStreak })}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark,
    marginHorizontal: 10,
    marginBottom: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(229, 198, 81, 0.25)",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
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
    color: "rgba(229,198,81,0.7)",
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
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },
  dayMax: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 14,
    fontWeight: "400",
  },
  dayLabel: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
  },
  trackBg: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
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
    backgroundColor: Colors.success || "#2b8b2b",
  },
  milestone: {
    position: "absolute",
    top: 0,
    width: 2,
    height: "100%",
    borderRadius: 1,
  },
  motivation: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    marginTop: 8,
  },
  motivationComplete: {
    color: Colors.gold,
  },
});
