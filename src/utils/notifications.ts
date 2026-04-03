import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import { Platform } from "react-native";
import { NotificationSettingsState, PrayerKey } from "../store/reducers";

// Must match the channel created in App.tsx
export const PRAYER_CHANNEL_ID = "prayer-reminders";

// Aladhan API timings keys map to our prayer keys
const PRAYER_TIMINGS_KEYS: Record<PrayerKey, string> = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

const NOTIF_ID_PREFIX = "prayer_reminder_";

/** Parse "HH:MM" or "HH:MM (GMT+X)" → { hours, minutes } */
function parseTime(timeStr: string): { hours: number; minutes: number } | null {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return null;
  return { hours: parseInt(match[1], 10), minutes: parseInt(match[2], 10) };
}

/** Cancel all scheduled prayer reminder notifications */
export async function cancelAllPrayerNotifications(): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const prayerNotifs = scheduled.filter((n) =>
    n.identifier.startsWith(NOTIF_ID_PREFIX)
  );
  await Promise.all(
    prayerNotifs.map((n) =>
      Notifications.cancelScheduledNotificationAsync(n.identifier)
    )
  );
}

/**
 * Schedule (or re-schedule) daily repeating prayer reminder notifications.
 * Uses a DAILY trigger so notifications fire every day at the same time
 * even when the app is not open.
 *
 * @param timings  - The `timings` object from Aladhan API (e.g. { Fajr: "05:30", ... })
 * @param settings - The user's per-prayer notification settings from Redux
 * @param labels   - Localised prayer names for the notification title/body
 */
export async function schedulePrayerNotifications(
  timings: Record<string, string>,
  settings: NotificationSettingsState,
  labels: Record<PrayerKey, string>,
  notifBody: string
): Promise<void> {
  // Cancel existing prayer reminders first
  await cancelAllPrayerNotifications();

  for (const prayerKey of Object.keys(PRAYER_TIMINGS_KEYS) as PrayerKey[]) {
    const config = settings[prayerKey];
    if (!config.enabled) continue;

    const apiKey = PRAYER_TIMINGS_KEYS[prayerKey];
    const timeStr = timings[apiKey];
    if (!timeStr) continue;

    const parsed = parseTime(timeStr);
    if (!parsed) continue;

    // Apply delay offset, handling minute overflow into the next hour
    const totalMinutes = parsed.hours * 60 + parsed.minutes + config.delay;
    const hour = Math.floor(totalMinutes / 60) % 24;
    const minute = totalMinutes % 60;

    await Notifications.scheduleNotificationAsync({
      identifier: `${NOTIF_ID_PREFIX}${prayerKey}`,
      content: {
        title: labels[prayerKey],
        body: notifBody,
        data: { screen: "form" },
        sound: true,
      },
      trigger: {
        type: SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        ...(Platform.OS === "android" && { channelId: PRAYER_CHANNEL_ID }),
      },
    });
  }
}
