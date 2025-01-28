import { ExpenseType, ProjectOptionsType  } from "@/store/SharedTypes/sharedTypes";
import { RootState } from "@/store/store";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";

export interface EditDialogProps {
  editDialogOpen: boolean;
  dispatch: ThunkDispatch<RootState, undefined, Action>;
  expense: ExpenseType;
  editExpenseCurrentProject: { id: string; name: string };
  projectOptions: ProjectOptionsType[];
  editInfoLoad: boolean;
  editFuncLoading: boolean;
  miscellaneousInput:boolean;
  isDailyExpense:boolean;
  isProjectPage:boolean;
}
