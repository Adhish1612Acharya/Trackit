import { ArgsType, FilterData } from "./projectDetailsApplyFilterTypes";
import { auth, db } from "@/firebaseconfig";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { createAsyncThunk } from "@reduxjs/toolkit";
import formatDate from "@/store/sharedUtils/formatDate";
import { ExpenseType } from "@/store/SharedTypes/sharedTypes";

const projectDetailsApplyFilter = createAsyncThunk<
  FilterData,
  ArgsType,
  { rejectValue: string }
>("/applyFilter", async (value: ArgsType, _thunkAPI) => {
  let filteredExpense: ExpenseType[] | [] = [];
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        let startTimestamp: Timestamp | string = "";
        let endTimestamp: Timestamp | string = "";

        const convertTimeStamp = (date: string) => {
          const todayStartDate = new Date(date);
          todayStartDate.setHours(0, 0, 0, 0);

          const todayEndDate = new Date(date);
          todayEndDate.setHours(23, 59, 59, 999);

          startTimestamp = Timestamp.fromDate(todayStartDate);
          endTimestamp = Timestamp.fromDate(todayEndDate);
        };
        try {
          const filterValue = value.filterValue;
          const formattedFilterData: any = {
            ...(filterValue.paidToId !== "-1" && {
              paidToId: filterValue.paidToId,
            }),
            ...(filterValue.paymentModeId !== "-1" && {
              paymentModeId: filterValue.paymentModeId,
            }),
          };

          if (filterValue.date !== "" && filterValue.date !== undefined) {
            convertTimeStamp(filterValue.date);
          }

          let projectQueryExpense: any;

          if (filterValue.date !== "" && filterValue.date !== undefined) {
            // Create the base query
            projectQueryExpense = query(
              collection(db, "expense"),
              where("owner", "==", user.uid),
              where("projectId", "==", value.projectId),
              where("date", ">=", startTimestamp),
              where("date", "<=", endTimestamp),
              orderBy("date", "desc")
            );
          } else {
            projectQueryExpense = query(
              collection(db, "expense"),
              where("owner", "==", user.uid),
              where("projectId", "==", value.projectId),
              orderBy("date", "desc")
            );
          }

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

export default projectDetailsApplyFilter;
