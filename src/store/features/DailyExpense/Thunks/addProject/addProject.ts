import { createAsyncThunk } from "@reduxjs/toolkit";
import { AddProjectFormValueType, AddProjectResponse } from "./addProjectType";
import { auth, db } from "@/firebaseconfig";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { addProjectOptions } from "../../DailyExpenseSlice";

export const addProject = createAsyncThunk<
  AddProjectResponse,
  AddProjectFormValueType,
  { rejectValue: string }
>("/addProject", async (value: AddProjectFormValueType, thunkAPI) => {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const projectFormDocument: any = {
            title: value.title,
            description: value.description,
            image: "",
            budget: Number(value.budget),
            expenses: [],
            owner: user.uid,
            contributers: [],
          };
          const addedProject = await addDoc(
            collection(db, "projects"),
            projectFormDocument
          );

          const userDocRef = doc(db, "users", user.uid);

          await updateDoc(userDocRef, {
            projects: arrayUnion({ id: addedProject.id, name: value.title }), // Add the new projectId to the 'projects' array
          });

          thunkAPI.dispatch(
            addProjectOptions({ id: addedProject.id, name: value.title })
          );

          projectFormDocument.id = addedProject.id;

          resolve({
            message: "Project Added",
            newProject: {
              id: addedProject.id,
              name: value.title,
              newProjectData: projectFormDocument,
            },
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
          reject();
        }
      } else {
        reject(new Error("User not authenticated"));
      }
    });
  });
});
