import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import { NotificationSettingsState, PrayerKey } from "../store/reducers";

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
 * Schedule (or re-schedule) prayer reminder notifications based on today's
 * prayer times and the user's notification settings.
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

  const now = new Date();

  for (const prayerKey of Object.keys(PRAYER_TIMINGS_KEYS) as PrayerKey[]) {
    const config = settings[prayerKey];
    if (!config.enabled) continue;

    const apiKey = PRAYER_TIMINGS_KEYS[prayerKey];
    const timeStr = timings[apiKey];
    if (!timeStr) continue;

    const parsed = parseTime(timeStr);
    if (!parsed) continue;

    // Build trigger date = today at prayer time + delay minutes
    const trigger = new Date();
    trigger.setHours(parsed.hours, parsed.minutes + config.delay, 0, 0);

    // Skip if already in the past
    if (trigger <= now) continue;

    await Notifications.scheduleNotificationAsync({
      identifier: `${NOTIF_ID_PREFIX}${prayerKey}`,
      content: {
        title: labels[prayerKey],
        body: notifBody,
        data: { screen: "form" },
        sound: true,
      },
      trigger: { type: SchedulableTriggerInputTypes.DATE, date: trigger },
    });
  }
}
