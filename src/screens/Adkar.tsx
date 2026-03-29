import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import Text from "../components/Text";
import { AdkarTypes } from "../../utils";
import Colors from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useRTL } from "../hooks/useRTL";

type Category = {
  id: string;
  titleKey: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

const CATEGORIES: Category[] = [
  { id: AdkarTypes.SABAH, titleKey: "adkar.sabah", icon: "sunny-outline", color: "#F5A623" },
  { id: AdkarTypes.MASA, titleKey: "adkar.masa", icon: "moon-outline", color: "#6B9BD2" },
  { id: AdkarTypes.NAWM, titleKey: "adkar.nawm", icon: "bed-outline", color: "#9B8EA0" },
  { id: AdkarTypes.SALAWAT, titleKey: "adkar.salawat", icon: "hand-right-outline", color: "#5cb85c" },
  { id: AdkarTypes.SALAT_DIVERS, titleKey: "adkar.salatDivers", icon: "book-outline", color: "#E67E22" },
  { id: AdkarTypes.TASABIH, titleKey: "adkar.tasabih", icon: "radio-button-on-outline", color: Colors.blue },
  { id: AdkarTypes.DIVERS, titleKey: "adkar.divers", icon: "star-outline", color: Colors.gold },
];

export default function Adkar({ navigation }: any) {
  const { t } = useTranslation();
  const { flexRow, textAlign } = useRTL();

  const handleNavigation = (id: string, titleKey: string) => {
    navigation.navigate("adkar-list", { id, title: t(titleKey) });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      style={styles.container}
    >
      {CATEGORIES.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={[styles.item, { flexDirection: flexRow }]}
          onPress={() => handleNavigation(cat.id, cat.titleKey)}
          activeOpacity={0.7}
        >
          <View style={[styles.iconWrapper, { backgroundColor: cat.color + "22" }]}>
            <Ionicons name={cat.icon} size={22} color={cat.color} />
          </View>
          <Text size={18} style={[styles.label, { textAlign }]}>
            {t(cat.titleKey)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  contentContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  item: {
    backgroundColor: "white",
    marginBottom: 10,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 14,
  },
  label: {
    flex: 1,
  },
});
