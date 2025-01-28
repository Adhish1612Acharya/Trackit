import { FormValueType } from "@/store/features/DailyExpense/Thunks/addDailyExpense/addDailyExpenseTypes";
import { AllProjectContributerType } from "@/store/features/EditDeleteExpense/Thunks/getExpenseDetails/getExpenseDetailsTypes";

export interface GetUserDailyExpenseResponse {
  userData: any; // Replace `any` with the proper type of your user data if known
  dailyExpense: FormValueType[] | []; // Replace `any` with the correct type for expense data
  total: number;
  userAllMiscContributers: AllProjectContributerType[];
}
