import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  StatusBar,
  ScrollView,
  StyleSheet,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import Container from "../components/Container";
import Text from "../components/Text";
import Colors from "../constants/Colors";
import GoalsManager from "../components/GoalsManager";
import ChallengeCard from "../components/ChallengeCard";
import { useRTL } from "../hooks/useRTL";

/** Language toggle pill shown in the top header area. */
const LanguageSelector = () => {
  const dispatch = useDispatch();
  const { isRTL } = useRTL();

  const select = (lang: "ar" | "en") => {
    dispatch({ type: "SET_LANGUAGE", payload: lang });
  };

  return (
    <View style={styles.langPill}>
      <TouchableOpacity
        style={[styles.langBtn, !isRTL && styles.langBtnActive]}
        onPress={() => select("en")}
        activeOpacity={0.8}
      >
        <Text style={[styles.langBtnText, !isRTL && styles.langBtnTextActive]}>
          EN
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.langBtn, isRTL && styles.langBtnActive]}
        onPress={() => select("ar")}
        activeOpacity={0.8}
      >
        <Text style={[styles.langBtnText, isRTL && styles.langBtnTextActive]}>
          عر
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const CardButton = ({
  icon,
  title = "",
  color = "#a2f",
  onPress = () => {},
  fullWidth = false,
}) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: color,
        width: fullWidth ? "95%" : Dimensions.get("window").width / 2 - 20,
        margin: 10,
        padding: 10,
        height: 80,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
      }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon}
      <Text style={{ marginTop: 10, fontSize: 18 }}>{title}</Text>
    </TouchableOpacity>
  );
};

export default function Dashboard({ navigation }) {
  const { t } = useTranslation();
  const { flexRow } = useRTL();

  return (
    <ScrollView>
      <Container navigation={navigation}>
        <ImageBackground
          style={{ height: Dimensions.get("window").height, paddingTop: 220 }}
          resizeMode="cover"
          source={require("../../assets/26080.jpg")}
        >
          {/* Header: language selector */}
          <View
            style={[
              styles.header,
              {
                marginTop: StatusBar.currentHeight,
                flexDirection: flexRow,
              },
            ]}
          >
            <LanguageSelector />
          </View>

          <GoalsManager />

          <View style={{ flexDirection: flexRow }}>
            <CardButton
              title={t("dashboard.adkar")}
              color="#9AD0EC"
              icon={
                <Image
                  style={{ width: 30, height: 30 }}
                  source={require("../../assets/prayer.png")}
                />
              }
              onPress={() => navigation.push("adkar")}
            />
            <CardButton
              title={t("dashboard.form")}
              color="#EFDAD7"
              icon={
                <Image
                  style={{ width: 30, height: 30 }}
                  source={require("../../assets/checklist.png")}
                />
              }
              onPress={() => navigation.push("form")}
            />
          </View>
          <CardButton
            title={t("dashboard.stats")}
            color="white"
            fullWidth
            icon={<AntDesign name="line-chart" size={24} color="black" />}
            onPress={() => navigation.push("Stats")}
          />
          <ChallengeCard onPress={() => navigation.push("challenge")} />
        </ImageBackground>
      </Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "transparent",
    position: "absolute",
    top: 0,
    justifyContent: "flex-start",
    zIndex: 2,
    width: "100%",
    elevation: 2,
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  langPill: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 20,
    overflow: "hidden",
    gap: 5,
  },
  langBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderColor: "rgba(255,255,255,0.5)",
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "black",
  },
  langBtnActive: {
    backgroundColor: Colors.gold,
    borderRadius: 20,
  },
  langBtnText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    fontWeight: "600",
  },
  langBtnTextActive: {
    color: Colors.primary,
    fontWeight: "700",
  },
});
