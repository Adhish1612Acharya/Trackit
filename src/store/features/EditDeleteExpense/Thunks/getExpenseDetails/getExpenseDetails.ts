import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetExpenseDetailsResponseType } from "./getExpenseDetailsTypes";
import { auth, db } from "@/firebaseconfig";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import getUserAllMiscContributers from "@/store/sharedUtils/getUserAllMiscContributers";
import formatDate from "@/store/sharedUtils/formatDate";
import { ExpenseType } from "@/store/SharedTypes/sharedTypes";

const getExpenseDetails = createAsyncThunk<
  GetExpenseDetailsResponseType,
  string,
  { rejectValue: string }
>("/expense-details", async (id: string, _thunkAPI) => {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const filteredDuplicateMiscbutersContri =
            await getUserAllMiscContributers(user.uid);

          const docRef = doc(db, "expense", id);
          const document = await getDoc(docRef);

          if (!document.exists()) {
            return reject("Expense details not found.");
          }

          const expenseDetails = document.data() as ExpenseType;

          if (expenseDetails.owner === user.uid) {
            expenseDetails.expenseId = document.id;

            const userDocRef = doc(db, "users", user.uid);

            const userDocSnap = await getDoc(userDocRef);

            const formattedDate = formatDate(
              expenseDetails.date instanceof Timestamp
                ? expenseDetails.date.toDate()
                : (expenseDetails.date as Date)
            );

            expenseDetails.date = formattedDate;

            if (!userDocSnap.exists()) {
              return reject("User not found");
            }
            const userDetails = userDocSnap.data();

            resolve({
              expenseDetails: expenseDetails,
              projectOptions: userDetails.projects,
              userAllProjectMiscContributers: filteredDuplicateMiscbutersContri,
            });
          } else {
           window.location.href="/u/home"
          }
        } catch (err) {
          console.log(err);
          reject("Failed to fetch expense details. Please try again.");
        }
      } else {
        window.location.href = "/";
        reject("User not authenticated");
      }
    });
  });
});

export default getExpenseDetails;
