import dayjs from "dayjs";

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export function getPrayerTimingsUrl(
  location: UserLocation,
  date = dayjs().format("DD-MM-YYYY"),
): string {
  return `https://api.aladhan.com/v1/timings/${date}?latitude=${location.latitude}&longitude=${location.longitude}&method=3&adjustment=1`;
}

export async function fetchPrayerTimings(location: UserLocation) {
  const response = await fetch(getPrayerTimingsUrl(location));
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const responseData = await response.json();
  if (responseData.code !== 200) {
    throw new Error("Prayer timings API error");
  }

  return responseData.data as {
    timings: Record<string, string>;
    date: unknown;
    [key: string]: unknown;
  };
}
