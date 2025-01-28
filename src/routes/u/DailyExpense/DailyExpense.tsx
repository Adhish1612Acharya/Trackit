import { useEffect } from "react";
import DataTable from "@/components/DataTable/DataTable";
import { Fab, Container } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAppDispatch, useAppSelector } from "@/store/store";

import AddExpenseDrawer from "@/components/AddExpenseDrawer/AddExpenseDrawer";
import FilterDrawer from "@/components/FilterDrawer/FilterDrawer";
import { useLogin } from "@/Context/LoginProviderContext/LoginProviderContext";
import ConformationAlertDialog from "@/components/ConformationAlertDialog/ConformationAlertDialog";
import { setDeleteConformationDrawerOpen } from "@/store/features/EditDeleteExpense/EditDeleteExpenseSlice";
import EditDialog from "@/components/EditDialog/EditDialog";
import AddProjectDrawer from "@/components/AddProjectDrawer/AddProjectDrawer";
import getUserDailyExpense from "@/store/features/DailyExpense/Thunks/getUserDailyExpense/getUserDailyExpense";
import { setOpenAddExpenseDrawer } from "@/store/features/DailyExpense/DailyExpenseSlice";

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

  const editDialogOpen = useAppSelector(
    (state) => state.editDeleteExpense.editDrawerOpen
  );

  const expense = useAppSelector(
    (state) => state.editDeleteExpense.expenseInfo
  );

  const editExpenseCurrentProject = useAppSelector(
    (state) => state.editDeleteExpense.currrentProject
  );

  const addExpenseLoading = useAppSelector(
    (state) => state.addDailyExpense.addExpenseBtnLoad
  );

  const editExpenseLoading = useAppSelector(
    (state) => state.editDeleteExpense.editFuncLoad
  );

  const editInfoLoad = useAppSelector(
    (state) => state.editDeleteExpense.editInfoLoad
  );

  const editDeleteExpenseMiscellaneousInput = useAppSelector(
    (state) => state.editDeleteExpense.miscellaneuosInput
  );

  const miscellaneousInput = useAppSelector(
    (state) => state.addDailyExpense.miscellaneousInput
  );

  const addProjectBtnLoad = useAppSelector(
    (state) => state.addDailyExpense.addProjectBtnLoad
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
        editFuncLoading={editExpenseLoading}
        miscellaneousInput={editDeleteExpenseMiscellaneousInput}
        isDailyExpense={true}
        isProjectPage={false}
      />

      <AddExpenseDrawer
        openDrawer={openAddExpenseDrawer}
        dispatch={dispatch}
        projectOptions={projectOptions}
        loading={addExpenseLoading}
        miscellaneousInput={miscellaneousInput}
        isDailyExpense={true}
        isProjectPage={false}
      />

      <AddProjectDrawer
        isDailyExpensePage={false}
        open={openAddProjectDrawer}
        dispatch={dispatch}
        addProjectBtnLoad={addProjectBtnLoad}
      />
    </Container>
  );
};

export default DailyExpense;
