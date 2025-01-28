import { ExpenseType } from "@/store/SharedTypes/sharedTypes";
import { RootState } from "@/store/store";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";

export interface ExpenseAccordianProps {
  index: number;
  toggleAccordion: (index: number) => void;
  openIndex: number | null;
  eachExpense: ExpenseType;
  projectExpense: boolean;
  dispatch: ThunkDispatch<RootState, undefined, Action>;
}
