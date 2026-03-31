import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import * as Location from "expo-location";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import Text from "./Text";
import Colors from "../constants/Colors";
import { useTranslation } from "react-i18next";
import { useRTL } from "../hooks/useRTL";
import { useTheme } from "../hooks/useTheme";

interface Props {
  visible: boolean;
  onClose: () => void;
  onLocationChange: (name: string, coords: { latitude: number; longitude: number }) => void;
}

interface Suggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

const saveAndDispatch = async (
  dispatch: any,
  coords: { latitude: number; longitude: number }
) => {
  await SecureStore.setItemAsync("user-position", JSON.stringify(coords));
  dispatch({ type: "USER_POSITION", payload: coords });
};

export default function LocationPickerModal({ visible, onClose, onLocationChange }: Props) {
  const { t } = useTranslation();
  const { isRTL, flexRow } = useRTL();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleQueryChange = useCallback((text: string) => {
    setQuery(text);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (text.length < 2) {
      setSuggestions([]);
      return;
    }
    debounceTimer.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&format=json&limit=6&addressdetails=1`,
          { headers: { "Accept-Language": "ar,en", "User-Agent": "IltizamiApp/1.0" } }
        );
        const json: Suggestion[] = await res.json();
        setSuggestions(json);
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 500);
  }, []);

  const handleSelect = useCallback(
    async (item: Suggestion) => {
      const coords = {
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
      };
      await saveAndDispatch(dispatch, coords);
      // derive display name from first meaningful part
      const name = item.display_name.split(",")[0].trim();
      onLocationChange(name, coords);
      setQuery("");
      setSuggestions([]);
      onClose();
    },
    [dispatch, onClose, onLocationChange]
  );

  const handleUseCurrentLocation = useCallback(async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const pos = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      };
      await saveAndDispatch(dispatch, coords);

      // reverse geocode to get name
      const results = await Location.reverseGeocodeAsync(coords);
      if (results.length > 0) {
        const { city, district, subregion, region } = results[0];
        onLocationChange(city || district || subregion || region || t("location.currentLocation"), coords);
      }
      onClose();
    } catch {
      // silently fail — location remains unchanged
    } finally {
      setLocating(false);
    }
  }, [dispatch, onClose, onLocationChange]);

  const handleClose = useCallback(() => {
    setQuery("");
    setSuggestions([]);
    onClose();
  }, [onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleClose} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={[styles.sheet, { backgroundColor: theme.bgCard }]}
      >
        {/* Handle */}
        <View style={[styles.handle, { backgroundColor: theme.border }]} />

        <Text bold style={[styles.title, { color: theme.text }]}>{t("location.title")}</Text>

        {/* Current location button */}
        <TouchableOpacity
          style={[styles.currentLocBtn, { flexDirection: flexRow }]}
          onPress={handleUseCurrentLocation}
          disabled={locating}
        >
          {locating ? (
            <ActivityIndicator size="small" color={Colors.gold} />
          ) : (
            <Ionicons name="locate" size={20} color={Colors.gold} />
          )}
          <Text bold color={Colors.gold} style={styles.currentLocText}>
            {t("location.useCurrentLocation")}
          </Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          <Text style={styles.dividerText}>{t("location.orSearch")}</Text>
          <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
        </View>

        {/* Search input */}
        <View style={[styles.inputWrapper, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
          <Ionicons name="search" size={18} color={theme.inputPlaceholder} style={styles.searchIcon} />
          <TextInput
            style={[styles.input, { color: theme.inputText }]}
            placeholder={t("location.cityPlaceholder")}
            placeholderTextColor={theme.inputPlaceholder}
            value={query}
            onChangeText={handleQueryChange}
            textAlign={isRTL ? "right" : "left"}
            autoCorrect={false}
          />
          {searching && (
            <ActivityIndicator size="small" color={Colors.gold} style={styles.inputLoader} />
          )}
        </View>

        {/* Suggestions */}
        <FlatList
          data={suggestions}
          keyExtractor={(item) => String(item.place_id)}
          style={styles.list}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.suggestionRow, { borderBottomColor: theme.border }]} onPress={() => handleSelect(item)}>
              <Ionicons name="location-outline" size={16} color={theme.textMuted} style={styles.suggestionIcon} />
              <Text style={styles.suggestionText} numberOfLines={2}>
                {item.display_name}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            query.length >= 2 && !searching ? (
              <Text style={styles.emptyText}>{t("location.noResults")}</Text>
            ) : null
          }
        />
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 34,
    maxHeight: "75%",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#ddd",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    textAlign: "center",
    marginBottom: 20,
    color: Colors.primary,
  },
  currentLocBtn: {
    alignItems: "center",
    gap: 10,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  currentLocText: {
    fontSize: 15,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#eee",
  },
  dividerText: {
    color: "#999",
    fontSize: 12,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fafafa",
    marginBottom: 8,
  },
  searchIcon: {
    marginLeft: 6,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: "#222",
    fontFamily: undefined,
  },
  inputLoader: {
    marginRight: 6,
  },
  list: {
    maxHeight: 260,
  },
  suggestionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    gap: 8,
  },
  suggestionIcon: {
    marginTop: 2,
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    color: "#aaa",
    paddingVertical: 20,
    fontSize: 14,
  },
});
