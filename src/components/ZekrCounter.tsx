import { View, TouchableOpacity } from "react-native";
import React from "react";
import Card from "./Card";
import Text from "./Text";
import { Zekr } from "../screens/AdkarList";
import Colors from "../constants/Colors";
import ProgressCircle from "react-native-progress-circle";

type Props = { item: Zekr };

export default function ZekrCounter({ item }: Props) {
  const [count, setcount] = React.useState(0);
  const [show, setshow] = React.useState(true)

  const handlePress = ()=>{
    if(count<item.reps) setcount(old=>old+1)
    else setshow(false)
  }
  if(!show) return null
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Card>
        <Card.Body>
          {!!item.header && (
            <Text h2 style={{ marginBottom: 10 }} bold>
              {item.header}
            </Text>
          )}
          <Text h2>{item.body}</Text>
          {!!item.footer && (
            <Text style={{ marginTop: 12 }} p color={Colors.goldDark}>
              {item.footer}
            </Text>
          )}
        </Card.Body>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            padding: 10,
          }}
        >
          <Text bold h3>
            {item.reps}
          </Text>
          <Text>
            {count}
          </Text>
          <View>
            <ProgressCircle
              percent={(count*100)/item.reps}
              radius={10}
              borderWidth={10}
              color={Colors.gold}
              shadowColor={"white"}
              bgColor={Colors.primary}
            />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
