import { RootState } from "@/store/store";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";

export interface AddProjectDrawerProps {
    open: boolean;
    dispatch: ThunkDispatch<RootState, undefined, Action>;
    addProjectBtnLoad: boolean;
    isDailyExpensePage: boolean;
  }