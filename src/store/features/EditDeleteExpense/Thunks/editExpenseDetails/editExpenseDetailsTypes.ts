import { ExpenseType } from "@/store/SharedTypes/sharedTypes";

export interface EditExpenseDetailsResponseType {
    editedExpense: ExpenseType;
  }
  
  export interface EditedFormValueType {
    date: Date | string;
    amount: number;
    reason: string;
    projectId: string;
    paidToId: string;
    paymentModeId: string;
    miscellaneousPaidToRole: string;
    miscellaneuosPaidToId: string;
    miscellaneuosPaidToName: string;
    billImage: Promise<string> | string;
  }


  export interface Contributer {
    id: string;
    miscellaneous: boolean;
    miscellaneousId: string;
    miscellaneousRole: string;
    name: string;
  }