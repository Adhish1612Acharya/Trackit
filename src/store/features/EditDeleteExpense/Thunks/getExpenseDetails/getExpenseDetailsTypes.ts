import { ExpenseType } from "@/store/SharedTypes/sharedTypes";

export interface AllProjectContributerType {
    id: string;
    miscellaneous: boolean;
    miscellaneousId: string;
    miscellaneousRole: string;
    name: string;
  }

export interface GetExpenseDetailsResponseType {
  expenseDetails: ExpenseType;
  projectOptions: { id: string; name: string }[];
  userAllProjectMiscContributers: AllProjectContributerType[];
}

