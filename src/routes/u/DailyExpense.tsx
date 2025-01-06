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
import ConformationAlertDialog from "@/components/ConformationAlertDialog/ConformationAlertDialog";
import { setDeleteConformationDrawerOpen } from "@/store/features/EditDeleteExpense";
import EditDialog from "@/components/EditDialog/EditDialog";
import { MobileAddExpenseDialog } from "@/components/AddExpenseDrawer/MobileAddExpenseDialog";

const DailyExpense = () => {
  const dispatch = useAppDispatch();
  const { setIsLoggedIn } = useLogin();

  const dataTableLoader = useAppSelector(
    (state) => state.addDailyExpense.dataTableLoader
  );

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

  const totalValue = useAppSelector(
    (state) => state.addDailyExpense.totalValue
  );

  const openAlertDialog = useAppSelector(
    (state) => state.editDeleteExpense.deleteConformationDrawerOpen
  );

  const deleteFuncLoad = useAppSelector(
    (state) => state.editDeleteExpense.deleteFuncLoad
  );

  const expenseId = useAppSelector(
    (state) => state.editDeleteExpense.expenseId
  );

  // Edit Dialog States
  const editDialogOpen = useAppSelector(
    (state) => state.editDeleteExpense.editDrawerOpen
  );

  const expense = useAppSelector(
    (state) => state.editDeleteExpense.expenseInfo
  );

  const editExpenseCurrentProject = useAppSelector(
    (state) => state.editDeleteExpense.currrentProject
  );

  // const projectOptions = useAppSelector(
  //   (state) => state.editDeleteExpense.editProjectOptions
  // );

  const editInfoLoad = useAppSelector(
    (state) => state.editDeleteExpense.editInfoLoad
  );

  useEffect(() => {
    dispatch(getUserDailyExpense());
  }, [dispatch, setIsLoggedIn]);

  useEffect(() => {
    dispatch(setDeleteConformationDrawerOpen({ open: false, expenseId: "" }));
  }, [dispatch]);

  return (
    <Container className="max-w-full">
      <DataTable
        expense={dailyExpense}
        dispatch={dispatch}
        projectExpense={false}
        totalExpense={totalValue}
        dailyExpense={true}
        dataTableLoader={dataTableLoader}
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
      {/* <MobileAddExpenseDialog
      openDrawer={openAddExpenseDrawer}
      openAddProjectDrawer={openAddProjectDrawer}
      dispatch={dispatch}
      projectOptions={projectOptions}
      /> */}

      <FilterDrawer
        open={filterDrawerOpen}
        projectOptions={filterProjectOptions}
        dispatch={dispatch}
        projectExpense={false}
        projectId={""}
      />
      <ConformationAlertDialog
        openAlertDialog={openAlertDialog}
        dispatch={dispatch}
        expenseId={expenseId}
        deleteFuncLoad={deleteFuncLoad}
        dailyExpensePage={true}
      />

    <EditDialog
        editDialogOpen={editDialogOpen}
        dispatch={dispatch}
        expense={expense}
        editExpenseCurrentProject={editExpenseCurrentProject}
        projectOptions={projectOptions}
        editInfoLoad={editInfoLoad}
        // isDailyExpense={false}
      />
    </Container>
  );
};

export default DailyExpense;
