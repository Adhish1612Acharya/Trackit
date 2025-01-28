
import { SignUpValueObj, ValueObj } from "@/store/SharedTypes/sharedTypes";
import { RootState } from "@/store/store";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";

export interface LoginFormDialogProps {
  owner: boolean;

  loginLoad: boolean;
  dispatch: ThunkDispatch<RootState, undefined, Action>;
  signUpPage: boolean;
  handleLogin: (value: ValueObj | SignUpValueObj) => void;
  googleLoginLoad: boolean;
}
