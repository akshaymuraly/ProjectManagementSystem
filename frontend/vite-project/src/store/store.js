import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./index";
export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});
