export interface ContributersType {
  id: string;
  name: string;
  miscellaneousRole: string;
  miscellaneousId: string;
  miscellaneous: boolean;
}

export interface ProjectsType {
  id: string;
  title: string;
  description: string;
  budget: number;
  contributers: ContributersType[];
  expenses: string[];
  image: string;
  owner: string;
  expenseTotal: number;
}

export interface GetProjectDetailsResponse {
  projects: ProjectsType[];
}
