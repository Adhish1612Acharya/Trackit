import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { expenseType, formValueType, projectOptionsType } from "./DailyExpense";
import { auth, db } from "@/firebaseconfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";

interface initialStateType {
  expense: expenseType[];
  pageLoading: boolean;
  openFilterDrawer: boolean;
  filterProjects: projectOptionsType[];
  addFilterBtnLoad: boolean;
  dataTableLoader: boolean;
}

const initialState: initialStateType = {
  filterProjects: [],

  pageLoading: true,
  expense: [],
  openFilterDrawer: false,

  addFilterBtnLoad: false,
  dataTableLoader: false,
};

interface GetUserDailyExpenseResponse {
  userData: any; // Replace `any` with the proper type of your user data if known
  dailyExpense: formValueType[] | []; // Replace `any` with the correct type for expense data
}

export const getUserProjectExpense = createAsyncThunk<
  GetUserDailyExpenseResponse,
  string,
  {
    rejectValue: string;
  }
>("/getUserExpense", async (projectId: string, _thunkAPI) => {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Format the date into "DD-MM-YYYY"
          //   const todayDate = new Date();

          //   const formattedDate = todayDate
          //     .toLocaleDateString("en-GB", {
          //       day: "2-digit",
          //       month: "2-digit",
          //       year: "numeric",
          //     })
          //     .split("/")
          //     .join("-");

          // Query for daily expenses
          const userExpenseQuery = query(
            collection(db, "expense"),
            where("owner", "==", user.uid),
            where("projectId", "==", projectId)
          );
          const querySnapShot = await getDocs(userExpenseQuery);

          const dailyExpense = querySnapShot.docs.map(
            (doc) => doc.data() as formValueType
          );

          // Get user document
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();

            resolve({
              userData,
              dailyExpense: dailyExpense,
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
        try {
          const filterValue = value.filterValue;
          const formattedFilterData: any = {
            ...(filterValue.paidToId !== "52" && {
              paidToId: filterValue.paidToId,
            }),
            ...(filterValue.paymentModeId !== "51" && {
              paymentModeId: filterValue.paymentModeId,
            }),
            ...(filterValue.date !== "" && {
              date: filterValue.date,
            }),
          };

          // Create the base query
          let projectQueryExpense = query(
            collection(db, "expense"),
            where("owner", "==", user.uid),
            where("projectId", "==", value.projectId)
          );

          // Dynamically add filters from formattedFilterData
          Object.keys(formattedFilterData).forEach((key) => {
            projectQueryExpense = query(
              projectQueryExpense,
              where(key, "==", formattedFilterData[key])
            );
          });

          // Get the filtered documents
          const querySnapshot = await getDocs(projectQueryExpense);

          // // Process the documents
          if (!querySnapshot.empty) {
            filteredExpense = querySnapshot.docs.map((doc) => {
              return doc.data() as expenseType;
            });
          }

          resolve({
            filteredExpense,
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
  },
  extraReducers: (builder) => {
    builder.addCase(getUserProjectExpense.pending, (state, _action) => {
      state.pageLoading = true;
      state.dataTableLoader = true;
    });

    builder.addCase(getUserProjectExpense.fulfilled, (state, action) => {
      state.pageLoading = false;
      state.expense = action.payload.dailyExpense as expenseType[] | [];
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
export const { setProjectDetailsOpenFilterDrawer } =
  getProjectDetailsSlice.actions;
