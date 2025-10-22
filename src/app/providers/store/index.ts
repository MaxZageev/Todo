import { configureStore } from "@reduxjs/toolkit";

import authMiddleware from "@/app/providers/store/authMiddleware";
import rootReducer from "@/app/providers/store/rootReducer";
import { setAccessToken } from "@/shared/api/httpClient";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(authMiddleware)
});

setAccessToken(store.getState().auth.token);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
