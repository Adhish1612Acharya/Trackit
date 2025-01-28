import { ProjectOptionsType } from "@/store/SharedTypes/sharedTypes";
import { RootState } from "@/store/store";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";

export interface filterDrawerOpenProps {
  open: boolean;
  dispatch: ThunkDispatch<RootState, undefined, Action>;
  projectOptions: ProjectOptionsType[];
  projectExpense: boolean;
  projectId: string;
}
