import { useParams } from "react-router-dom";
// DailyExpense.js
import { useEffect } from "react";
import DataTable from "@/components/DataTable/DataTable";
import { Container } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/store";
import FilterDrawer from "@/components/FilterDrawer";
import { getUserProjectExpense } from "@/store/features/ProjectDetails";

const ProjectExpense = () => {
  const { id } = useParams();

  const dispatch = useAppDispatch();

  const dailyExpense = useAppSelector(
    (state) => state.getProjectExpense.expense
  );

  const filterDrawerOpen = useAppSelector(
    (state) => state.getProjectExpense.openFilterDrawer
  );

  const filterProjectOptions = useAppSelector(
    (state) => state.getProjectExpense.filterProjects
  );

  // const submit = useAppSelector(
  //   (state) => state.addDailyExpense.submitAddDailyExpense
  // );

  useEffect(() => {
    dispatch(getUserProjectExpense(id as string));
  }, [dispatch, id]);

  return (
    <Container className="max-w-full">
      <DataTable
        expense={dailyExpense}
        dispatch={dispatch}
        projectExpense={true}
      />

      <FilterDrawer
        open={filterDrawerOpen}
        projectOptions={filterProjectOptions}
        dispatch={dispatch}
        projectExpense={true}
        projectId={String(id)}
      />
    </Container>
  );
};

export default ProjectExpense;
