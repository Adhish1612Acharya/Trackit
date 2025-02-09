import { RootState } from "@/store/store";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { NavigateFunction } from "react-router-dom";

export interface ProjectInfoProps {
  title: string;
  description: string;
  budget: number;
  id: string;
  expenseTotal: number;
  navigate: NavigateFunction;
  dispatch: ThunkDispatch<RootState, undefined, Action>;
}
