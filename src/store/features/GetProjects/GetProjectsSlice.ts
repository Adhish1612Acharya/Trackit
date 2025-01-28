import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { ProjectsType } from "./Thunks/getProjectDetails/getProjectDetailsTypes";
import getProjectDetails from "./Thunks/getProjectDetails/getProjectDetails";
import deleteProject from "./Thunks/deleteProject/deleteProject";
import { GetProjectsInitialStateType } from "./GetProjectsSliceTypes";

const initialState: GetProjectsInitialStateType = {
  loading: true,
  projects: [],
  deleteProjectId: null,
  deleteLoad: false,
  openProjectDeleteAlert: false,
  openAddProjectDrawer: false,
  addProjectBtnLoad: false,

};

const getProjectsSlice = createSlice({
  name: "getProjects",
  initialState,
  reducers: {
    setProjectDeleteAlertOpen: (state, action: PayloadAction<boolean>) => {
      state.openProjectDeleteAlert = action.payload;
    },
    setDeleteProjectId: (state, action: PayloadAction<string>) => {
      state.deleteProjectId = action.payload;
    },
    setOpenAddProjectDrawer: (state, action: PayloadAction<boolean>) => {
      state.openAddProjectDrawer = action.payload;
    },
    setAddProjectBtnLoad: (state, action: PayloadAction<boolean>) => {
      state.addProjectBtnLoad = action.payload;
    },
    setNewProject: (state, action: PayloadAction<ProjectsType>) => {
      state.projects.push(action.payload);
      state.addProjectBtnLoad = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProjectDetails.pending, (state, _action) => {
      state.loading = true;
    });

    builder.addCase(getProjectDetails.fulfilled, (state, action) => {
      state.projects = action.payload.projects;
      state.loading = false;
    });

    builder.addCase(getProjectDetails.rejected, (state, _action) => {
      state.loading = false;
      toast.error("Some Error Ocurred Please Try again");
    });

    builder.addCase(deleteProject.pending, (state, _action) => {
      state.deleteLoad = true;
    });

    builder.addCase(deleteProject.fulfilled, (state, _action) => {
      state.projects = state.projects.filter((eachProject) => {
        return eachProject.id !== state.deleteProjectId;
      });
      state.deleteProjectId = null;
      state.deleteLoad = false;
      state.openProjectDeleteAlert = false;
      toast.success("Project deleted");
    });

    builder.addCase(deleteProject.rejected, (state, _action) => {
      state.deleteProjectId = null;
      state.deleteLoad = false;
      state.openProjectDeleteAlert = false;
      toast.error("Some error occured");
    });
  },
});

export default getProjectsSlice.reducer;

export const {
  setNewProject,
  setProjectDeleteAlertOpen,
  setDeleteProjectId,
  setOpenAddProjectDrawer,
  setAddProjectBtnLoad,
} = getProjectsSlice.actions;
