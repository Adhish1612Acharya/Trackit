import { ExpenseType, ProjectOptionsType } from "@/store/SharedTypes/sharedTypes";
import { AllProjectContributerType } from "../EditDeleteExpense/Thunks/getExpenseDetails/getExpenseDetailsTypes";

export interface ProjectDetailsSliceInitialStateType {
  expense: ExpenseType[];
  pageLoading: boolean;
  openFilterDrawer: boolean;
  filterProjects: ProjectOptionsType[];
  addFilterBtnLoad: boolean;
  dataTableLoader: boolean;
  total: number;
  projectName: string;
  userAllMiscContributers: AllProjectContributerType[];
}
