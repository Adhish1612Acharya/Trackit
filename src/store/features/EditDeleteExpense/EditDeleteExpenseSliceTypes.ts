import { ExpenseType } from "@/store/SharedTypes/sharedTypes";
import { AllProjectContributerType } from "./Thunks/getExpenseDetails/getExpenseDetailsTypes";

export interface EditDeleteExpenseInitialStateType {
    editDrawerOpen: boolean;
    editInfoLoad: boolean;
    editFuncLoad: boolean;
    expenseInfo: ExpenseType;
    expenseId: string;
    dailyExpense: boolean;
    deleteFuncLoad: boolean;
    deleteConformationDrawerOpen: boolean;
    miscellaneuosInput: boolean;
    editProjectOptions: { id: string; name: string }[];
    currrentProject: { id: string; name: string };
    allProjectMiscContributer: AllProjectContributerType[];
  }