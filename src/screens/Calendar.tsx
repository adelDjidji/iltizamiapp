import { View, Text } from "react-native";
import React from "react";
import {
  Calendar,
  CalendarList,
  Agenda,
  LocaleConfig,
} from "react-native-calendars";
import moment from "moment";
import Colors from "../constants/Colors";

LocaleConfig.locales["ar"] = {
  monthNames: [
    "جانفي",
    "فيفري",
    "مارس",
    "أفريل",
    "ماي",
    "جوان",
    "جويلية",
    "أوت",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ],
  monthNamesShort: [
    "Janv.",
    "Févr.",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juil.",
    "Août",
    "Sept.",
    "Oct.",
    "Nov.",
    "Déc.",
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
  today: "هذا اليوم",
};
LocaleConfig.defaultLocale = "ar";

export default function CalendarScreen({ navigation }) {
  const today = moment().format("YYYY-MM-DD");
  return (
    <View>
      <Calendar
        // Initially visible month. Default = now
        //   current={moment().format('YYYY-MM-DD')}
        //   // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
        //   minDate={'2012-05-10'}
        //   // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
        //   maxDate={'2012-05-30'}
        // Handler which gets executed on day press. Default = undefined
        onDayPress={(day) => {
          console.log("selected day", day);
          navigation.navigate("form", { day });
        }}
        // Handler which gets executed on day long press. Default = undefined
        onDayLongPress={(day) => {
          console.log("selected day", day);
        }}
        // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
        monthFormat={"yyyy MM"}
        // Handler which gets executed when visible month changes in calendar. Default = undefined
        onMonthChange={(month) => {
          console.log("month changed", month);
        }}
        // Hide month navigation arrows. Default = false
        //   hideArrows={true}
        // Do not show days of other months in month page. Default = false
        hideExtraDays={true}
        // If hideArrows = false and hideExtraDays = false do not switch month when tapping on greyed out
        // day from another month that is visible in calendar page. Default = false
        //   disableMonthChange={true}
        // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
        firstDay={-1}
        // Hide day names. Default = false
        //   hideDayNames={true}
        // Show week numbers to the left. Default = false
        //   showWeekNumbers={true}
        // Handler which gets executed when press arrow icon left. It receive a callback can go back month
        //   onPressArrowLeft={subtractMonth => subtractMonth()}
        // Handler which gets executed when press arrow icon right. It receive a callback can go next month
        //   onPressArrowRight={addMonth => addMonth()}
        // Disable left arrow. Default = false
        //   disableArrowLeft={true}
        // Disable right arrow. Default = false
        //   disableArrowRight={true}
        // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
        //   disableAllTouchEventsForDisabledDays={true}
        // Replace default month and year title with custom one. the function receive a date as parameter
        //   renderHeader={date => {
        //     /*Return JSX*/
        //     return <View><Text>Header</Text></View>
        //   }}
        // Enable the option to swipe between months. Default = false
        enableSwipeMonths={true}
        markingType={"custom"}
        markedDates={{
          [today]: {
            marked: true,
            dotColor: "#50cebb",
            customStyles: {
              container: {
                backgroundColor: Colors.blue,
                elevation: 2,
              },
              text: {
                color: "white",
              },
            },
          },
        }}
        theme={{
          backgroundColor: "red",
          selectedDayTextColor: Colors.goldDark,
          todayTextColor: Colors.gold,
          arrowColor: Colors.gold,
        }}
      />
    </View>
  );
}
