import {
  View,
  Dimensions,
  TouchableOpacity,
  Button,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import Container from "../components/Container";
import { LineChart } from "react-native-chart-kit";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

import { Indicators } from "./FormEvaluation";
import * as React from "react";
import Text from "../components/Text";
import moment from "moment";
import Colors from "../constants/Colors";
import * as ScreenOrientation from "expo-screen-orientation";
import RTLScrollView from "../components/RTLScrollView";

const chartConfig = {
  backgroundGradientFromOpacity: 0,
  backgroundGradientToOpacity: 0,
  fillShadowGradientToOpacity: 0,
  decimalPlaces: 0, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(10, 10, 10, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#ffa726",
  },
};
const Dot = ({ color = "black" }) => {
  return (
    <View
      style={{
        width: 11,
        height: 11,
        backgroundColor: color,
        borderRadius: 10,
        marginHorizontal: 10,
        borderColor: Colors.blueDark,
        borderWidth: 0.5,
        alignSelf: "center",
      }}
    ></View>
  );
};

export default function Stats({ navigation }) {
  const { results } = useSelector((state) => state.stats);
  const [rotation, setrotation] = React.useState(false);
  const [chartWidth, setchartWidth] = React.useState(
    Dimensions.get("window").width
  );

  // const [legendDirection, setlegendDirection] = React.useState("column");
  React.useEffect(() => {
    var subscribedEvent = ScreenOrientation.addOrientationChangeListener(
      (e) => {
        if (
          e.orientationInfo.orientation ===
          ScreenOrientation.Orientation.PORTRAIT_UP
        ) {
          setchartWidth(Dimensions.get("window").width);
          // setlegendDirection("column");
        } else {
          // landscape right
          setchartWidth(Dimensions.get("window").height);
          // setlegendDirection("row-reverse");
        }
      }
    );

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscribedEvent);
    };
  }, []);

  const cleanResult = results.filter(
    (res) => !!res?.data && !!res.data.length && res.data[0].length
  );
  const dates = cleanResult.map((res) => res.date);
  const datas = [[]];

  cleanResult.forEach((res, index) => {
    let tmp = res.data.map((res_) => res_.reduce((r, a) => a + r));
    datas[index] = tmp;
  });

  let finalData = [];
  let i = 0;
  for (let j = 0; j < datas[i].length; j++) {
    let tmp = datas.map((item) => item[j]);
    finalData.push({ data: tmp, id: Indicators[j].id });
  }

  const defaultIndicatorIds = Indicators.map((ind) => {
    return ind.id;
  });
  const [indicatorsShow, setindicatorsShow] =
    React.useState(defaultIndicatorIds);
  const getIndicatorById = (id) => {
    return Indicators.find((ind) => ind.id === id) || null;
  };

  const renderDate = (date) => moment(date).format("MM/DD");
  const Legend = (props) => (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        justifyContent: "flex-end",
        margin: 10,
        // width:130,
        borderColor: "grey",
        borderWidth: 0.5,
        padding: 10,
        borderRadius: 5,
        backgroundColor: indicatorsShow.includes(props.indicator.id)
          ? "white"
          : "",
      }}
      onPress={props.onPress}
    >
      <Text
        style={{
          opacity: indicatorsShow.includes(props.indicator.id) ? 1 : 0.2,
        }}
        bold={indicatorsShow.includes(props.indicator.id)}
      >
        {props.indicator.title}
      </Text>
      <Dot color={props.indicator.color}></Dot>
    </TouchableOpacity>
  );
  const handleRotation = async () => {
    if (!rotation) {
      setrotation(true);
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
      );
    } else {
      setrotation(false);
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT
      );
    }
  };
  return (
    <ScrollView
      contentContainerStyle={{ flex: 1, justifyContent: "space-between" }}
    >
      <Container navigation={navigation}>
        <View style={{ margin: 30, flexDirection: "row" }}>
          <AntDesign
            onPress={() => navigation.goBack()}
            name="arrowleft"
            size={24}
            color="black"
          />
          <Text h3 style={{ marginLeft: 30 }}>
            {" "}
            منحنى إلتزامي{" "}
          </Text>
        </View>
        {/* <RTLScrollView showsHorizontalScrollIndicator={true}>
          {Indicators.map((ind) => (
            <Legend
              onPress={() => {
                setindicatorsShow((prev) => {
                  return prev.includes(ind.id)
                    ? prev.filter((item) => item !== ind.id)
                    : [...prev, ind.id];
                });
              }}
              indicator={ind}
            />
          ))}
        </RTLScrollView> */}

        <LineChart
          onDataPointClick={(data) => {
            console.log(data);
          }}
          data={{
            labels: dates.map(renderDate),
            datasets: finalData
              .filter((item, index) => {
                let id = item.id;
                return indicatorsShow.includes(id);
              })
              .map((data, index) => {
                return {
                  data: data.data,
                  color: (opacity) =>
                    getIndicatorById(data.id)?.color || "black",
                  strokeWidth: 2,
                };
              }),
            // legend: Indicators.map((ind) => ind.title),
          }}
          withDots={false}
          // withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLines={true}
          withHorizontalLabels={true}
          width={chartWidth} // from react-native
          height={220}
          // yAxisLabel="x"
          // yAxisSuffix="k"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={chartConfig}
          bezier
          fromZero
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />

        <View style={{ flexDirection: "row-reverse", flexWrap: "wrap" }}>
          {Indicators.map((ind) => (
            <Legend
              key={ind.id}
              onPress={() => {
                setindicatorsShow((prev) => {
                  return prev.includes(ind.id)
                    ? prev.filter((item) => item !== ind.id)
                    : [...prev, ind.id];
                });
              }}
              indicator={ind}
            />
          ))}
        </View>
        <View
          style={{
            flexDirection: "row-reverse",
            justifyContent: "space-between",
            padding: 20,
            marginTop: 90,
          }}
        >
          <TouchableOpacity
            style={{ width: 50, backgroundColor: "white", borderRadius: 50 }}
            onPress={() => navigation.navigate("form")}
          >
            <AntDesign name="pluscircle" size={50} color={Colors.gold} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 50,
              backgroundColor: "white",
              borderRadius: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => navigation.navigate("calendar")}
          >
            <AntDesign name="calendar" size={25} color={Colors.primary} />
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={{
              width: 50,
              backgroundColor: "white",
              borderRadius: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => navigation.navigate("config")}
          >
            <AntDesign name="edit" size={25} color={Colors.primary} />
          </TouchableOpacity> */}
        </View>
      </Container>
    </ScrollView>
  );
}
