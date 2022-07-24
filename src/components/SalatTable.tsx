import { View, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Text from "./Text";
import SalatItem from "./SalatItem";

const styles = StyleSheet.create({
  salatsContainer: {
    backgroundColor: "white",
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
export default function SalatTable({ data }) {
  const [listData, setlistData] = useState<any>();
  const [minDiff_, setminDiff] = useState(-1);

  var it = setInterval(() => {
    if(!!data?.timings) timeCalcul();
  }, 60 * 1000);

  const timeCalcul = () => {
    // console.log("caclcu");
    let minDiff = Number.MAX_SAFE_INTEGER;
    let listData_tmp = Object.entries(data.timings)
      .slice(0, -2)
      .map(([salat, time]) => {
        let now = new Date();
        let time_ = time + "";
        let later = new Date();
        const [salat_hr, salat_min] = time_.split(":");
        later.setHours(Number(salat_hr), Number(salat_min));
        let diff: any = now.getTime() - later.getTime(); // difference in ms
        diff = diff / 1000 / 60; // difference in minutes

        let signedDiff = diff;

        let diff_str_hr: any = now.getHours() - Number(salat_hr);
        diff_str_hr = diff_str_hr < 10 ? "0" + diff_str_hr : diff_str_hr;
        let diff_str_mn: any = now.getMinutes() - Number(salat_min);
        diff_str_mn = diff_str_mn < 10 ? "0" + diff_str_mn : diff_str_mn;
        let diff_str = `${diff_str_hr}:${diff_str_mn}`;

        if (Math.abs(diff) < minDiff) {
          minDiff = Math.abs(diff);
          signedDiff = diff;
        }
        return { salat, time, diff:Math.abs(diff), signedDiff, diff_str };
      });
    listData_tmp.splice(4, 1); // remove sunset
    setlistData(listData_tmp);
    console.log("listData_tmp = ",listData_tmp);
    console.log("Min diff = ",minDiff);
    setminDiff(minDiff);
  };
  useEffect(() => {
    if(!!data?.timings){
      timeCalcul();
    }
    
    return () => {
      clearInterval(it);
      console.log("clear calc");
    };
  }, []);

  return (
    <View style={styles.salatsContainer}>
      <Text bold style={styles.title} align="center">
      🕗 مواقيت الصلاة 
      </Text>
      {!!listData &&
        listData.map(({ salat, time, diff, signedDiff, diff_str }) => {
          return (
            <SalatItem
              showDiff={minDiff_ == diff}
              key={Math.random()}
              diff_str={diff_str}
              salat={salat}
              time={time}
              diff={diff}
              signedDiff={signedDiff}
            />
          );
        })}
    </View>
  );
}
