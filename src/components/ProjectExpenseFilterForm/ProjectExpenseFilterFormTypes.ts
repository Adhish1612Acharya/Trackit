import { RootState } from "@/store/store";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";

export interface filterFormProps {
  dispatch: ThunkDispatch<RootState, undefined, Action>;
  projectId: string;
}