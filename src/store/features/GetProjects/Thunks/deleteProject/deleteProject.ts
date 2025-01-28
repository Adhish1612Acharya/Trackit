import { createAsyncThunk } from "@reduxjs/toolkit";
import { DeleteProjectResponse } from "./deleteProjectTypes";
import { auth, db } from "@/firebaseconfig";
import { RootState } from "@/store/store";
import { collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where, writeBatch } from "firebase/firestore";

 const deleteProject = createAsyncThunk<
  DeleteProjectResponse,
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

export default deleteProject;