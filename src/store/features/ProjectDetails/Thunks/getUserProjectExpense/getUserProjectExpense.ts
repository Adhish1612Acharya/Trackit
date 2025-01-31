import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetUserDailyExpenseResponse } from "./getUserProjectExpenseTypes";
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
import { setProjectName } from "../../ProjectDetailsSlice";
import formatDate from "@/store/sharedUtils/formatDate";
// import getUserAllMiscContributers from "@/store/sharedUtils/getUserAllMiscContributers";

const getUserProjectExpense = createAsyncThunk<
  GetUserDailyExpenseResponse,
  string,
  {
    rejectValue: string;
  }
>("/getUserExpense", async (projectId: string, thunkAPI) => {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // const userAllMiscContributers = await getUserAllMiscContributers(
          //   user.uid
          // );
          // Query for daily expenses
          const userExpenseQuery = query(
            collection(db, "expense"),
            where("owner", "==", user.uid),
            where("projectId", "==", projectId),
            orderBy("date", "desc")
          );
          const querySnapShot = await getDocs(userExpenseQuery);

          const dailyExpense = querySnapShot.docs.map((doc) => {
            const eachDoc = doc.data() as any;

            const formattedDate = formatDate(
              eachDoc.date instanceof Timestamp
                ? eachDoc.date.toDate()
                : (eachDoc.date as Date)
            );

            eachDoc.date = formattedDate;
            eachDoc.expenseId = doc.id;

            if (!eachDoc.billImage) eachDoc.billImage === "";

            return eachDoc;
          });

          let total = 0;

          if (dailyExpense.length > 0) {
            total = dailyExpense.reduce(
              (accu, eachExpense) => accu + Number(eachExpense.amount),
              0
            );
          }

          // Get user document
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          const projectQuery = doc(db, "projects", projectId);
          const queryResp = await getDoc(projectQuery);

          const projectDetail = queryResp.data();

          thunkAPI.dispatch(setProjectName(projectDetail?.title));

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();

            resolve({
              userData,
              dailyExpense: dailyExpense,
              total,
              // userAllMiscContributers 
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

export default getUserProjectExpense;
