import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import homeReducer from "./features/Home/HomeSlice";
import securedRouteReducer from "./features/securedRoutes/SecureRouteSlice";
import dailyExpenseReducer from "./features/DailyExpense/DailyExpenseSlice";
import projectListDetailsReducer from "./features/GetProjects/GetProjectsSlice";
import getProjectExpenseReducer from "./features/ProjectDetails/ProjectDetailsSlice";
import editAndDeleteExpenseReducer from "./features/EditDeleteExpense/EditDeleteExpenseSlice";

export const store = configureStore({
  reducer: {
    home: homeReducer,
    securedRoute: securedRouteReducer,
    addDailyExpense: dailyExpenseReducer,
    getProjectDetails: projectListDetailsReducer,
    getProjectExpense: getProjectExpenseReducer,
    editDeleteExpense: editAndDeleteExpenseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
