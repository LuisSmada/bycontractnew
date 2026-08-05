import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { applicationSlice } from "./slices/applicationSlice/applicationSlice";
import { entitiesSlice } from "./slices/entitiesSlice/entitiesSlice";
import { apiSlice } from "./api/apiSlice";

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  appliState: applicationSlice.reducer,
  entities: entitiesSlice.reducer,
});

export const makeStore = (preloadedState?: PreloadedState) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,

    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });
};

export type PreloadedState = Parameters<typeof rootReducer>[0];
// Infer the type of makeStore
export type TAppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type TRootState = ReturnType<TAppStore["getState"]>;
export type TAppDispatch = TAppStore["dispatch"];
