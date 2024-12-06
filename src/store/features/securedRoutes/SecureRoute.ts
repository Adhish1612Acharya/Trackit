import { auth, db } from "@/firebaseconfig";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";

interface initialStateType {
  loggedIn: boolean | null;
  roleIsOwner: boolean | null;
}

const initialState: initialStateType = {
  loggedIn: null,
  roleIsOwner: null,
};

export const checkLogin = createAsyncThunk(
  "/checkLogin",
  async (_value, thunkAPI) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const querySnap = await getDoc(docRef);
        if (!querySnap.exists()) {
          thunkAPI.dispatch(setIsOwner(false));
          toast.error("Access Denied");
        } else {

          thunkAPI.dispatch(setLoggedIn(true));
        }
      } else {
        // toast.error("You need to Login");
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
    setIsOwner: (state, action: PayloadAction<boolean>) => {
      state.roleIsOwner = action.payload;
    },
  },
});

export default secureRouteSlice.reducer;
export const { setLoggedIn, setIsOwner } = secureRouteSlice.actions;
