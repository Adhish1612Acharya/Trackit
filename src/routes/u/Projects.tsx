import ConformationAlertDialog from "@/components/ConformationAlertDialog/ConformationAlertDialog";
import ProjectInfoCard from "@/components/ProjectInfoCard";
import { getProjectsDetails } from "@/store/features/GetProjects";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Skeleton } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    dispatch(getProjectsDetails());
  }, [dispatch]);

  return (
    <>
      <div
        className="flex flex-row w-full h-max justify-evenly align-evenly flex-wrap"
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
                navigate={navigate}
                dispatch={dispatch}
              />
            );
          })
        ) : (
          <div className="flex-column ">
            <Skeleton
              variant="rectangular"
              style={{ maxWidth: "100%", width: "60rem", height: "16rem" }}
            />
            <br></br>

            <Skeleton
              variant="rectangular"
              style={{ maxWidth: "100%", width: "60rem", height: "16rem" }}
            />
          </div>
        )}
      </div>
      <ConformationAlertDialog
        openAlertDialog={openDeleteAlertDialog}
        dispatch={dispatch}
        expenseId={""}
        deleteFuncLoad={deleteLoad}
        dailyExpensePage={false}
        isDeleteProject={true}
      />
    </>
  );
};

export default Projects;
