import { createAsyncThunk } from "@reduxjs/toolkit";
import { DeleteExpenseDetailsResponseType } from "./deleteExpenseDetailsTypes";
import { auth, db } from "@/firebaseconfig";
import {
  arrayRemove,
  deleteDoc,
  doc,
  getDoc,
  increment,
  updateDoc,
} from "firebase/firestore";
import checkAndRemoveContributer from "../utils/removeContributer";

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

          const expenseDetails = expenseDocSnap.data();

          if (expenseDetails?.owner === user.uid) {
            // Delete the expense document
            await deleteDoc(expenseDocRef);

            // Update the user document
            const projectDocRef = doc(
              db,
              "projects",
              expenseDetails?.projectId
            );

            await updateDoc(projectDocRef, {
              expenses: arrayRemove(expenseId),
              expenseTotal: increment(-(expenseDetails as any).amount),
            });

            const contributerId = expenseDetails?.miscellaneous
              ? expenseDetails?.miscellaneuosPaidToId
              : expenseDetails?.paidToId;

            await checkAndRemoveContributer(
              user.uid,
              expenseDetails?.projectId,
              contributerId,
              expenseDetails?.miscellaneous
            );

            resolve({
              deleteExpenseId: expenseDetails?.projectId,
            });
          } else {
            window.location.href = "/u/home";
            reject("Access denied");
          }
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
