import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Switch,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import * as Notifications from "expo-notifications";
import Constants, { ExecutionEnvironment } from "expo-constants";
import Text from "../components/Text";
import Colors from "../constants/Colors";
import { useRTL } from "../hooks/useRTL";
import { useTheme } from "../hooks/useTheme";
import { Theme } from "../constants/Theme";
import { PrayerKey, NotificationSettingsState } from "../store/reducers";
import {
  schedulePrayerNotifications,
  cancelAllPrayerNotifications,
} from "../utils/notifications";

const PRAYERS: PrayerKey[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

export default function ConfigScreen() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isRTL, flexRow } = useRTL();
  const theme = useTheme();

  const savedSettings: NotificationSettingsState = useSelector(
    (state: any) => state.notificationSettings
  );
  const prayerTimings: Record<string, string> | undefined = useSelector(
    (state: any) => state.prayer?.data?.timings
  );

  const [settings, setSettings] = useState<NotificationSettingsState>({
    ...savedSettings,
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const togglePrayer = useCallback((prayer: PrayerKey, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [prayer]: { ...prev[prayer], enabled: value },
    }));
    setSaved(false);
  }, []);

  const setDelay = useCallback((prayer: PrayerKey, text: string) => {
    const delay = parseInt(text, 10);
    setSettings((prev) => ({
      ...prev,
      [prayer]: { ...prev[prayer], delay: isNaN(delay) ? 0 : delay },
    }));
    setSaved(false);
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    const anyEnabled = PRAYERS.some((p) => settings[p].enabled);

    try {
      if (anyEnabled && !prayerTimings) {
        Alert.alert(t("config.title"), t("config.noPrayerTimes"));
        return;
      }

      dispatch({ type: "UPDATE_NOTIF_SETTINGS", payload: settings });

      if (!anyEnabled) {
        await cancelAllPrayerNotifications();
        setSaved(true);
        return;
      }

      if (Constants.executionEnvironment !== ExecutionEnvironment.StoreClient) {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== "granted") {
          const { status: newStatus } =
            await Notifications.requestPermissionsAsync();
          if (newStatus !== "granted") {
            Alert.alert(
              t("nav.locationPermTitle"),
              "Notification permission is required to send prayer reminders."
            );
            return;
          }
        }
      }

      const labels: Record<PrayerKey, string> = {
        fajr: t("ind.fajr"),
        dhuhr: t("ind.dhuhr"),
        asr: t("ind.asr"),
        maghrib: t("ind.maghrib"),
        isha: t("ind.isha"),
      };

      await schedulePrayerNotifications(
        prayerTimings!,
        settings,
        labels,
        t("config.notifBody")
      );

      setSaved(true);
    } finally {
      setSaving(false);
    }
  }, [settings, prayerTimings, dispatch, t]);

  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text bold style={[styles.sectionTitle, { textAlign: isRTL ? "right" : "left" }]}>
        {t("config.notifSection")}
      </Text>
      <Text style={[styles.sectionDesc, { textAlign: isRTL ? "right" : "left" }]}>
        {t("config.notifDesc")}
      </Text>

      {!prayerTimings && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>{t("config.noPrayerTimes")}</Text>
        </View>
      )}

      {PRAYERS.map((prayer) => {
        const cfg = settings[prayer];
        return (
          <View key={prayer} style={styles.prayerCard}>
            <View
              style={[
                styles.prayerRow,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
            >
              <Text bold style={styles.prayerName}>
                {t(`ind.${prayer}`)}
              </Text>
              <Switch
                value={cfg.enabled}
                onValueChange={(v) => togglePrayer(prayer, v)}
                trackColor={{ false: Colors.secondary, true: Colors.gold }}
                thumbColor={cfg.enabled ? Colors.primary : "#ccc"}
              />
            </View>

            {cfg.enabled && (
              <View
                style={[
                  styles.delayRow,
                  { flexDirection: isRTL ? "row-reverse" : "row" },
                ]}
              >
                <TextInput
                  style={[
                    styles.delayInput,
                    { textAlign: isRTL ? "right" : "left" },
                  ]}
                  keyboardType="number-pad"
                  value={cfg.delay > 0 ? String(cfg.delay) : ""}
                  onChangeText={(v) => setDelay(prayer, v)}
                  placeholder={t("config.delayPlaceholder")}
                  placeholderTextColor={theme.inputPlaceholder}
                  maxLength={3}
                />
                <Text style={styles.delayLabel}>{t("config.delayLabel")}</Text>
              </View>
            )}
          </View>
        );
      })}

      <TouchableOpacity
        style={[styles.saveBtn, saved && styles.saveBtnDone]}
        onPress={handleSave}
        activeOpacity={0.8}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color={Colors.primary} />
        ) : (
          <Text bold style={styles.saveBtnText}>
            {saved ? t("config.saved") : t("config.save")}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.bg,
    },
    content: {
      padding: 16,
      paddingBottom: 40,
    },
    sectionTitle: {
      color: Colors.gold,
      fontSize: 16,
      marginBottom: 8,
    },
    sectionDesc: {
      color: theme.textSub,
      fontSize: 13,
      lineHeight: 20,
      marginBottom: 20,
    },
    warningBox: {
      backgroundColor: Colors.danger + "22",
      borderColor: Colors.danger + "66",
      borderWidth: 1,
      borderRadius: 10,
      padding: 12,
      marginBottom: 16,
    },
    warningText: {
      color: Colors.danger,
      fontSize: 13,
      textAlign: "center",
    },
    prayerCard: {
      backgroundColor: theme.bgSurface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 14,
      marginBottom: 10,
    },
    prayerRow: {
      alignItems: "center",
      justifyContent: "space-between",
    },
    prayerName: {
      color: theme.text,
      fontSize: 15,
      flex: 1,
    },
    delayRow: {
      marginTop: 10,
      alignItems: "center",
      gap: 10,
    },
    delayInput: {
      backgroundColor: theme.inputBg,
      color: theme.inputText,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      paddingHorizontal: 12,
      paddingVertical: Platform.OS === "ios" ? 10 : 6,
      fontSize: 16,
      width: 80,
      fontFamily: "Cairo_400Regular",
    },
    delayLabel: {
      color: theme.textSub,
      fontSize: 13,
      flex: 1,
    },
    saveBtn: {
      backgroundColor: Colors.gold,
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: "center",
      marginTop: 20,
    },
    saveBtnDone: {
      backgroundColor: Colors.success,
    },
    saveBtnText: {
      color: Colors.primary,
      fontSize: 15,
    },
  });
}
