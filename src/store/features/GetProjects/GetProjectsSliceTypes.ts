import { ProjectsType } from "./Thunks/getProjectDetails/getProjectDetailsTypes";

export interface GetProjectsInitialStateType {
  loading: boolean;
  projects: ProjectsType[];
  deleteProjectId: string | null;
  deleteLoad: boolean;
  openProjectDeleteAlert: boolean;
  openAddProjectDrawer: boolean;
  addProjectBtnLoad: boolean;
}
