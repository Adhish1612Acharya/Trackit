import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialStateType } from "./SecureRouteTypes";

const initialState: initialStateType = {
  loggedIn: null,
};

const secureRouteSlice = createSlice({
  name: "secureRoute",
  initialState,
  reducers: {
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload;
    },
  },
});

export default secureRouteSlice.reducer;
export const { setLoggedIn } = secureRouteSlice.actions;
