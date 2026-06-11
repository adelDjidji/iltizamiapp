import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import * as Location from "expo-location";
import Container from "../components/Container";
import Text from "../components/Text";
import Colors from "../constants/Colors";
import { GlassButton, GlassCard } from "../components/GlassSurface";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import Clock from "../components/Clock";
import SalatTable from "../components/SalatTable";
import { Ionicons } from "@expo/vector-icons";
import LocationPickerModal from "../components/LocationPickerModal";
import { useTranslation } from "react-i18next";
import { useRTL } from "../hooks/useRTL";
import {
  schedulePrayerNotifications,
  ensureNotificationPermission,
} from "../utils/notifications";
import { fetchPrayerTimings } from "../utils/prayerApi";
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
  const { flexRow } = useRTL();
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
    (state: any) => state.notificationSettings,
  );

  // Keep a ref to current cached data so callbacks can check it without stale closures
  const dataRef = React.useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const dispatch = useDispatch();

  // Improved error handling and loading state management
  const loadPrayersTimings = useCallback(
    async (location: LocationState | null) => {
      if (!location) {
        Alert.alert(t("nav.locationUnavailTitle"), t("nav.locationUnavailMsg"));
        return;
      }

      try {
        setIsFetching(true);
        const prayerData = await fetchPrayerTimings(location);
        dispatch({
          type: "LOAD_DATA",
          payload: {
            current_date: dayjs().format("DD-MM-YYYY"),
            data: prayerData,
          },
        });
        // Re-register OS repeating alarms when fresh prayer times arrive.
        const anyEnabled = (
          Object.keys(notificationSettings) as PrayerKey[]
        ).some((k) => notificationSettings[k].enabled);
        if (anyEnabled) {
          const granted = await ensureNotificationPermission();
          if (granted) {
            const labels: Record<PrayerKey, string> = {
              fajr: t("ind.fajr"),
              dhuhr: t("ind.dhuhr"),
              asr: t("ind.asr"),
              maghrib: t("ind.maghrib"),
              isha: t("ind.isha"),
            };
            await schedulePrayerNotifications(
              prayerData.timings,
              notificationSettings,
              labels,
              t("config.notifBody"),
              { force: true },
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
    [dispatch, notificationSettings, t],
  );

  // Simplified loading function using the callback
  const loadTimings = useCallback(() => {
    loadPrayersTimings(userPosition);
  }, [loadPrayersTimings, userPosition]);

  // Check if we need to reload data based on date
  const needsReload = useMemo(() => {
    const today = dayjs().format("DD-MM-YYYY");
    return !data || current_date !== today;
  }, [data, current_date]);

  // Open the location picker when the Prayers screen has no stored position.
  useEffect(() => {
    if (!userPosition) setLocationModalVisible(true);
  }, [userPosition]);

  // Load prayer timings whenever we have a position and data is stale.
  useEffect(() => {
    if (userPosition && needsReload) {
      loadTimings();
    }
  }, [userPosition, needsReload, loadTimings]);

  const handleRetry = useCallback(() => {
    if (userPosition) loadTimings();
    else setLocationModalVisible(true);
  }, [userPosition, loadTimings]);

  useEffect(() => {
    if (!userPosition) return;
    Location.reverseGeocodeAsync(userPosition)
      .then((results) => {
        console.log("reverseGeocodeAsync results", results);
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
    <Container navigation={navigation} style={[styles.container]}>
      <ImageBackground
        source={require("../../assets/26080.jpg")}
        resizeMode="cover"
        style={styles.coverImage}
      >
        <Clock />

        <View style={[styles.topControlsContainer, { flexDirection: flexRow }]}>
          <GlassButton
            style={styles.locationChip}
            onPress={() => setLocationModalVisible(true)}
          >
            <View style={[styles.locationInner, { flexDirection: flexRow }]}>
              <Ionicons name="location-sharp" size={12} color={Colors.gold} />
              <Text style={styles.locationText} color={theme.textSub}>
                {locationName ?? t("home.setLocation")}
              </Text>
            </View>
          </GlassButton>
        </View>

        <LocationPickerModal
          visible={locationModalVisible}
          required={!userPosition}
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
          <GlassCard style={styles.errorCard}>
            <View style={styles.errorBody}>
              <Text style={styles.errorText}>
                {!userPosition
                  ? t("home.locationRequired")
                  : t("home.errorLoadingPrayers")}
              </Text>
              <GlassButton
                style={styles.retryButton}
                onPress={handleRetry}
                active
                activeColor={Colors.gold + "dd"}
              >
                <Text
                  bold
                  color={Colors.primary}
                  style={styles.retryButtonText}
                >
                  {!userPosition ? t("home.setLocation") : t("home.retry")}
                </Text>
              </GlassButton>
            </View>
          </GlassCard>
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
    paddingBottom: 20,
    justifyContent: "flex-end",
  },
  dateText: {
    color: "rgba(255,255,255,0.92)",
    textAlign: "right",
    fontSize: 15,
    letterSpacing: 0.2,
  },
  dateContainer: {
    paddingHorizontal: 32,
    marginBottom: 20,
    gap: 2,
  },
  topControlsContainer: {
    paddingHorizontal: 32,
    marginBottom: 6,
    alignItems: "center",
    gap: 16,
    paddingBottom: 16,
  },
  locationChip: {
    borderRadius: 16,
  },
  locationInner: {
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  locationText: {
    fontSize: 13,
    letterSpacing: 0.1,
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
  },
  errorCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 24,
  },
  errorBody: {
    padding: 20,
    alignItems: "center",
  },
  errorText: {
    textAlign: "center",
    marginBottom: 16,
    fontSize: 14,
  },
  retryButton: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 18,
    minWidth: 130,
  },
  retryButtonText: {
    fontSize: 14,
  },
});
