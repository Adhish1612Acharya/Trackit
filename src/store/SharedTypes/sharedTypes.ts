export interface ExpenseType {
  expenseId: string;
  date: string | Date;
  amount: number;
  paidToId: string;
  paidToName: string;
  paymentModeId: string;
  paymentModeName: string;
  projectId: string;
  projectTitle: string;
  reason: string;
  miscellaneous: boolean;
  miscellaneousPaidToRole: string;
  miscellaneuosPaidToId: string;
  miscellaneuosPaidToName: string;
  billImage: string;
  owner: string;
}

export interface ProjectOptionsType {
  id: string;
  name: string;
}

export interface ValueObj {
  email: string;
  password: string;
}

export interface SignUpValueObj {
  username: string;
  email: string;
  contactNo: number;
  password: string;
}
