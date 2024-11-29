import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: {
      isLoggedIn: false,
      role: "", // Default value for role (empty or you can set as 'guest' or similar)
    },
  },
  reducers: {
    userLogin(state, action) {
      state.userInfo.isLoggedIn = true;
      state.userInfo.role = action.payload.role; // Assuming role is passed in the action payload
    },
    userLogout(state) {
      state.userInfo.isLoggedIn = false;
      state.userInfo.role = ""; // Reset role on logout
    },
    setUserRole(state, action) {
      state.userInfo.role = action.payload.role; // You can update the role directly if needed
    },
  },
});

export const userActions = userSlice.actions;
