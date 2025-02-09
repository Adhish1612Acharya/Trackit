import AddProjectDrawer from "@/components/AddProjectDrawer/AddProjectDrawer";
import ConformationAlertDialog from "@/components/ConformationAlertDialog/ConformationAlertDialog";
import ProjectInfoCard from "@/components/ProjectInfoCard/ProjectInfoCard";
import getProjectsDetails from "@/store/features/GetProjects/Thunks/getProjectDetails/getProjectDetails";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { setOpenAddProjectDrawer } from "@/store/features/GetProjects/GetProjectsSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { Fab } from "@mui/material";
import ProjectCardSkeleton from "@/components/ProjectCardSkeleton/ProjectCardSkeleton";

const Projects = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.getProjectDetails.projects);

  const getProjectDetailsLoading = useAppSelector(
    (state) => state.getProjectDetails.loading
  );

  const deleteLoad = useAppSelector(
    (state) => state.getProjectDetails.deleteLoad
  );

  const openDeleteAlertDialog = useAppSelector(
    (state) => state.getProjectDetails.openProjectDeleteAlert
  );

  const openAddProjectDrawer = useAppSelector(
    (state) => state.getProjectDetails.openAddProjectDrawer
  );

  const addProjectBtnLoad = useAppSelector(
    (state) => state.getProjectDetails.addProjectBtnLoad
  );

  useEffect(() => {
    dispatch(getProjectsDetails());
  }, [dispatch]);

  return (
    <>
      <div
        className="flex flex-row w-full  h-max justify-evenly align-evenly flex-wrap"
        style={{ marginTop: "4rem" }}
      >
        {!getProjectDetailsLoading ? (
          projects.map((project) => {
            return (
              <ProjectInfoCard
                key={project.id}
                id={project.id}
                title={project.title}
                description={project.description}
                budget={project.budget}
                expenseTotal={project.expenseTotal}
                navigate={navigate}
                dispatch={dispatch}
              />
            );
          })
        ) : (
          <>
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
          </>
        )}
      </div>
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
        onClick={() => dispatch(setOpenAddProjectDrawer(true))}
      >
        <CreateNewFolderIcon />
      </Fab>
      <ConformationAlertDialog
        openAlertDialog={openDeleteAlertDialog}
        dispatch={dispatch}
        expenseId={""}
        deleteFuncLoad={deleteLoad}
        dailyExpensePage={false}
        isDeleteProject={true}
      />

      <AddProjectDrawer
        open={openAddProjectDrawer}
        isDailyExpensePage={false}
        dispatch={dispatch}
        addProjectBtnLoad={addProjectBtnLoad}
      />
    </>
  );
};

export default Projects;
