import { View, StyleSheet } from "react-native";
import React, { useMemo } from "react";
import { Calendar, LocaleConfig } from "react-native-calendars";
import moment from "moment";
import Colors from "../constants/Colors";
import { useSelector } from "react-redux";
import { MONTHS_AR, MONTHS_EN } from "../constants";
import Text from "../components/Text";
import { useTranslation } from "react-i18next";
import { useRTL } from "../hooks/useRTL";
import { useTheme } from "../hooks/useTheme";

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
LocaleConfig.defaultLocale = "ar";

export default function CalendarScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { isRTL, flexRow } = useRTL();
  const theme = useTheme();
  const language = isRTL ? "ar" : "en";

  // Sync calendar locale with current language
  React.useEffect(() => {
    LocaleConfig.defaultLocale = language;
  }, [language]);

  const { results } = useSelector((state: any) => state.stats);

  const markedDates = useMemo(() => {
    const today = moment().locale("en").format("YYYY-MM-DD");
    const dates: any = {};

    results.forEach((res: any) => {
      if (!res?.data || !res.data.length || !res.data[0]?.length) return;
      const date = res.date;
      if (!date) return;

      if (date === today) {
        // Today with recorded data: combine both indicators
        dates[date] = {
          marked: true,
          customStyles: {
            container: {
              backgroundColor: Colors.blue,
              borderRadius: 50,
              elevation: 3,
              borderWidth: 1.5,
              borderColor: "#50cebb",
            },
            text: { color: "white", fontWeight: "bold" },
          },
        };
      } else {
        dates[date] = {
          marked: true,
          customStyles: {
            container: {
              backgroundColor: "transparent",
              borderWidth: 1.5,
              borderColor: "#50cebb",
              borderRadius: 50,
            },
            text: { color: theme.text },
          },
        };
      }
    });

    // Only set today's default style if it wasn't already set above (no recorded data for today)
    if (!dates[today]) {
      dates[today] = {
        marked: true,
        customStyles: {
          container: {
            backgroundColor: Colors.blue,
            borderRadius: 50,
            elevation: 3,
          },
          text: { color: "white", fontWeight: "bold" },
        },
      };
    }

    console.log("dates =", dates);
    return dates;
  }, [results, theme.text]);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Calendar
        onDayPress={(day: any) => navigation.navigate("form", { day })}
        monthFormat={"yyyy MM"}
        hideExtraDays={true}
        firstDay={6}
        enableSwipeMonths={true}
        markingType={"custom"}
        markedDates={markedDates}
        theme={{
          backgroundColor: "transparent",
          calendarBackground: theme.bgCard,
          selectedDayTextColor: Colors.goldDark,
          todayTextColor: Colors.gold,
          arrowColor: Colors.gold,
          monthTextColor: theme.text,
          textMonthFontWeight: "bold",
          dayTextColor: theme.text,
          textDisabledColor: theme.textMuted,
        }}
      />

      {/* Legend */}
      <View style={[styles.legend, { flexDirection: flexRow }]}>
        <View style={[styles.legendItem, { flexDirection: flexRow }]}>
          <View style={styles.legendDotToday} />
          <Text p color={theme.textSub}>
            {t("calendar.today")}
          </Text>
        </View>
        <View style={[styles.legendItem, { flexDirection: flexRow }]}>
          <View style={styles.legendDotRecorded} />
          <Text p color={theme.textSub}>
            {t("calendar.recordedDay")}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  legend: {
    justifyContent: "center",
    paddingVertical: 16,
    gap: 24,
  },
  legendItem: {
    alignItems: "center",
    gap: 6,
  },
  legendDotToday: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.blue,
    marginLeft: 6,
  },
  legendDotRecorded: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: "#50cebb",
    backgroundColor: "transparent",
    marginLeft: 6,
  },
});
