import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  GetProjectDetailsResponse,
  ProjectsType,
} from "./getProjectDetailsTypes";
import { auth, db } from "@/firebaseconfig";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

const getProjectDetails = createAsyncThunk<
  GetProjectDetailsResponse,
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
            const obj = doc.data() as ProjectsType;
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

export default getProjectDetails;
