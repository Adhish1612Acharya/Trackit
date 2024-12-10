import { auth } from "@/firebaseconfig";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initialStateType {
  loggedIn: boolean | null;
}

const initialState: initialStateType = {
  loggedIn: null,
};

export const checkLogin = createAsyncThunk(
  "/checkLogin",
  async (_value, thunkAPI) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        thunkAPI.dispatch(setLoggedIn(true));
      } else {
        thunkAPI.dispatch(setLoggedIn(false));
      }
    });
  }
);

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
