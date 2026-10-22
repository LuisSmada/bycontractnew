import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { applicationSlice } from "./slices/applicationSlice/applicationSlice";
import { entitiesSlice } from "./slices/entitiesSlice/entitiesSlice";
import { apiSlice } from "./api/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";

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

//Every night the backend updates the contracts status, this is a listener
//which will refetch the data at tab changes
setupListeners(makeStore().dispatch);

export type PreloadedState = Parameters<typeof rootReducer>[0];
// Infer the type of makeStore
export type TAppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type TRootState = ReturnType<TAppStore["getState"]>;
export type TAppDispatch = TAppStore["dispatch"];
