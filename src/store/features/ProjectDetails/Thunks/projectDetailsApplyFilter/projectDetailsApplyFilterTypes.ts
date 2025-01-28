import { ExpenseType } from "@/store/SharedTypes/sharedTypes";

export interface FilterData {
  filteredExpense: ExpenseType[] | [];
  total: number;
}

export interface ArgsType {
  filterValue: {
    paidToId: string;
    paymentModeId: string;
    date: string;
  };

  projectId: string;
}
