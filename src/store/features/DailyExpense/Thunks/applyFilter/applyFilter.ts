import { createAsyncThunk } from "@reduxjs/toolkit";
import { FilterData, FilterValueType } from "./applyFilterTypes";

import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "@/firebaseconfig";
import formatDate from "@/store/sharedUtils/formatDate";
import { ExpenseType } from "@/store/SharedTypes/sharedTypes";

const applyFilter = createAsyncThunk<
  FilterData,
  FilterValueType,
  { rejectValue: string }
>("/applyFilter", async (filterValue: FilterValueType, _thunkAPI) => {
  let filteredExpense: ExpenseType[] | [] = [];
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const formattedFilterData: any = {
            ...(filterValue.paidToId !== "-1" && {
              paidToId: filterValue.paidToId,
            }),
            ...(filterValue.paymentModeId !== "-1" && {
              paymentModeId: filterValue.paymentModeId,
            }),
            ...(filterValue.projectId !== "-1" && {
              projectId: filterValue.projectId,
            }),
          };

          // Format the date into "DD-MM-YYYY"
          const todayStartDate = new Date();
          todayStartDate.setHours(0, 0, 0, 0);

          const todayEndDate = new Date();
          todayEndDate.setHours(23, 59, 59, 999);

          // Convert the Date objects to Firestore Timestamps
          const startTimestamp = Timestamp.fromDate(todayStartDate);
          const endTimestamp = Timestamp.fromDate(todayEndDate);

          // Create the base query
          let projectQueryExpense = query(
            collection(db, "expense"),
            where("owner", "==", user.uid),
            where("date", ">=", startTimestamp),
            where("date", "<=", endTimestamp),
            orderBy("date", "desc")
          );

          // Dynamically add filters from formattedFilterData
          Object.keys(formattedFilterData).forEach((key) => {
            projectQueryExpense = query(
              projectQueryExpense,
              where(key, "==", formattedFilterData[key])
            );
          });

        
          const querySnapshot = await getDocs(projectQueryExpense);

          let total = 0;

         
          if (!querySnapshot.empty) {
            filteredExpense = querySnapshot.docs.map((doc) => {
              const eachDoc = doc.data() as any;

              const formattedDate = formatDate(
                eachDoc.date instanceof Timestamp
                  ? eachDoc.date.toDate()
                  : (eachDoc.date as Date)
              );

              eachDoc.date = formattedDate;

              eachDoc.expenseId = doc.id;

              return eachDoc;
            });
            total = filteredExpense.reduce(
              (accum, eachExpense) => accum + Number(eachExpense.amount),
              0
            );
          }

          resolve({
            filteredExpense,
            total,
          });
        } catch (err) {
          console.error("Error fetching user data:", err);
          reject(err);
        }
      } else {
        reject(new Error("User not authenticated"));
      }
    });
  });
});

export default applyFilter;
