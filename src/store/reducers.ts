import moment from "moment";
import { Goal } from "../components/GoalsManager";
const initialAuthState = {
  user: null,
  logged: false,
};

export const authReducer = (state = initialAuthState, action: any) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        logged: true,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        logged: false,
      };
  }
  return state;
};
export const TimingReducer = (
  state = { current_date: null, data: null },
  action: any,
) => {
  switch (action.type) {
    case "LOAD_DATA":
      return {
        ...state,
        current_date: action.payload.current_date,
        data: action.payload.data,
      };
  }
  return state;
};

export const GoalsReducer = (state = { goals: [] }, action: any) => {
  switch (action.type) {
    case "ADD_GOAL":
      return {
        ...state,
        goals: [...state.goals, action.payload],
      };
    case "CHECK_GOAL":
      return {
        ...state,
        goals: state.goals.map((item: any) => {
          if (item?.id === action.payload) return { ...item, done: true };
          else return item;
        }),
      };
    case "EDIT_GOAL":
      return {
        ...state,
        goals: state.goals.map((item: any) => {
          if (item?.id === action.payload.id)
            return { ...item, title: action.payload.title };
          else return item;
        }),
      };
    case "DELETE_GOAL":
      return {
        ...state,
        goals: state.goals.filter((item: any) => item.id !== action.payload),
      };
  }
  return state;
};
export const SettingsReducer = (
  state = {
    userPosition: null,
    language: "ar" as "ar" | "en",
    theme: "dark" as "dark" | "light",
  },
  action: any,
) => {
  switch (action.type) {
    case "USER_POSITION":
      return {
        ...state,
        userPosition: action.payload,
      };
    case "SET_LANGUAGE":
      return {
        ...state,
        language: action.payload as "ar" | "en",
      };
    case "SET_THEME":
      return {
        ...state,
        theme: action.payload as "dark" | "light",
      };
  }
  return state;
};
export type PrayerKey = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";
export interface PrayerNotifConfig {
  enabled: boolean;
  delay: number; // minutes after prayer time
}
export type NotificationSettingsState = Record<PrayerKey, PrayerNotifConfig>;

const initialNotificationSettings: NotificationSettingsState = {
  fajr: { enabled: false, delay: 15 },
  dhuhr: { enabled: false, delay: 15 },
  asr: { enabled: false, delay: 15 },
  maghrib: { enabled: false, delay: 15 },
  isha: { enabled: false, delay: 15 },
};

export const NotificationSettingsReducer = (
  state = initialNotificationSettings,
  action: any,
): NotificationSettingsState => {
  switch (action.type) {
    case "UPDATE_NOTIF_SETTINGS":
      return { ...state, ...action.payload };
  }
  return state;
};

export const StatsReducer = (
  state = { results: [{ date: "", data: [[]] }] },
  action: any,
) => {
  switch (action.type) {
    case "UPDATE_RESULT":
      const payloadData = action.payload.data;
      const day = action.payload.day;
      // look for current date if exist: update data, else create new record
      const dayKey = moment(day).locale("en").format("YYYY-MM-DD");
      let date_exist = !!state.results.find((el) => el.date === dayKey);
      let tmp;
      let exist = false;
      tmp = state.results.map(({ date, data }) => {
        let el = { date, data };
        if (date === dayKey) {
          exist = true;
          el.data = payloadData;
        }
        return el;
      });
      if (!exist) {
        tmp.push({
          date: dayKey,
          data: payloadData,
        });
      }

      return {
        ...state,
        results: tmp,
      };
    case "CLEAR":
      return {
        ...state,
        results: [{ date: "", data: [[]] }],
      };
  }

  return state;
};
