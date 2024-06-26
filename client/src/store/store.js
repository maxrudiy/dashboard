import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../api/api-slice";
import authReducer from "./auth-slice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});
