import { ExpenseType } from "@/store/SharedTypes/sharedTypes";
import { RootState } from "@/store/store";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";

export interface DataTableProps {
  expense: [] | ExpenseType[];
  dispatch: ThunkDispatch<RootState, undefined, Action>;
  projectExpense: boolean;
  totalExpense: number;
  dailyExpense: boolean;
  projectName?: string;
  dataTableLoader: boolean;
  filterAppliedCount: number;
}
