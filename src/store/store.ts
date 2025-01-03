import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import homeReducer from "./features/Home/Home";
import securedRouteReducer from "./features/securedRoutes/SecureRoute";
import dailyExpenseReducer from "./features/DailyExpense";
import projectListDetailsReducer from "./features/GetProjects";
import getProjectExpenseReducer from "./features/ProjectDetails";
import editAndDeleteExpenseReducer from "./features/EditDeleteExpense";

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
