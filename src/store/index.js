import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { 
  FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE
} from "redux-persist";
import notificationsSlice from '../store/slices/NotificationsSlice.js'
import storage from "redux-persist/lib/storage";
import authSlice from "./slices/auth";
import doctorsSlice from "./slices/doctorSlice.js";
import PrescriptionSlice from "./slices/PrescriptionSlice.js";

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  notifications: notificationsSlice.reducer,
  doctors: doctorsSlice,
  prescriptions: PrescriptionSlice,
});

const persistedReducer = persistReducer(
  {
    key: "root",
    version: 1,
    storage: storage
  },
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    }
  })
});

export const persistor = persistStore(store);

export default store;