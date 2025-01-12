import { useParams } from "react-router-dom";
// DailyExpense.js
import { useEffect } from "react";
import DataTable from "@/components/DataTable/DataTable";
import { Container } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/store";
import FilterDrawer from "@/components/FilterDrawer";
import { getUserProjectExpense } from "@/store/features/ProjectDetails";
import ConformationAlertDialog from "@/components/ConformationAlertDialog/ConformationAlertDialog";
import EditDialog from "@/components/EditDialog/EditDialog";
import { setEditDrawerOpen } from "@/store/features/EditDeleteExpense";

const ProjectExpense = () => {
  const { id } = useParams();

  const dispatch = useAppDispatch();

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

  const editExpenseLoading=useAppSelector(state=>state.editDeleteExpense.editFuncLoad);

  const editDeleteExpenseMiscellaneousInput=useAppSelector(
    (state) => state.editDeleteExpense.miscellaneuosInput
  )

  useEffect(() => {
    dispatch(getUserProjectExpense(id as string));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(
      setEditDrawerOpen({
        id: "",
        open: false,
        dailyExpenseOrNot: false,
      })
    );
  }, [dispatch]);

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
      />

      <FilterDrawer
        open={filterDrawerOpen}
        projectOptions={filterProjectOptions}
        dispatch={dispatch}
        projectExpense={true}
        projectId={String(id)}
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
      />
    </Container>
  );
};

export default ProjectExpense;
