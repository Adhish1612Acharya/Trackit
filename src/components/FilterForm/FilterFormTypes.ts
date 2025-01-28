import { ProjectOptionsType } from "@/store/SharedTypes/sharedTypes";
import { RootState } from "@/store/store";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";

export interface filterFormProps {
    dispatch: ThunkDispatch<RootState, undefined, Action>;
    projectOptions: ProjectOptionsType[];
  }
  