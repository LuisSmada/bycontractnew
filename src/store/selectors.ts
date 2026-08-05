import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { TRootState } from "./store";

const selectSelf = (state: TRootState) => state;

export const currentUserSelector = createDraftSafeSelector(
  selectSelf,
  (state) => state.appliState.currentUser,
);
