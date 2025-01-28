import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import signUp from "./Thunks/signUp/signUp";
import login from "./Thunks/login/login";
import { googleLogin } from "./Thunks/googleLogin/googleLogin";
import { HomeSliceTypesInitialStateType } from "./HomeSliceTypes";

const initialState: HomeSliceTypesInitialStateType = {
  loginLoad: false,
  loggedIn: undefined,
  googleLoginLoad: false,
};

export const LoginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login

    builder.addCase(login.pending, (state, _action) => {
      state.loginLoad = true;
    });

    builder.addCase(login.fulfilled, (state, _action) => {
      state.loginLoad = false;
      state.loggedIn = true;
      toast.success("Success Login");
    });

    builder.addCase(login.rejected, (state, _action) => {
      state.loginLoad = false;
      toast.error("Either username or password is not correct ");
    });

    //SignUp

    builder.addCase(signUp.pending, (state, _action) => {
      state.loginLoad = true;
    });

    builder.addCase(signUp.fulfilled, (state, _action) => {
      state.loginLoad = false;
      state.loggedIn = true;
      toast.success("Email or username  is already taken");
    });

    builder.addCase(signUp.rejected, (state, _action) => {
      state.loginLoad = false;
      state.loggedIn = false;
      toast.error("Some error occurred please try again");
    });

    //googleLogin

    builder.addCase(googleLogin.pending, (state, _action) => {
      state.googleLoginLoad = true;
    });

    builder.addCase(googleLogin.fulfilled, (state, _action) => {
      state.googleLoginLoad = false;
      toast.success("Success Login");
      state.loggedIn = true;
    });

    builder.addCase(googleLogin.rejected, (state, _action) => {
      state.googleLoginLoad = false;
      toast.error("Either username or email is not correct");
    });
  },
});

export default LoginSlice.reducer;
export const { setLoggedIn } = LoginSlice.actions;
