import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import Container from "../components/Container";
import Text from "../components/Text";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Clock from "../components/Clock";
import SalatTable from "../components/SalatTable";
import { Ionicons } from "@expo/vector-icons";
import LocationPickerModal from "../components/LocationPickerModal";
import { useTranslation } from "react-i18next";
import { useRTL } from "../hooks/useRTL";
import { schedulePrayerNotifications } from "../utils/notifications";
import { PrayerKey } from "../store/reducers";
import { useTheme } from "../hooks/useTheme";

// Define TypeScript interfaces for better type checking
interface HomeProps {
  navigation: any;
}

interface LocationState {
  latitude: number;
  longitude: number;
}

interface PrayerState {
  current_date: string | null;
  data: any;
}

interface SettingsState {
  userPosition: LocationState | null;
}

interface RootState {
  prayer: PrayerState;
  settings: SettingsState;
}

export default function Home({ navigation }: HomeProps) {
  const { t } = useTranslation();
  const { isRTL, flexRow } = useRTL();
  const theme = useTheme();
  const [isFetching, setIsFetching] = useState(false);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [locationModalVisible, setLocationModalVisible] = useState(false);

  // Type our selectors properly
  const { current_date, data } = useSelector(
    (state: RootState) => state.prayer,
  );
  const { userPosition } = useSelector((state: RootState) => state.settings);
  const notificationSettings = useSelector(
    (state: any) => state.notificationSettings
  );

  // Keep a ref to current cached data so callbacks can check it without stale closures
  const dataRef = React.useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const dispatch = useDispatch();

  // Move API URL construction to useMemo to prevent unnecessary recalculations
  const getApiUrl = useCallback((location: LocationState) => {
    const defaultMethod = 3;
    const formattedDate = moment(new Date()).format("DD-MM-YYYY");

    return `http://api.aladhan.com/v1/timings/${formattedDate}?latitude=${location?.latitude}&longitude=${location?.longitude}&method=${defaultMethod}&adjustment=1`;
  }, []);

  // Improved error handling and loading state management
  const loadPrayersTimings = useCallback(
    async (location: LocationState | null) => {
      if (!location) {
        Alert.alert(t("nav.locationUnavailTitle"), t("nav.locationUnavailMsg"));
        return;
      }

      try {
        setIsFetching(true);
        const API_URL = getApiUrl(location);
        const response = await fetch(API_URL);
        const responseData = await response.json();

        if (responseData.code === 200) {
          dispatch({
            type: "LOAD_DATA",
            payload: {
              current_date: moment(new Date()).format("DD-MM-YYYY"),
              data: responseData.data,
            },
          });
          // Reschedule prayer notifications with fresh times
          const anyEnabled = (Object.keys(notificationSettings) as PrayerKey[])
            .some((k) => notificationSettings[k].enabled);
          if (anyEnabled) {
            const labels: Record<PrayerKey, string> = {
              fajr: t("ind.fajr"),
              dhuhr: t("ind.dhuhr"),
              asr: t("ind.asr"),
              maghrib: t("ind.maghrib"),
              isha: t("ind.isha"),
            };
            schedulePrayerNotifications(
              responseData.data.timings,
              notificationSettings,
              labels,
              t("config.notifBody")
            ).catch(() => {});
          }
        } else {
          // Only alert if there is no cached data to fall back on
          if (!dataRef.current) {
            Alert.alert(
              t("nav.serverErrTitle"),
              responseData.data || t("home.errorLoadingPrayers"),
            );
          }
        }
      } catch (error) {
        // Only alert the user if there is no cached data — otherwise silently use the cache
        if (!dataRef.current) {
          Alert.alert(t("nav.connErrTitle"), t("nav.connErrMsg"));
        }
      } finally {
        setIsFetching(false);
      }
    },
    [dispatch, getApiUrl, notificationSettings, t],
  );

  // Simplified loading function using the callback
  const loadTimings = useCallback(() => {
    loadPrayersTimings(userPosition);
  }, [loadPrayersTimings, userPosition]);

  // Check if we need to reload data based on date
  const needsReload = useMemo(() => {
    const today = moment(new Date()).format("DD-MM-YYYY");
    return !data || current_date !== today;
  }, [data, current_date]);

  // Use effect with proper dependencies
  useEffect(() => {
    if (needsReload) {
      loadTimings();
    }
  }, [needsReload, loadTimings]);

  useEffect(() => {
    if (!userPosition) return;
    Location.reverseGeocodeAsync(userPosition)
      .then((results) => {
        if (results.length > 0) {
          const { city, district, subregion, region } = results[0];
          setLocationName(city || district || subregion || region || null);
        }
      })
      .catch(() => {});
  }, [userPosition]);

  // Memoize the date display component to prevent unnecessary re-renders
  const DateDisplay = useMemo(() => {
    if (isFetching || !data?.date) return null;

    return (
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{data.date.readable}</Text>
        <Text style={styles.dateText}>
          {data.date.hijri.weekday.ar} {data.date.hijri.day}{" "}
          {data.date.hijri.month.ar} {data.date.hijri.year}
        </Text>
      </View>
    );
  }, [data, isFetching]);

  return (
    <Container navigation={navigation} style={[styles.container, { backgroundColor: theme.bg }]}>
      <ImageBackground
        resizeMode="cover"
        style={styles.coverImage}
        source={require("../../assets/26080.jpg")}
      >
        <Clock />

        <TouchableOpacity
          style={[styles.locationContainer, { flexDirection: flexRow }]}
          onPress={() => setLocationModalVisible(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="location" size={16} color="white" />
          <Text style={styles.locationText}>
            {locationName ?? t("home.setLocation")}
          </Text>
          <Ionicons name="pencil" size={12} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>

        <LocationPickerModal
          visible={locationModalVisible}
          onClose={() => setLocationModalVisible(false)}
          onLocationChange={(name, coords) => {
            setLocationName(name);
            loadPrayersTimings(coords);
          }}
        />

        {DateDisplay}

        {isFetching ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="white" />
            <Text style={styles.loadingText}>{t("home.loadingPrayers")}</Text>
          </View>
        ) : !data ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{t("home.errorLoadingPrayers")}</Text>
          </View>
        ) : (
          <SalatTable data={data} />
        )}
      </ImageBackground>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5", // More neutral background color
  },
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
    fontSize: 16,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  dateContainer: {
    marginRight: 40,
    marginBottom: 20,
  },
  locationContainer: {
    marginRight: 40,
    marginBottom: 6,
    display: "flex",
    alignItems: "center",
    gap: 4,
    paddingBottom: 20,
  },
  locationText: {
    color: "white",
    textAlign: "right",
    fontSize: 14,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  loadingText: {
    color: "white",
    marginTop: 10,
    fontSize: 16,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  errorContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  errorText: {
    color: "white",
    textAlign: "center",
  },
});
