import { View, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import Card from "./Card";
import Text from "./Text";
import { Zekr } from "../screens/AdkarList";
import Colors from "../constants/Colors";
import { useTranslation } from "react-i18next";

type Props = { item: Zekr };

export default function ZekrCounter({ item }: Props) {
  const { t } = useTranslation();
  const [count, setCount] = React.useState(0);
  const done = count >= item.reps;

  const handlePress = () => {
    if (!done) setCount((c) => c + 1);
  };

  const pct = Math.min(count / item.reps, 1);

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={done ? 1 : 0.8}>
      <Card>
        <Card.Body>
          {!!item.header && (
            <Text h3 style={{ marginBottom: 8 }} bold color={Colors.goldDark}>
              {item.header}
            </Text>
          )}
          <Text h2 color={done ? "#aaa" : "#222"}>
            {item.body}
          </Text>
          {!!item.footer && (
            <Text style={{ marginTop: 10 }} p color={Colors.goldDark}>
              {item.footer}
            </Text>
          )}
        </Card.Body>

        <View style={styles.footer}>
          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${pct * 100}%` as any,
                  backgroundColor: done ? Colors.success : Colors.gold,
                },
              ]}
            />
          </View>

          {/* Counter row */}
          <View style={styles.counterRow}>
            {done ? (
              <Text bold color={Colors.success} style={styles.doneLabel}>
                {t("zekr.done")}
              </Text>
            ) : (
              <>
                <Text h3 bold color={Colors.gold}>
                  {count}
                </Text>
                <Text color="#bbb"> / </Text>
                <Text h3 color="#888">
                  {item.reps}
                </Text>
              </>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  progressTrack: {
    height: 5,
    backgroundColor: "#e8e8e8",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: 5,
    borderRadius: 3,
  },
  counterRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  doneLabel: {
    fontSize: 16,
  },
});
