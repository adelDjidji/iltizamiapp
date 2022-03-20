import moment from "moment";

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
      console.log("reducer: payload", action.payload);
      // look for current date if exist: update data, else create new record
      let date_exist = !!state.results.find(
        (el) => el.date === moment().format("YYYY-MM-DD")
      );
      let tmp;
      let exist = false;
      tmp = state.results.map(({ date, data }) => {
        let el = { date, data };
        console.log("compare", date, moment().format("YYYY-MM-DD"));
        if (date === moment().format("YYYY-MM-DD")) {
          exist = true;
          console.log("date exisit yes");
          el.data = action.payload;
        }
        return el;
      });
      if (!exist) {
        console.log("date new");
        tmp.push({
          date: moment().format("YYYY-MM-DD"),
          data: action.payload,
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
