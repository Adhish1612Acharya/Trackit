import { auth, db } from "@/firebaseconfig";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { RootState } from "../store";

interface contributersType {
  id: string;
  name: string;
  miscellaneousRole: string;
  miscellaneousId: string;
  miscellaneous: boolean;
}

interface projectsType {
  id: string;
  title: string;
  description: string;
  budget: string;
  contributers: contributersType[];
  expenses: string[];
  image: string;
  owner: string;
}

interface initialStateType {
  loading: boolean;
  projects: projectsType[];
  deleteProjectId: string | null;
  deleteLoad: boolean;
  openProjectDeleteAlert: boolean;
  openAddProjectDrawer:boolean;
  addProjectBtnLoad:boolean;
}

interface getProjectDetailsResponse {
  projects: projectsType[];
}

interface deleteProjectResponse {
  projectId: string;
}

const initialState: initialStateType = {
  loading: true,
  projects: [],
  deleteProjectId: null,
  deleteLoad: false,
  openProjectDeleteAlert: false,
  openAddProjectDrawer:false,
  addProjectBtnLoad:false,
};

export const getProjectsDetails = createAsyncThunk<
  getProjectDetailsResponse,
  void,
  { rejectValue: string }
>("/getProjects", async (_value, _thunkAPI) => {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const projectQuery = query(
            collection(db, "projects"),
            where("owner", "==", `${user.uid}`)
          );
          const querySnapShot = await getDocs(projectQuery);

          const projects = querySnapShot.docs.map((doc) => {
            const obj = doc.data() as projectsType;
            obj.id = doc.id;

            return obj;
          });

          resolve({
            projects: projects,
          });
        } catch (err) {
          reject(err);
        }
      } else {
        window.location.href = "/";
        reject(new Error("User not authenticated"));
      }
    });
  });
});

export const deleteProject = createAsyncThunk<
  deleteProjectResponse,
  void,
  { rejectValue: string }
>("/deleteProject", async (_value, thunkAPI) => {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const state = thunkAPI.getState() as RootState;
        const projectId = state.getProjectDetails.deleteProjectId;
        const expensesRef = collection(db, "expense");
        const q = query(expensesRef, where("projectId", "==", projectId));

        if (projectId) {
          const querySnapshot = await getDocs(q);

          // Use a batch to delete all matching documents
          const batch = writeBatch(db);

          querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
          });

          // Commit the batch
          await batch.commit();

          const userRef = doc(db, "users", user.uid);

          const userSnapShot = await getDoc(userRef);

          if (userSnapShot.exists()) {
            const userData = userSnapShot.data();
            const updatedUserProjects:{ id: string; name: string }[] = userData.projects.filter(
              (eachProject: { id: string; name: string }) =>
                eachProject.id !== projectId
            );

            await updateDoc(userRef, {
              projects: updatedUserProjects,
            });
          } else {
            reject(new Error("User not found"));
          }

          const projectRef = doc(db, "projects", projectId);

          await deleteDoc(projectRef);

          resolve({
            projectId,
          });
        } else {
          reject(new Error("Project id not found"));
        }
      } else {
        reject(new Error("User not authenticated"));
      }
    });
  });
});

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
    setOpenAddProjectDrawer:(state,action:PayloadAction<boolean>)=>{
      state.openAddProjectDrawer=action.payload;
    },
    setAddProjectBtnLoad:(state,action:PayloadAction<boolean>)=>{
      state.addProjectBtnLoad=action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getProjectsDetails.pending, (state, _action) => {
      state.loading = true;
    });

    builder.addCase(getProjectsDetails.fulfilled, (state, action) => {
      state.projects = action.payload.projects;
      state.loading = false;
    });

    builder.addCase(getProjectsDetails.rejected, (state, _action) => {
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

export const { setProjectDeleteAlertOpen, setDeleteProjectId,setOpenAddProjectDrawer,setAddProjectBtnLoad } =
  getProjectsSlice.actions;
