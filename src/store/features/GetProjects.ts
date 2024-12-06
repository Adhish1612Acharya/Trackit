import { auth, db } from "@/firebaseconfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, getDocs, query, where } from "firebase/firestore";
import { toast } from "react-toastify";

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
}

interface getProjectDetailsResponse {
  projects: projectsType[];
}

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

const initialState: initialStateType = {
  loading: true,
  projects: [],
};

const getProjectsSlice = createSlice({
  name: "getProjects",
  initialState,
  reducers: {},
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
  },
});

export default getProjectsSlice.reducer;

// export const {} = getProjectsSlice.actions;
