import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { combineSlices, configureStore } from "@reduxjs/toolkit";
import type { Persistor } from "redux-persist";
import { persistReducer, persistStore } from "redux-persist";
import createWebStorage from "redux-persist/es/storage/createWebStorage";
import categoryReducer from "../features/category/category.slice";
import salonReducer from "../features/salon/salon.slice";
import authReducer from "../features/auth/auth.slice";
import cartReducer from "../features/salon/cart/cart.slice";
import bookingReducer from "../features/salon/bookings/booking.slice";
import customerBookingReducer from "../features/customer-booking/customer-booking.slice";

const storage = createWebStorage("local");

const rootReducer = combineSlices({
  auth: authReducer,
  category: categoryReducer,
  salon: salonReducer,
  cart: cartReducer,
  booking: bookingReducer,
  customerBooking: customerBookingReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export const store = makeStore();
export const persistor: Persistor = persistStore(store);

export type AppStore = ReturnType<typeof makeStore>;

export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<ThunkReturnType, RootState, unknown, Action>;
