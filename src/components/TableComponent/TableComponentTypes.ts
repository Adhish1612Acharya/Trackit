import { ExpenseType } from "@/store/SharedTypes/sharedTypes";
import { RootState } from "@/store/store";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";

export interface TableComponentProps {
  expense: ExpenseType[] | [];
  projectExpense: boolean;
  dispatch: ThunkDispatch<RootState, undefined, Action>;
  dataTableLoader: boolean;
}
