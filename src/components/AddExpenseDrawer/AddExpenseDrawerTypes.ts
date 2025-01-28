import { ProjectOptionsType } from "@/store/SharedTypes/sharedTypes";
import { RootState } from "@/store/store";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";

export interface addExpenseDrawerProps {
  dispatch: ThunkDispatch<RootState, undefined, Action>;
  openDrawer: boolean;
  projectOptions: ProjectOptionsType[];
  loading: boolean;
  miscellaneousInput: boolean;
  isDailyExpense:boolean,
  isProjectPage:boolean
}