import { useNavigationType, useParams } from "react-router-dom";
import { useEffect } from "react";
import DataTable from "@/components/DataTable/DataTable";
import { Container, Fab } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/store";
import FilterDrawer from "@/components/FilterDrawer/FilterDrawer";
import ConformationAlertDialog from "@/components/ConformationAlertDialog/ConformationAlertDialog";
import EditDialog from "@/components/EditDialog/EditDialog";
import {
  setDeleteConformationDrawerOpen,
  setEditDrawerOpen,
} from "@/store/features/EditDeleteExpense/EditDeleteExpenseSlice";
import AddExpenseDrawer from "@/components/AddExpenseDrawer/AddExpenseDrawer";
import AddIcon from "@mui/icons-material/Add";
import { setOpenAddExpenseDrawer } from "@/store/features/DailyExpense/DailyExpenseSlice";
import useLocalStorage from "@/hooks/useLocalStorage/useLocalStorage";
import { setFilteredInitialState } from "@/store/features/ProjectDetails/ProjectDetailsSlice";
import getFilterExpense from "./utils/getFilterExpense";

const ProjectExpense = () => {
  const { id } = useParams();
  const { getFilterItem, setItem } = useLocalStorage();

  const dispatch = useAppDispatch();

  const navigationType = useNavigationType();

  const dataTableLoader = useAppSelector(
    (state) => state.addDailyExpense.dataTableLoader
  );

  const dailyExpense = useAppSelector(
    (state) => state.getProjectExpense.expense
  );

  const filterDrawerOpen = useAppSelector(
    (state) => state.getProjectExpense.openFilterDrawer
  );

  const filterProjectOptions = useAppSelector(
    (state) => state.getProjectExpense.filterProjects
  );

  const projectTitle = useAppSelector(
    (state) => state.getProjectExpense.projectName
  );

  const total = useAppSelector((state) => state.getProjectExpense.total);

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

  const projectOptions = useAppSelector(
    (state) => state.editDeleteExpense.editProjectOptions
  );

  const editInfoLoad = useAppSelector(
    (state) => state.editDeleteExpense.editInfoLoad
  );

  const editExpenseLoading = useAppSelector(
    (state) => state.editDeleteExpense.editFuncLoad
  );

  const editDeleteExpenseMiscellaneousInput = useAppSelector(
    (state) => state.editDeleteExpense.miscellaneuosInput
  );

  const addExpenseLoading = useAppSelector(
    (state) => state.addDailyExpense.addExpenseBtnLoad
  );

  const openAddExpenseDrawer = useAppSelector(
    (state) => state.addDailyExpense.openAddExpenseDrawer
  );

  const miscellaneousInput = useAppSelector(
    (state) => state.addDailyExpense.miscellaneousInput
  );

  const filterInitialState = useAppSelector(
    (state) => state.getProjectExpense.filterInitialState
  );

  const filterAppliedCount = useAppSelector(
    (state) => state.getProjectExpense.filterAppliedCount
  );

  useEffect(() => {
    return () => {
      if (navigationType === "PUSH" || navigationType === "REPLACE") {
        setItem("projectPageFilter", ["", "-1", "-1"]);
        dispatch(setFilteredInitialState(["", "-1", "-1"]));
      }
    };
  }, []);

  useEffect(() => {
    const filterArray = getFilterItem("projectPageFilter");
    dispatch(setFilteredInitialState(filterArray));
    dispatch(
      setEditDrawerOpen({
        id: "",
        open: false,
        dailyExpenseOrNot: false,
      })
    );
    dispatch(setDeleteConformationDrawerOpen({ open: false, expenseId: "" }));
    getFilterExpense(getFilterItem, dispatch, id);
  }, [dispatch, id]);

  return (
    <Container className="max-w-full">
      <DataTable
        expense={dailyExpense}
        dispatch={dispatch}
        projectExpense={true}
        totalExpense={total}
        dailyExpense={false}
        projectName={projectTitle}
        dataTableLoader={dataTableLoader}
        filterAppliedCount={filterAppliedCount}
      />

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
        projectExpense={true}
        projectId={String(id)}
        filterInitialValue={filterInitialState}
      />

      <ConformationAlertDialog
        openAlertDialog={openAlertDialog}
        dispatch={dispatch}
        expenseId={expenseId}
        deleteFuncLoad={deleteFuncLoad}
        dailyExpensePage={false}
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
        isDailyExpense={false}
        isProjectPage={true}
      />

      <AddExpenseDrawer
        openDrawer={openAddExpenseDrawer}
        dispatch={dispatch}
        projectOptions={[{ id: id ? id : "", name: projectTitle }]}
        loading={addExpenseLoading}
        miscellaneousInput={miscellaneousInput}
        isDailyExpense={false}
        isProjectPage={true}
      />
    </Container>
  );
};

export default ProjectExpense;
