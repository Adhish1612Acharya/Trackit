import { createAsyncThunk } from "@reduxjs/toolkit";
import { DeleteExpenseDetailsResponseType } from "./deleteExpenseDetailsTypes";
import { auth, db } from "@/firebaseconfig";
import { arrayRemove, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";

export const deleteExpenseDetails = createAsyncThunk<
  DeleteExpenseDetailsResponseType,
  { expenseId: string },
  { rejectValue: string }
>("/delete/expense", async ({ expenseId }, _thunkAPI) => {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const expenseDocRef = doc(db, "expense", expenseId);
          const expenseDocSnap = await getDoc(expenseDocRef);

          if (!expenseDocSnap.exists()) {
            reject("Expense Not found");
          }

          // Delete the expense document
          await deleteDoc(expenseDocRef);

          const expenseDetails = expenseDocSnap.data();

          // Update the user document
          const projectDocRef = doc(db, "projects", expenseDetails?.projectId);

          await updateDoc(projectDocRef, {
            expenses: arrayRemove(expenseId),
          });

          resolve({
            deleteExpenseId: expenseDetails?.projectId,
          });
        } catch (err) {
          console.log(err);
          reject(`Error occurred: ${err}`);
        }
      } else {
        reject("User Not forund");
      }
    });
  });
});