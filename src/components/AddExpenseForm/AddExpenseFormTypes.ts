import {
  ExpenseType,
  ProjectOptionsType,
} from "@/store/SharedTypes/sharedTypes";
import { RootState } from "@/store/store";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";

export interface addExpenseFormProps {
  dispatch: ThunkDispatch<RootState, undefined, Action>;
  projectOptions: ProjectOptionsType[];
  editForm?: boolean;
  expense?: ExpenseType;
  editExpenseCurrentProject?: { id: string; name: string };
  loading: boolean;
  miscellaneousInput: boolean;
  isDailyExpense: boolean;
  isProjectPage: boolean;
}
