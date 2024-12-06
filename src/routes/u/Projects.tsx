import ProjectInfoCard from "@/components/ProjectInfoCard";
import { getProjectsDetails } from "@/store/features/GetProjects";
import { useAppDispatch, useAppSelector } from "@/store/store";
import  { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Projects = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.getProjectDetails.projects);

  useEffect(() => {
    dispatch(getProjectsDetails());
  }, [dispatch]);

  return (
    <div
      className="flex flex-row w-full h-max justify-evenly align-evenly flex-wrap"
      style={{ marginTop: "4rem" }}
    >
      {projects.map((project) => {
        return (
          <ProjectInfoCard
            key={project.id}
            id={project.id}
            title={project.title}
            description={project.description}
            budget={project.budget}
            navigate={navigate}
          />
        );
      })}
    </div>
  );
};

export default Projects;
