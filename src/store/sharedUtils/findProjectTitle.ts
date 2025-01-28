import { ProjectOptionsType } from "@/store/SharedTypes/sharedTypes";

const findProjectTitle = (id: string, userProjects: ProjectOptionsType[]) => {
  return userProjects.filter((p) => {
    return p.id === id;
  });
};

export default findProjectTitle;
