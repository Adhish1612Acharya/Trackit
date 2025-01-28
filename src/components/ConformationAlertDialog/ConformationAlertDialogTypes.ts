import { RootState } from "@/store/store";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";

export interface conformationAlertDialogType {
  openAlertDialog: boolean;
  dispatch: ThunkDispatch<RootState, undefined, Action>;
  expenseId: string;
  deleteFuncLoad: boolean;
  dailyExpensePage: boolean;
  isDeleteProject?:boolean;
}