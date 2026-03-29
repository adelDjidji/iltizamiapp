import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React from "react";
import Container from "../components/Container";
import Text from "../components/Text";
import Colors from "../constants/Colors";
import * as Linking from "expo-linking";
import Constants from "expo-constants";
import * as Updates from "expo-updates";
import { useTranslation } from "react-i18next";
import { useRTL } from "../hooks/useRTL";

export default function About() {
  const { t } = useTranslation();
  const { isRTL, flexRow, textAlign } = useRTL();
  const version = Constants.expoConfig?.version;

  const [updateAvailable, setUpdateAvailable] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    Updates.checkForUpdateAsync()
      .then((res) => setUpdateAvailable(res.isAvailable))
      .catch(() => {});
  }, []);

  const handleUpdate = async () => {
    setRefreshing(true);
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch {
      setRefreshing(false);
    }
  };

  return (
    <Container style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          style={styles.icon}
          source={require("../../assets/iltizamiIcon.png")}
        />
        <Text h2 align="center">{t("about.title")}</Text>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Text style={[styles.paragraph, { textAlign }]}>
          {t("about.description")}
        </Text>
        <Text style={styles.quote} color={Colors.goldDark}>
          {t("about.quote")}
        </Text>
        <Text p color="#999" align="center" style={{ marginTop: 4 }}>
          {t("about.quoteAuthor")}
        </Text>

        {/* Feedback */}
        <TouchableOpacity
          style={[styles.feedbackButton, { flexDirection: flexRow }]}
          onPress={() => Linking.openURL("https://www.facebook.com/iltizamiApp")}
          activeOpacity={0.7}
        >
          <Image
            style={styles.messengerIcon}
            source={require("../../assets/messenger-icon.png")}
          />
          <Text h3 color="white">{t("about.feedback")}</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text p color="#aaa" align="center">
          {t("about.comingFeatures")}
        </Text>
        <Text p color="#bbb" align="center" style={{ marginTop: 4 }}>
          {t("about.version")} {version}
        </Text>
        {updateAvailable && (
          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleUpdate}
            disabled={refreshing}
            activeOpacity={0.8}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text bold color="white">{t("about.update")}</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  header: {
    alignItems: "center",
    borderBottomColor: Colors.gold,
    backgroundColor: Colors.goldLight,
    paddingVertical: 24,
    borderBottomWidth: 1,
    gap: 8,
  },
  icon: {
    width: 90,
    height: 90,
    marginBottom: 8,
  },
  body: {
    padding: 20,
    gap: 16,
  },
  paragraph: {
    lineHeight: 24,
    textAlign: "right",
  },
  quote: {
    fontSize: 15,
    lineHeight: 26,
    textAlign: "center",
    fontStyle: "italic",
    backgroundColor: Colors.goldLight,
    borderRadius: 10,
    padding: 14,
    marginTop: 8,
  },
  feedbackButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0084ff",
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    gap: 10,
  },
  messengerIcon: {
    width: 24,
    height: 24,
    marginLeft: 8,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    width: "100%",
    alignItems: "center",
    gap: 4,
  },
  updateButton: {
    backgroundColor: Colors.gold,
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginTop: 10,
    minWidth: 160,
    alignItems: "center",
  },
});
