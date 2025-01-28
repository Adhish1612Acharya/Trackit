import { ContributersType } from "@/store/features/GetProjects/Thunks/getProjectDetails/getProjectDetailsTypes";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  budget: number;
  expenses: string[]; 
  owner: string;
  contributers: ContributersType[];
}

interface NewProject {
  id: string;
  name: string;
  newProjectData: Project;
}

export interface AddProjectResponse {
  message: string;
  newProject: NewProject;
}

export interface AddProjectFormValueType {
  title: string;
  description: string;
  // image?: string;
  budget: string;
}
