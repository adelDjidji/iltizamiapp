import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import Constants, { ExecutionEnvironment } from "expo-constants";
import { Platform } from "react-native";
import { NotificationSettingsState, PrayerKey } from "../store/reducers";

/** Request notification permission when not already granted (skipped in Expo Go). */
export async function ensureNotificationPermission(): Promise<boolean> {
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
    return true;
  }

  const { status } = await Notifications.getPermissionsAsync();
  if (status === "granted") return true;

  const { status: newStatus } = await Notifications.requestPermissionsAsync();
  return newStatus === "granted";
}

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

function getReminderTime(
  timings: Record<string, string>,
  prayerKey: PrayerKey,
  delay: number,
): { hour: number; minute: number } | null {
  const apiKey = PRAYER_TIMINGS_KEYS[prayerKey];
  const timeStr = timings[apiKey];
  if (!timeStr) return null;

  const parsed = parseTime(timeStr);
  if (!parsed) return null;

  const totalMinutes = parsed.hours * 60 + parsed.minutes + delay;
  return {
    hour: Math.floor(totalMinutes / 60) % 24,
    minute: totalMinutes % 60,
  };
}

function getTriggerHourMinute(
  trigger: Notifications.NotificationTrigger | null | undefined,
): { hour: number; minute: number } | null {
  if (!trigger || typeof trigger !== "object") return null;

  const value = trigger as { hour?: number; minute?: number };
  if (typeof value.hour !== "number" || typeof value.minute !== "number") {
    return null;
  }

  return { hour: value.hour, minute: value.minute };
}

/**
 * OS-level repeating trigger — fires every day at the same time even when
 * the app has not been opened for weeks.
 */
function buildDailyRepeatTrigger(
  hour: number,
  minute: number,
): Notifications.SchedulableNotificationTriggerInput {
  if (Platform.OS === "ios") {
    return {
      type: SchedulableTriggerInputTypes.CALENDAR,
      hour,
      minute,
      repeats: true,
    };
  }

  return {
    type: SchedulableTriggerInputTypes.DAILY,
    hour,
    minute,
    channelId: PRAYER_CHANNEL_ID,
  };
}

/** Cancel all scheduled prayer reminder notifications */
export async function cancelAllPrayerNotifications(): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const prayerNotifs = scheduled.filter((n) =>
    n.identifier.startsWith(NOTIF_ID_PREFIX),
  );
  await Promise.all(
    prayerNotifs.map((n) =>
      Notifications.cancelScheduledNotificationAsync(n.identifier),
    ),
  );
}

async function shouldReschedulePrayerNotifications(
  timings: Record<string, string>,
  settings: NotificationSettingsState,
): Promise<boolean> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const prayerNotifs = scheduled.filter((n) =>
    n.identifier.startsWith(NOTIF_ID_PREFIX),
  );

  for (const prayerKey of Object.keys(PRAYER_TIMINGS_KEYS) as PrayerKey[]) {
    const config = settings[prayerKey];
    const identifier = `${NOTIF_ID_PREFIX}${prayerKey}`;
    const existing = prayerNotifs.find((n) => n.identifier === identifier);

    if (!config.enabled) {
      if (existing) return true;
      continue;
    }

    const expected = getReminderTime(timings, prayerKey, config.delay);
    if (!expected) return true;
    if (!existing) return true;

    const actual = getTriggerHourMinute(existing.trigger);
    if (
      !actual ||
      actual.hour !== expected.hour ||
      actual.minute !== expected.minute
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Schedule (or re-schedule) daily repeating prayer reminder notifications.
 * Uses OS repeating triggers so notifications fire every day even when the
 * app is closed. Only re-registers with the OS when timings or settings change.
 */
export async function schedulePrayerNotifications(
  timings: Record<string, string>,
  settings: NotificationSettingsState,
  labels: Record<PrayerKey, string>,
  notifBody: string,
  options?: { force?: boolean },
): Promise<void> {
  const needsReschedule =
    options?.force || (await shouldReschedulePrayerNotifications(timings, settings));
  if (!needsReschedule) return;

  await cancelAllPrayerNotifications();

  for (const prayerKey of Object.keys(PRAYER_TIMINGS_KEYS) as PrayerKey[]) {
    const config = settings[prayerKey];
    if (!config.enabled) continue;

    const reminderTime = getReminderTime(timings, prayerKey, config.delay);
    if (!reminderTime) continue;

    await Notifications.scheduleNotificationAsync({
      identifier: `${NOTIF_ID_PREFIX}${prayerKey}`,
      content: {
        title: labels[prayerKey],
        body: notifBody,
        data: { screen: "form" },
        sound: true,
      },
      trigger: buildDailyRepeatTrigger(
        reminderTime.hour,
        reminderTime.minute,
      ),
    });
  }
}
