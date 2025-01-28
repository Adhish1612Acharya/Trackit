import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetUserDailyExpenseResponse } from "./getUserDailyExpenseTypes";
import { auth, db } from "@/firebaseconfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import getUserAllMiscContributers from "@/store/sharedUtils/getUserAllMiscContributers";
import formatDate from "@/store/sharedUtils/formatDate";
import { ExpenseType } from "@/store/SharedTypes/sharedTypes";

const getUserDailyExpense = createAsyncThunk<
  GetUserDailyExpenseResponse,
  void,
  {
    rejectValue: string;
  }
>("/getUserExpense", async (_value, _thunkAPI) => {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userAllMiscContributers = await getUserAllMiscContributers(
            user.uid
          );
          
          // Format the date into "DD-MM-YYYY"
          const todayStartDate = new Date();
          todayStartDate.setHours(0, 0, 0, 0);

          const todayEndDate = new Date();
          todayEndDate.setHours(23, 59, 59, 999);

          // Convert the Date objects to Firestore Timestamps
          const startTimestamp = Timestamp.fromDate(todayStartDate);
          const endTimestamp = Timestamp.fromDate(todayEndDate);

          // Query for daily expenses
          const userExpenseQuery = query(
            collection(db, "expense"),
            where("owner", "==", user.uid),
            where("date", ">=", startTimestamp),
            where("date", "<=", endTimestamp),
            orderBy("date", "desc")
          );
          const querySnapShot = await getDocs(userExpenseQuery);

          const dailyExpense = querySnapShot.docs.map((doc) => {
            const eachDoc = doc.data() as ExpenseType;

            const formattedDate = formatDate((
              eachDoc.date instanceof Timestamp
                ? eachDoc.date.toDate()
                : (eachDoc.date as Date)
            ));
            eachDoc.date = formattedDate;

            eachDoc.expenseId = doc.id;

            return eachDoc;
          });

          const total = dailyExpense.reduce(
            (accum, eachExpense) => accum + Number(eachExpense.amount),
            0
          );

          // Get user document
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();

            resolve({
              userData,
              dailyExpense: dailyExpense,
              total: total,
              miscContributers:userAllMiscContributers
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          reject(error);
        }
      } else {
        window.location.href = "/";
        reject(new Error("User not authenticated"));
      }
    });
  });
});

export default getUserDailyExpense;
