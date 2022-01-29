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
        user:action.payload
      };
    case "LOGOUT":
      return {
        ...state,
        logged: false,
      };
  }
  return state;
};
export const TimingReducer = (state = {current_date: null, data:null}, action: any) => {
  switch (action.type) {
    case "LOAD_DATA":
      return {
        ...state,
        current_date: action.payload.current_date,
        data:action.payload.data
      };
  }
  return state;
};
export const SettingsReducer = (state = {userPosition: null}, action: any) => {
  switch (action.type) {
    case "USER_POSITION":
      return {
        ...state,
        userPosition:action.payload
      };
  }
  return state;
};

