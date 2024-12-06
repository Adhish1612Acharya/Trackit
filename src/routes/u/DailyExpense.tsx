// DailyExpense.js
import { useEffect } from "react";
import DataTable from "@/components/DataTable/DataTable";
import { Fab, Container } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  getUserDailyExpense,
  setOpenAddExpenseDrawer,
} from "@/store/features/DailyExpense";
import AddExpenseDrawer from "@/components/AddExpenseDrawer/AddExpenseDrawer";
import FilterDrawer from "@/components/FilterDrawer";
import { useLogin } from "@/Context/LoginProviderContext";

const DailyExpense = () => {
  const dispatch = useAppDispatch();
  const { setIsLoggedIn } = useLogin();
  const openAddExpenseDrawer = useAppSelector(
    (state) => state.addDailyExpense.openAddExpenseDrawer
  );
  const openAddProjectDrawer = useAppSelector(
    (state) => state.addDailyExpense.openAddProjectDrawer
  );

  const projectOptions = useAppSelector(
    (state) => state.addDailyExpense.projectsOptions
  );

  const dailyExpense = useAppSelector((state) => state.addDailyExpense.expense);

  const filterDrawerOpen = useAppSelector(
    (state) => state.addDailyExpense.openFilterDrawer
  );

  const filterProjectOptions = useAppSelector(
    (state) => state.addDailyExpense.filterProjects
  );

  // const submit = useAppSelector(
  //   (state) => state.addDailyExpense.submitAddDailyExpense
  // );

  useEffect(() => {
    dispatch(getUserDailyExpense());
 
  }, [dispatch, setIsLoggedIn]);

  return (
    <Container className="max-w-full">
      <DataTable
        expense={dailyExpense}
        dispatch={dispatch}
        projectExpense={false}
      />

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1,
        }}
        onClick={() => dispatch(setOpenAddExpenseDrawer(true))}
      >
        <AddIcon />
      </Fab>
      <AddExpenseDrawer
        openDrawer={openAddExpenseDrawer}
        openAddProjectDrawer={openAddProjectDrawer}
        dispatch={dispatch}
        projectOptions={projectOptions}
        // submit={submit}
      />
      <FilterDrawer
        open={filterDrawerOpen}
        projectOptions={filterProjectOptions}
        dispatch={dispatch}
        projectExpense={false}
        projectId={""}
      />
    </Container>
  );
};

export default DailyExpense;
