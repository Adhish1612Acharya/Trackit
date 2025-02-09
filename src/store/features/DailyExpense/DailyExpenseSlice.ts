import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import getUserDailyExpense from "./Thunks/getUserDailyExpense/getUserDailyExpense";
import addDailyExpense from "./Thunks/addDailyExpense/addDailyExpense";
import { addProject } from "./Thunks/addProject/addProject";
import applyFilter from "./Thunks/applyFilter/applyFilter";
import { DailyExpenseInitialStateType } from "./DailyExpenseSliceTypes";
import {
  ExpenseType,
  ProjectOptionsType,
} from "@/store/SharedTypes/sharedTypes";

const initialState: DailyExpenseInitialStateType = {
  projectsOptions: [],
  filterProjects: [],
  openAddExpenseDrawer: false,
  openAddProjectDrawer: false,
  pageLoading: true,
  expense: [],
  miscellaneousInput: false,
  openFilterDrawer: false,
  addExpenseBtnLoad: false,
  addProjectBtnLoad: false,
  addFilterBtnLoad: false,
  dataTableLoader: false,
  totalValue: 0,
  filterInitialState: [],
  filterAppliedCount: 0,
  // userAllMiscContributers: [],
};

const dailyExpenseSlice = createSlice({
  name: "dailyExpense",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      const argu = action.payload
        .filterName as keyof DailyExpenseInitialStateType;
      (state[argu] as any) = action.payload.filterValue;
    },
    setOpenAddProjectDrawer: (state, action) => {
      state.openAddProjectDrawer = action.payload;
    },
    setOpenAddExpenseDrawer: (state, action) => {
      state.openAddExpenseDrawer = action.payload;
    },

    addProjectOptions: (state, action) => {
      state.projectsOptions.push(action.payload);
    },
    initializeProjectOptions: (state, action) => {
      state.projectsOptions = action.payload;
    },

    setMiscellaneousInput: (state, action) => {
      state.miscellaneousInput = action.payload;
    },
    setOpenFilterDrawer: (state, action) => {
      state.openFilterDrawer = action.payload;
    },
    setEditedExpenseInfo: (state, action: PayloadAction<ExpenseType>) => {
      state.expense = state.expense.map((eachExpense) => {
        return eachExpense.expenseId === action.payload.expenseId
          ? { ...eachExpense, ...action.payload }
          : eachExpense;
      });
    },
    setDeletedExpenseInfo: (state, action: PayloadAction<string>) => {
      state.expense = state.expense.filter((eachExpense) => {
        return eachExpense.expenseId !== action.payload;
      });

      state.totalValue = state.expense.reduce(
        (accum, eachExpense) => accum + Number(eachExpense.amount),
        0
      );
    },
    setAddExpenseLoad: (state, action: PayloadAction<boolean>) => {
      state.addExpenseBtnLoad = action.payload;
    },
    setFilteredInitialState: (state, action: PayloadAction<string[]>) => {
      state.filterInitialState = action.payload;
      let count = 0;
      action.payload.forEach((eachFilter) => {
        if (
          eachFilter !== "" &&
          eachFilter !== "-1" &&
          eachFilter !== "undefined" &&
          eachFilter !== "null"
        ) {
          count++;
        }
      });
      state.filterAppliedCount = count;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserDailyExpense.pending, (state, _action) => {
      state.pageLoading = true;
      state.dataTableLoader = true;
    });

    builder.addCase(getUserDailyExpense.fulfilled, (state, action) => {
      state.pageLoading = false;
      state.expense = action.payload.dailyExpense as ExpenseType[] | [];
      state.totalValue = Number(action.payload.total);
      state.projectsOptions = action.payload.userData.projects;
      state.filterProjects = [...action.payload.userData.projects];
      // state.filterProjects.push({ id: "-1", name: "All" });
      // state.userAllMiscContributers = action.payload.miscContributers;
      state.dataTableLoader = false;
    });

    builder.addCase(getUserDailyExpense.rejected, (state, _action) => {
      state.pageLoading = false;
      toast.warn("Some Error occurred please try again"); // Add a toast notification
    });

    builder.addCase(addDailyExpense.pending, (state, _action) => {
      state.addExpenseBtnLoad = true;
    });

    builder.addCase(addDailyExpense.fulfilled, (state, action) => {
      toast.success("Expense Added");
      state.addExpenseBtnLoad = false;

      if (action.payload.todayExpense !== null) {
        state.expense.unshift(action.payload.todayExpense);
        state.totalValue += action.payload.todayExpense.amount;
      }

      // if (action.payload.newMiscContri !== null) {
      //   if (window.location.pathname === "/u/daily-expense") {
      //     state.userAllMiscContributers.push(action.payload.newMiscContri);
      //   }
      // }
    });

    builder.addCase(addDailyExpense.rejected, (state, action) => {
      toast.warn(action.payload);
      state.addExpenseBtnLoad = false;
    });

    builder.addCase(addProject.pending, (state, _action) => {
      state.addProjectBtnLoad = true;
    });

    builder.addCase(addProject.fulfilled, (state, action) => {
      toast.success("Project Added");
      const allOption = state.filterProjects.pop();
      state.filterProjects.push(action.payload.newProject);
      state.filterProjects.push(allOption as ProjectOptionsType);
      state.addProjectBtnLoad = false;
      state.openAddProjectDrawer = false;
    });

    builder.addCase(addProject.rejected, (state, action) => {
      toast.success(action.payload);
      state.addProjectBtnLoad = false;
      window.location.href = "/";
    });

    builder.addCase(applyFilter.pending, (state, _action) => {
      state.dataTableLoader = true;
      state.addFilterBtnLoad = true;
    });

    builder.addCase(applyFilter.fulfilled, (state, action) => {
      state.expense = action.payload.filteredExpense;
      state.totalValue = action.payload.total;
      state.dataTableLoader = false;
      state.addFilterBtnLoad = false;
      state.openFilterDrawer = false;
    });

    builder.addCase(applyFilter.rejected, (state, _action) => {
      state.dataTableLoader = false;
      state.addFilterBtnLoad = false;
      state.openFilterDrawer = false;
      toast.error("Some Error Occured");
    });
  },
});

export default dailyExpenseSlice.reducer;

export const {
  setFilters,
  setOpenAddProjectDrawer,
  setOpenAddExpenseDrawer,
  addProjectOptions,
  initializeProjectOptions,
  setMiscellaneousInput,
  setOpenFilterDrawer,
  setEditedExpenseInfo,
  setDeletedExpenseInfo,
  setAddExpenseLoad,
  setFilteredInitialState
} = dailyExpenseSlice.actions;
