import { ExpenseType, ProjectOptionsType } from "@/store/SharedTypes/sharedTypes";
import { AllProjectContributerType } from "../EditDeleteExpense/Thunks/getExpenseDetails/getExpenseDetailsTypes";


export interface DailyExpenseInitialStateType {
  projectsOptions: ProjectOptionsType[];
  expense: ExpenseType[];
  openAddProjectDrawer: boolean;
  pageLoading: boolean;
  openAddExpenseDrawer: boolean;
  miscellaneousInput: boolean;
  openFilterDrawer: boolean;
  filterProjects: ProjectOptionsType[];
  addExpenseBtnLoad: boolean;
  addProjectBtnLoad: boolean;
  addFilterBtnLoad: boolean;
  dataTableLoader: boolean;
  totalValue: number;
  userAllMiscContributers: AllProjectContributerType[];
}

export interface AddedExpnseType {
  date: Date;
  amount: number;
  reason: string;
  paidToId: string | number;
  paidToName: string;
  paymentModeId: string | number;
  paymentModeName: string;
  projectId: string | number;
  projectTitle: string;
  miscellaneous: boolean;
  miscellaneuosPaidToId: string;
  miscellaneuosPaidToName: string;
  miscellaneousPaidToRole: string;
  owner: string;
  billImage: Promise<string> | string;
}
