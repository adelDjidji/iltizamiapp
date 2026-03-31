import { View, StyleSheet } from "react-native";
import React, { useEffect, useState, useCallback, useRef } from "react";
import Text from "./Text";
import SalatItem from "./SalatItem";
import { useTranslation } from "react-i18next";
import { useTheme } from "../hooks/useTheme";

const staticStyles = StyleSheet.create({
  salatsContainer: {
    flex: 0.6,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 15,
  },
});

// TypeScript interface for better type checking
interface SalatTableProps {
  data: {
    timings?: Record<string, string>;
  };
}

export default function SalatTable({ data }: SalatTableProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [listData, setListData] = useState<
    Array<{
      salat: string;
      time: string;
      diff: number;
      signedDiff: number;
      diff_str: string;
    }>
  >([]);
  const [minDiff, setMinDiff] = useState<number>(-1);

  // Use useRef for interval to avoid recreation on re-renders
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const timeCalcul = useCallback(() => {
    if (!data?.timings) return;

    let currentMinDiff = Number.MAX_SAFE_INTEGER;
    let listData_tmp = Object.entries(data.timings)
      .slice(0, -2)
      .map(([salat, time]) => {
        const now = new Date();
        const timeString = String(time);
        const [salatHr, salatMin] = timeString.split(":");
        const salatHrNum = Number(salatHr);
        const salatMinNum = Number(salatMin);

        const later = new Date();
        later.setHours(salatHrNum, salatMinNum, 0, 0);

        // If prayer time is in the past for today, consider it for tomorrow
        let diff = (now.getTime() - later.getTime()) / (60 * 1000); // difference in minutes
        if (diff > 12 * 60) {
          // If more than 12 hours in the past
          const tomorrow = new Date(later);
          tomorrow.setDate(tomorrow.getDate() + 1);
          diff = (now.getTime() - tomorrow.getTime()) / (60 * 1000);
        }

        const signedDiff = diff;

        // Format the time difference string properly
        let diffHrs = Math.floor(Math.abs(diff) / 60);
        let diffMins = Math.floor(Math.abs(diff) % 60);

        const diffHrsStr = diffHrs < 10 ? `0${diffHrs}` : `${diffHrs}`;
        const diffMinsStr = diffMins < 10 ? `0${diffMins}` : `${diffMins}`;
        const diff_str = `${diffHrsStr}:${diffMinsStr}`;

        if (Math.abs(diff) < currentMinDiff) {
          currentMinDiff = Math.abs(diff);
        }

        return {
          salat,
          time: timeString,
          diff: Math.abs(diff),
          signedDiff,
          diff_str,
        };
      });

    // Remove sunset as in original code
    listData_tmp = listData_tmp.filter((_, index) => index !== 4);

    setListData(listData_tmp);
    setMinDiff(currentMinDiff);
  }, [data]);

  useEffect(() => {
    // Initial calculation
    if (data?.timings) {
      timeCalcul();
    }

    // Set up interval
    intervalRef.current = setInterval(() => {
      if (data?.timings) timeCalcul();
    }, 60 * 1000); // Update every minute

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [data, timeCalcul]);

  console.log(listData);

  return (
    <View style={[staticStyles.salatsContainer, { backgroundColor: theme.bgCard }]}>
      <Text bold style={staticStyles.title} align="center">
        {t("salat.prayerTimes")}
      </Text>
      {listData.length > 0 ? (
        listData
          .filter((i) => !["Midnight", "Imsak"].includes(i.salat))
          .map((item) => (
            <SalatItem
              showDiff={minDiff === item.diff}
              key={`${item.salat}-${item.time}`}
              diff_str={item.diff_str}
              salat={item.salat}
              time={item.time}
              diff={item.diff}
              signedDiff={item.signedDiff}
            />
          ))
      ) : (
        <Text style={{ textAlign: "center", marginTop: 10 }} align="center">
          {t("salat.loading")}
        </Text>
      )}
    </View>
  );
}
