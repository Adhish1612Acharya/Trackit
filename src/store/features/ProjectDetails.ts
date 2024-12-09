import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { expenseType, formValueType, projectOptionsType } from "./DailyExpense";
import { auth, db } from "@/firebaseconfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { Action } from "@radix-ui/react-alert-dialog";

interface initialStateType {
  expense: expenseType[];
  pageLoading: boolean;
  openFilterDrawer: boolean;
  filterProjects: projectOptionsType[];
  addFilterBtnLoad: boolean;
  dataTableLoader: boolean;
  total: number;
  projectName: string;
}

const initialState: initialStateType = {
  filterProjects: [],
  projectName: "",
  pageLoading: true,
  expense: [],
  openFilterDrawer: false,

  addFilterBtnLoad: false,
  dataTableLoader: false,
  total: 0,
};

interface GetUserDailyExpenseResponse {
  userData: any; // Replace `any` with the proper type of your user data if known
  dailyExpense: formValueType[] | []; // Replace `any` with the correct type for expense data
  total: number;
}

export const getUserProjectExpense = createAsyncThunk<
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
          // Query for daily expenses
          const userExpenseQuery = query(
            collection(db, "expense"),
            where("owner", "==", user.uid),
            where("projectId", "==", projectId)
          );
          const querySnapShot = await getDocs(userExpenseQuery);

          const dailyExpense = querySnapShot.docs.map((doc) => {
            const eachDoc = doc.data() as any;

            const formattedDate = (
              eachDoc.date instanceof Timestamp
                ? eachDoc.date.toDate()
                : (eachDoc.date as Date)
            )
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .split("/")
              .join("-");

            eachDoc.date = formattedDate;

            return eachDoc;
          });

          let total = 0;

          console.log(dailyExpense);

          if (dailyExpense.length > 0) {
            total = dailyExpense.reduce(
              (accu, eachExpense) => accu + Number(eachExpense.amount),
              0
            );
          }

          console.log(total);

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

interface filterData {
  filteredExpense: expenseType[] | [];
  total: number;
}

export interface filterValueType {
  paidToId: string;
  paymentModeId: string;
  projectId: string;
}

interface argsType {
  filterValue: {
    paidToId: string;
    paymentModeId: string;
    date: string;
  };

  projectId: string;
}

export const projectDetailsApplyFilter = createAsyncThunk<
  filterData,
  argsType,
  { rejectValue: string }
>("/applyFilter", async (value: argsType, _thunkAPI) => {
  let filteredExpense: expenseType[] | [] = [];
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        let startTimestamp: Timestamp | string = "";
        let endTimestamp: Timestamp | string = "";

        const convertTimeStamp = (date: string) => {
          // Format the date into "DD-MM-YYYY"
          const todayStartDate = new Date(date);
          todayStartDate.setHours(0, 0, 0, 0);

          const todayEndDate = new Date(date);
          todayEndDate.setHours(23, 59, 59, 999);

          // Convert the Date objects to Firestore Timestamps
          startTimestamp = Timestamp.fromDate(todayStartDate);
          endTimestamp = Timestamp.fromDate(todayEndDate);
        };
        try {
          const filterValue = value.filterValue;
          const formattedFilterData: any = {
            ...(filterValue.paidToId !== "52" && {
              paidToId: filterValue.paidToId,
            }),
            ...(filterValue.paymentModeId !== "51" && {
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
              where("date", "<=", endTimestamp)
            );
          } else {
            projectQueryExpense = query(
              collection(db, "expense"),
              where("owner", "==", user.uid),
              where("projectId", "==", value.projectId)
            );
          }

          // Create the base query

          // Dynamically add filters from formattedFilterData
          Object.keys(formattedFilterData).forEach((key) => {
            projectQueryExpense = query(
              projectQueryExpense,
              where(key, "==", formattedFilterData[key])
            );
          });

          // Get the filtered documents
          const querySnapshot = await getDocs(projectQueryExpense);

          let total = 0;

          // // Process the documents
          if (!querySnapshot.empty) {
            filteredExpense = querySnapshot.docs.map((doc) => {
              const eachDoc = doc.data() as any;

              const formattedDate = (
                eachDoc.date instanceof Timestamp
                  ? eachDoc.date.toDate()
                  : (eachDoc.date as Date)
              )
                .toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
                .split("/")
                .join("-");

              eachDoc.date = formattedDate;

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

const getProjectDetailsSlice = createSlice({
  name: "getProjectDetails",
  initialState,
  reducers: {
    setProjectDetailsOpenFilterDrawer: (state, action) => {
      state.openFilterDrawer = action.payload;
    },
    setProjectName: (state, action) => {
      state.projectName = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserProjectExpense.pending, (state, _action) => {
      state.pageLoading = true;
      state.dataTableLoader = true;
    });

    builder.addCase(getUserProjectExpense.fulfilled, (state, action) => {
      state.pageLoading = false;
      state.expense = action.payload.dailyExpense as expenseType[] | [];
      state.total = action.payload.total;
      state.filterProjects = [...action.payload.userData.projects];
      state.filterProjects.push({ id: "-1", name: "All" });
      state.dataTableLoader = false;
    });

    builder.addCase(getUserProjectExpense.rejected, (state, _action) => {
      state.pageLoading = false;
      toast.warn("Some Error occurred please try again"); // Add a toast notification
    });

    builder.addCase(projectDetailsApplyFilter.pending, (state, _action) => {
      state.dataTableLoader = true;
      state.addFilterBtnLoad = true;
    });

    builder.addCase(projectDetailsApplyFilter.fulfilled, (state, action) => {
      state.expense = action.payload.filteredExpense;
      state.dataTableLoader = false;
      state.addFilterBtnLoad = false;
      state.total = action.payload.total;
      state.openFilterDrawer = false;
    });

    builder.addCase(projectDetailsApplyFilter.rejected, (state, _action) => {
      state.dataTableLoader = false;
      state.addFilterBtnLoad = false;
      state.openFilterDrawer = false;
      toast.error("Some Error Occured");
    });
  },
});

export default getProjectDetailsSlice.reducer;
export const { setProjectDetailsOpenFilterDrawer, setProjectName } =
  getProjectDetailsSlice.actions;
