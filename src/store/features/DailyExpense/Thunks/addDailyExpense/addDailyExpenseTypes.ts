import { ExpenseType } from "@/store/SharedTypes/sharedTypes";
import { AddedExpnseType } from "../../DailyExpenseSliceTypes";
// import { ContributersType } from "@/store/features/GetProjects/Thunks/getProjectDetails/getProjectDetailsTypes";

export interface AddDailyExpenseResponse {
  expenseId: string;
  todayExpense: ExpenseType | null;
  newAddedExpense: AddedExpnseType;
  // newMiscContri: ContributersType | null;
}

export interface FormValueType {
  date: Date | string;
  amount: number | string;
  reason: string;
  paidTo: string;
  paymentMode: string;
  project: string;
  miscellaneousPaidToName: string;
  miscellaneousPaidToRole: string;
  billImage: Promise<string> | string;
}
