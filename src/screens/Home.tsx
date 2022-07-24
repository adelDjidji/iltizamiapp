import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import Container from "../components/Container";
import Text from "../components/Text";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Clock from "../components/Clock";
import SalatItem from "../components/SalatItem";
import SalatTable from "../components/SalatTable";
import * as SecureStore from "expo-secure-store";



const images = [
  "https://images.unsplash.com/photo-1590075865003-e48277faa558?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
  "https://images.unsplash.com/photo-1584013018605-6cd540b26059?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  "https://images.unsplash.com/photo-1576506637731-8658b2af90eb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80",
];

export default function Home({ navigation }: { navigation: any }) {
  const [isFetching, setIsFetching] = useState(false);
  const [pickedLocation, setPickedLocation] = useState(null);
  const { current_date, data } = useSelector((state) => state.prayer);
  const { userPosition } = useSelector((state) => state.settings);

  const dispatch = useDispatch();

 

  const loadPrayersTimings = async (location: any) => {
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let defaultMethod = 3;
    // http://api.aladhan.com/v1/timings/23-01-2022?latitude=36.7167882&longitude=3.0815712&method=3
    // const API_URL = `http://api.aladhan.com/v1/calendar?latitude=${location?.latitude}&longitude=${location?.longitude}&method=${defaultMethod}&month=${month}&year=${year}`;
    const API_URL = `http://api.aladhan.com/v1/timings/${moment(
      new Date().getTime()
    ).format("DD-MM-YYYY")}?latitude=${location?.latitude}&longitude=${
      location?.longitude
    }&method=${defaultMethod}&adjustment=1`;
    try {
      const response = await fetch(API_URL).then((res) => res.json());
      // console.log(response);
      if (response.code == 200) {
        dispatch({
          type: "LOAD_DATA",
          payload: {
            current_date: moment(new Date().getTime()).format("DD-MM-YYYY"),
            data: response.data,
          },
        });
      } else {
        Alert.alert("Error", response.data);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error getting ");
    }
  };


  const loadTimings = async () => {
    setIsFetching(true);
    loadPrayersTimings(userPosition);
    setIsFetching(false);
  };
  useEffect(() => {
    if (
      !data ||
      current_date !== moment(new Date().getTime()).format("DD-MM-YYYY")
    ) {
      loadTimings();
    } else {
      console.log("--data exist", data);
    }
  }, []);

  return (
    <Container
      navigation={navigation}
      style={{ flex: 1, backgroundColor: "red" }}
    >
      <ImageBackground
        resizeMode="cover"
        style={styles.coverImage}
        source={require("../../assets/26080.jpg")}
      >
        <Clock />
        {!isFetching && (
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{data?.date?.readable}</Text>
            <Text style={styles.dateText}>
              {data?.date?.hijri.weekday.ar} {data?.date?.hijri.day}{" "}
              {data?.date?.hijri.month.ar} {data?.date?.hijri.year}
            </Text>
          </View>
        )}

        {/* <Text style={styles.clockDigital}>{JSON.stringify(Object.entries(data.timings) )}</Text> */}
        {isFetching || !data ? (
          <ActivityIndicator size="large" color={"white"} />
        ) : (
          <SalatTable data={data} />
        )}
      </ImageBackground>
    </Container>
  );
}

const styles = StyleSheet.create({
  text: {
    textAlign: "right",
  },
  coverImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    justifyContent: "flex-end",
  },

  dateText: {
    color: "white",
    textAlign: "right",
  },
  dateContainer: {
    marginRight: 40,
    marginBottom: 20,
  },
});
