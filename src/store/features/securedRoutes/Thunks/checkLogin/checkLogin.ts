import { auth } from "@/firebaseconfig";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setLoggedIn } from "../../SecureRouteSlice";

const checkLogin = createAsyncThunk(
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

  export  default checkLogin;