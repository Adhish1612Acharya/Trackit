import { RootState } from "@/store/store";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { NavigateFunction } from "react-router-dom";

export interface addProjectFormProps {
    dispatch: ThunkDispatch<RootState, undefined, Action>;
    addProjectBtnLoad:boolean;
    isDailyExpensePage:boolean;
    isAddProjectPage?:boolean;
    navigate?:NavigateFunction
  }