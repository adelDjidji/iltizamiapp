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
  action: any
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

export const GoalsReducer = (
  state = { goals: [] },
  action: any
) => {
  switch (action.type) {
    case "ADD_GOAL":
      return {
        ...state,
        goals:[...state.goals, action.payload],
      };
    case "CHECK_GOAL":
      return {
        ...state,
        goals:state.goals.map((item:any)=>{
          if(item?.id===action.payload) return {...item, done:true}
          else return item
        }),
      };
    case "DELETE_GOAL":
      return {
        ...state,
        goals:state.goals.filter((item:any)=>item.id!==action.payload),
      };
  }
  return state;
};
export const SettingsReducer = (
  state = { userPosition: null },
  action: any
) => {
  switch (action.type) {
    case "USER_POSITION":
      return {
        ...state,
        userPosition: action.payload,
      };
  }
  return state;
};
export const StatsReducer = (
  state = { results: [{ date: "", data: [[]] }] },
  action: any
) => {
  switch (action.type) {
    case "UPDATE_RESULT":
      const payloadData = action.payload.data
      const day= action.payload.day
      // look for current date if exist: update data, else create new record
      let date_exist = !!state.results.find(
        (el) => el.date === moment(day).format("YYYY-MM-DD")
      );
      let tmp;
      let exist = false;
      tmp = state.results.map(({ date, data }) => {
        let el = { date, data };
        if (date === moment(day).format("YYYY-MM-DD")) {
          exist = true;
          el.data = payloadData;
        }
        return el;
      });
      if (!exist) {
        tmp.push({
          date: moment(day).format("YYYY-MM-DD"),
          data: payloadData,
        });
      }

      return {
        ...state,
        results: tmp,
      };
  case "CLEAR":
    return{
      ...state,
      results:[{ date: "", data: [[]] }]
    }
    }

  return state;
};
