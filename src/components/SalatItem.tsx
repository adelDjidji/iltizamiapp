import { View, StyleSheet } from "react-native";
import React from "react";
import Text from "./Text";
import Colors from "../constants/Colors";
import { useTranslation } from "react-i18next";
import { useRTL } from "../hooks/useRTL";

const SalatText = ({ children }: { children: React.ReactNode }) => (
  <Text h3 style={styles.flex1}>
    {children}
  </Text>
);

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

  const formattedDiff = formatTimeDiff(diff - 1);

  return (
    <View style={[styles.salatItem, { flexDirection: flexRow }]}>
      <SalatText> {time}</SalatText>
      <SalatText>{getPrayerName(salat, t)}</SalatText>
      <SalatText>
        {" "}
        {!!showDiff && <Text p>⌛️</Text>}{" "}
        {showDiff ? `  ${signedDiff > 0 ? "+" : "-"} ${formattedDiff} ` : " "}
      </SalatText>
    </View>
  );
}

const styles = StyleSheet.create({
  salatItem: {
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 5,
    borderBottomWidth: 0.2,
    borderColor: Colors.gold,
  },
  flex1: {
    flex: 1,
    textAlign: "center",
  },
});
