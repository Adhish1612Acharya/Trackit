import { ExpenseType } from "@/store/SharedTypes/sharedTypes";
import { AddedExpnseType} from "../../DailyExpenseSliceTypes";


export interface AddDailyExpenseResponse {
  expenseId: string;
  todayExpense: ExpenseType | null;
  newAddedExpense: AddedExpnseType;
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
