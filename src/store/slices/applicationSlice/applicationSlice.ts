import { IApplicationState, IUser } from "@/src/model/entities";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: IApplicationState = {
  currentUser: {
    id: "1",
    firstName: "root",
    lastName: "root",
  },
  language: "fr",
  activeTab: {
    path: "/fr/login",
    title: "LoginPage",
  },
  currentPath: "/",
};

export const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    setCurrentPath: (state, action: PayloadAction<string>) => {
      state.currentPath = action.payload;
    },
    setCurrentUser: (state, action: PayloadAction<IUser>) => {
      state.currentUser = action.payload;
    },
  },
});

export const { setCurrentPath, setCurrentUser } = applicationSlice.actions;
export default applicationSlice.reducer;
