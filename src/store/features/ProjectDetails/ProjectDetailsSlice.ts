import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import getUserProjectExpense from "./Thunks/getUserProjectExpense/getUserProjectExpense";
import projectDetailsApplyFilter from "./Thunks/projectDetailsApplyFilter/projectDetailsApplyFilter";
import { ProjectDetailsSliceInitialStateType } from "./ProjectDetailsSliceTypes";
import { ExpenseType } from "@/store/SharedTypes/sharedTypes";

const initialState: ProjectDetailsSliceInitialStateType = {
  filterProjects: [],
  projectName: "",
  pageLoading: true,
  expense: [],
  openFilterDrawer: false,
  addFilterBtnLoad: false,
  dataTableLoader: false,
  total: 0,
  userAllMiscContributers:[]
};

const getProjectDetailsSlice = createSlice({
  name: "getProjectDetails",
  initialState,
  reducers: {
    setProjectDetailsOpenFilterDrawer: (state, action) => {
      state.openFilterDrawer = action.payload;
    },
    setProjectName: (state, action) => {
      state.projectName = action.payload;
    },
    setEditedProjectExpenseInfo: (
      state,
      action: PayloadAction<ExpenseType>
    ) => {
      state.expense = state.expense.map((eachExpense) => {
        return eachExpense.expenseId === action.payload.expenseId
          ? { ...eachExpense, ...action.payload }
          : eachExpense;
      });
    },
    setDeletedProjectExpenseInfo: (state, action: PayloadAction<string>) => {
      state.expense = state.expense.filter((eachExpense) => {
        return eachExpense.expenseId !== action.payload;
      });

      state.total = state.expense.reduce(
        (accum, eachExpense) => accum + Number(eachExpense.amount),
        0
      );
    },
    addProjectExpense: (
      state,
      action: PayloadAction<{ expense: ExpenseType }>
    ) => {
      const newExpense = action.payload.expense;

      // Convert 'day-month-year' format to a comparable string 'YYYY-MM-DD'
      const newExpenseDate = (newExpense.date as string)
        .split("-")
        .reverse()
        .join("-");

      const todayDate = new Date().toLocaleDateString("en-CA");

      if (newExpenseDate === todayDate || state.expense.length == 0) {
        state.expense.unshift(newExpense);
      } else {
        // Find the correct index to insert the new expense
        const index = state.expense.findIndex((expense) => {
          const expenseDate = (expense.date as string)
            .split("-")
            .reverse()
            .join("-");
          return newExpenseDate >expenseDate; // Insert before the first expense with a later date
        });

        if (index === -1) {
          // If no such expense exists, add it to the end
          state.expense.push(newExpense);
        } else {
          // Insert the new expense at the correct index
          state.expense.splice(index, 0, newExpense);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserProjectExpense.pending, (state, _action) => {
      state.pageLoading = true;
      state.dataTableLoader = true;
    });

    builder.addCase(getUserProjectExpense.fulfilled, (state, action) => {
      state.pageLoading = false;
      state.expense = action.payload.dailyExpense as ExpenseType[] | [];
      state.total = action.payload.total;
      state.filterProjects = [...action.payload.userData.projects];
      state.filterProjects.push({ id: "-1", name: "All" });
      state.userAllMiscContributers=action.payload.userAllMiscContributers;
      state.dataTableLoader = false;
    });

    builder.addCase(getUserProjectExpense.rejected, (state, _action) => {
      state.pageLoading = false;
      toast.warn("Some Error occurred please try again"); // Add a toast notification
    });

    builder.addCase(projectDetailsApplyFilter.pending, (state, _action) => {
      state.dataTableLoader = true;
      state.addFilterBtnLoad = true;
    });

    builder.addCase(projectDetailsApplyFilter.fulfilled, (state, action) => {
      state.expense = action.payload.filteredExpense;
      state.dataTableLoader = false;
      state.addFilterBtnLoad = false;
      state.total = action.payload.total;
      state.openFilterDrawer = false;
    });

    builder.addCase(projectDetailsApplyFilter.rejected, (state, _action) => {
      state.dataTableLoader = false;
      state.addFilterBtnLoad = false;
      state.openFilterDrawer = false;
      toast.error("Some Error Occured");
    });
  },
});

export default getProjectDetailsSlice.reducer;
export const {
  setProjectDetailsOpenFilterDrawer,
  setProjectName,
  setEditedProjectExpenseInfo,
  setDeletedProjectExpenseInfo,
  addProjectExpense,
} = getProjectDetailsSlice.actions;
