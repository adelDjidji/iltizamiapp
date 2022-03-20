import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from "redux-persist";
import { createStore, combineReducers, applyMiddleware } from "redux";
import {
  authReducer,
  TimingReducer,
  SettingsReducer,
  StatsReducer,
} from "./reducers";
import ReduxThunk from "redux-thunk";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  // whitelist: []
};
const persisted = (reducer: any) => {
  return persistReducer(persistConfig, reducer);
};
const appReducer = combineReducers({
  auth: persisted(authReducer),
  prayer: persisted(TimingReducer),
  settings: persisted(SettingsReducer),
  stats: persisted(StatsReducer),
});

interface IAction {
  type:string,
  payload?:any
}
const rootReducer = (state:any, action:IAction) => {
  if (action.type === 'LOGOUT') {
    return appReducer(undefined, action)
  }
  return appReducer(state, action)
}
export type RootState = ReturnType<typeof rootReducer>;

export const store = createStore(rootReducer, applyMiddleware(ReduxThunk));
export const persistor = persistStore(store);
