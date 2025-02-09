import getUserProjectExpense from "@/store/features/ProjectDetails/Thunks/getUserProjectExpense/getUserProjectExpense";
import projectDetailsApplyFilter from "@/store/features/ProjectDetails/Thunks/projectDetailsApplyFilter/projectDetailsApplyFilter";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";

const getFilterExpense = (
  getFilterItem: (key: string) => string[],
  dispatch: ThunkDispatch<any, any, Action>,
  id: string | undefined
) => {
  const filterArray = getFilterItem("projectPageFilter");

  if (
    filterArray[0] === "" &&
    filterArray[1] === "-1" &&
    filterArray[2] === "-1"
  ) {
    dispatch(getUserProjectExpense(id as string));
  } else {
    const value = {
      filterValue: {
        date: filterArray[0],
        paidToId: filterArray[1],
        paymentModeId: filterArray[2],
      },
      projectId: id || "",
    };
    dispatch(projectDetailsApplyFilter(value));
  }
};

export default getFilterExpense;
