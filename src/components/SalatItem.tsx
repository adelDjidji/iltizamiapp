import { View, StyleSheet } from "react-native";
import React from "react";
import Text from "./Text";
import Colors from "../constants/Colors";
import { useTranslation } from "react-i18next";
import { useRTL } from "../hooks/useRTL";
import { useTheme } from "../hooks/useTheme";

const getPrayerName = (salat: string, t: (key: string) => string): string => {
  switch (salat) {
    case "Fajr":
      return t("salat.fajr");
    case "Sunrise":
      return t("salat.sunrise");
    case "Dhuhr":
      return t("salat.dhuhr");
    case "Asr":
      return t("salat.asr");
    case "Sunset":
      return t("salat.sunset");
    case "Maghrib":
      return t("salat.maghrib");
    case "Isha":
      return t("salat.isha");
    default:
      return salat;
  }
};

const formatTimeDiff = (diff: number): string => {
  if (diff <= 60) return diff.toFixed(0);

  const hours = Math.trunc(diff / 60)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor(diff % 60);
  return `${hours}:${minutes.toString().padStart(2, "0")}`;
};

interface SalatItemProps {
  time: string;
  salat: string;
  diff: number;
  signedDiff: number;
  showDiff?: boolean;
  diff_str: string;
}

export default function SalatItem({
  time,
  salat,
  diff,
  signedDiff,
  showDiff = false,
  diff_str,
}: SalatItemProps) {
  const { t } = useTranslation();
  const { flexRow } = useRTL();
  const theme = useTheme();

  const formattedDiff = formatTimeDiff(diff - 1);
  const separator =
    theme.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(2,16,27,0.08)";

  return (
    <View
      style={[
        styles.salatItem,
        { flexDirection: flexRow },
        showDiff
          ? styles.salatItemActive
          : {
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: separator,
            },
      ]}
    >
      <Text h3 style={[styles.flex1, showDiff && styles.activeText]}>
        {time}
      </Text>
      <Text h3 style={[styles.flex1, showDiff && styles.activeText]}>
        {getPrayerName(salat, t)}
      </Text>
      <Text style={[styles.flex1, styles.diffText]}>
        {showDiff ? `${signedDiff > 0 ? "+" : "-"} ${formattedDiff}` : ""}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  salatItem: {
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 14,
  },
  salatItemActive: {
    backgroundColor: Colors.gold + "1a",
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: Colors.gold + "40",
  },
  activeText: {
    color: Colors.gold,
  },
  diffText: {
    fontSize: 13,
    color: Colors.gold,
    fontVariant: ["tabular-nums"],
  },
  flex1: {
    flex: 1,
    textAlign: "center",
  },
});
