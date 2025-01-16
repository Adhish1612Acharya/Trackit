import { RootState } from "@/store/store";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { NavigateFunction } from "react-router-dom";

export interface AddProjectFormCardTypes {
  addProjectBtnLoad: boolean;
  dispatch: ThunkDispatch<RootState, undefined, Action>;
  navigate:NavigateFunction;
}
