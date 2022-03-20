import { View, Text, Dimensions } from "react-native";
import { useSelector } from "react-redux";
import Container from "../components/Container";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
import { Indicators } from "./FormEvaluation";
export default function Stats({ navigation }) {
  const { results } = useSelector((state) => state.stats);

  const cleanResult = results.filter(
    (res) => !!res?.data && !!res.data.length && res.data[0].length
  );
  const dates = cleanResult.map((res) => res.date);
  const datas = [[]];

  console.log("cleanResult", cleanResult);

  cleanResult.forEach((res, index) => {
    let tmp = res.data.map((res_) => res_.reduce((r, a) => a + r));
    datas[index] = tmp;
  });

  let finalData = [];
  let i = 0;
  for (let j = 0; j < datas[i].length; j++) {
    const element = datas[j];
    let tmp = datas.map((item) => item[j]);
    finalData.push(tmp);
  }
  console.log(finalData);

  const COLORS = ["black", "white"];

  console.log("finalData", finalData);
  return (
    <Container navigation={navigation}>
      {/* <Text>Stats</Text> */}
      <LineChart
        data={{
          labels: dates,
          datasets: finalData.map((data, index) => {
            return {
              data,
              color: (opacity) => Indicators[index]?.color || "black",
              strokeWidth: 2
            };
          }),
          legend: Indicators.map((ind) => ind.title),
        }}
        withDots={false}
        // withOuterLines={false}
        // withVerticalLines={false}
        // withVerticalLabels={false}
        withHorizontalLabels={true}
        width={Dimensions.get("window").width} // from react-native
        height={220}
        // yAxisLabel="$"
        // yAxisSuffix="k"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 0, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726",
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </Container>
  );
}
