// import { AllProjectContributerType } from "@/store/features/EditDeleteExpense/Thunks/getExpenseDetails/getExpenseDetailsTypes";
import { ExpenseType } from "@/store/SharedTypes/sharedTypes";

export interface GetUserDailyExpenseResponse {
  userData: any; // Replace `any` with the proper type of your user data if known
  dailyExpense: ExpenseType[] | []; // Replace `any` with the correct type for expense data
  total: number;
  // miscContributers: AllProjectContributerType[];
}
