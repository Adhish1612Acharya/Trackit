import { ExpenseType } from "@/store/SharedTypes/sharedTypes";

export interface FilterData {
  filteredExpense: ExpenseType[] | [];
  total: number;
}

export interface FilterValueType {
  paidToId: string;
  paymentModeId: string;
  projectId: string;
}
