import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import getExpenseDetails from "./Thunks/getExpenseDetails/getExpenseDetails";
import editExpenseDetails from "./Thunks/editExpenseDetails/editExpenseDetails";
import { deleteExpenseDetails } from "./Thunks/deleteExpenseDetails/deleteExpenseDetails";
import { EditDeleteExpenseInitialStateType } from "./EditDeleteExpenseSliceTypes";

const initialState: EditDeleteExpenseInitialStateType = {
  editDrawerOpen: false,
  editInfoLoad: true,
  editFuncLoad: false,
  expenseInfo: {
    expenseId: "",
    date: "",
    amount: -1,
    paidToId: "",
    paidToName: "",
    paymentModeId: "",
    paymentModeName: "",
    projectId: "",
    projectTitle: "",
    reason: "",
    miscellaneous: false,
    miscellaneousPaidToRole: "",
    miscellaneuosPaidToId: "",
    miscellaneuosPaidToName: "",
    billImage: "",
    owner: "",
  },
  expenseId: "",
  dailyExpense: false,
  deleteFuncLoad: false,
  deleteConformationDrawerOpen: false,
  miscellaneuosInput: false,
  currrentProject: { id: "", name: "" },
  editProjectOptions: [],
  allProjectMiscContributer: [],
};


const editDeleteExpenseSlice = createSlice({
  name: "editAndDeleteExpense",
  initialState,
  reducers: {
    setEditDrawerOpen: (
      state,
      action: PayloadAction<{
        id: string;
        open: boolean;
        dailyExpenseOrNot: boolean;
      }>
    ) => {
      if (action.payload.open === false) {
        state.allProjectMiscContributer = [];
      }
      state.editDrawerOpen = action.payload.open;
      state.expenseId = action.payload.id;
      state.dailyExpense = action.payload.dailyExpenseOrNot;
    },
    setDeleteConformationDrawerOpen: (
      state,
      action: PayloadAction<{ open: boolean; expenseId: string }>
    ) => {
      state.expenseId = action.payload.expenseId;
      state.deleteConformationDrawerOpen = action.payload.open;
    },
    setEditExpenseMiscellaneousInput: (state, action) => {
      state.miscellaneuosInput = action.payload;
    },
    setEditFuncLoad: (state, action: PayloadAction<boolean>) => {
      state.editFuncLoad = action.payload;
    },
    setExpenseBillImage: (state, action: PayloadAction<string>) => {
      state.expenseInfo.billImage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getExpenseDetails.pending, (state, _action) => {
      state.editInfoLoad = true;
    });

    builder.addCase(getExpenseDetails.fulfilled, (state, action) => {
      state.allProjectMiscContributer =
        action.payload.userAllProjectMiscContributers;
      state.miscellaneuosInput = action.payload.expenseDetails.miscellaneous;
      state.currrentProject = action.payload.projectOptions.filter(
        (p) => p.id === action.payload.expenseDetails.projectId
      )[0];
      state.editProjectOptions = action.payload.projectOptions;
      state.editInfoLoad = false;
      state.expenseInfo = action.payload.expenseDetails;
    });

    builder.addCase(getExpenseDetails.rejected, (state, action) => {
      state.editInfoLoad = false;
      toast.error(action.payload);
    });

    builder.addCase(editExpenseDetails.pending, (state, _action) => {
      state.editFuncLoad = true;
    });

    builder.addCase(editExpenseDetails.fulfilled, (state, action) => {
      state.expenseInfo = action.payload.editedExpense;
      state.allProjectMiscContributer = [];
      toast.success("Expense Edited successfully");
    });

    builder.addCase(editExpenseDetails.rejected, (state, action) => {
      toast.error(action.payload);
      state.editFuncLoad = false;
      state.editDrawerOpen = true;
    });

    builder.addCase(deleteExpenseDetails.pending, (state, _action) => {
      state.deleteFuncLoad = true;
    });

    builder.addCase(deleteExpenseDetails.fulfilled, (state, _action) => {
      toast.success("Expense Deleted");
      state.deleteFuncLoad = false;
      state.expenseId = "";
      state.deleteConformationDrawerOpen = false;
    });

    builder.addCase(deleteExpenseDetails.rejected, (state, action) => {
      state.deleteFuncLoad = false;
      state.deleteConformationDrawerOpen = false;
      toast.error(action.payload);
    });
  },
});

export default editDeleteExpenseSlice.reducer;

export const {
  setEditDrawerOpen,
  setDeleteConformationDrawerOpen,
  setEditExpenseMiscellaneousInput,
  setEditFuncLoad,
  setExpenseBillImage,
} = editDeleteExpenseSlice.actions;
