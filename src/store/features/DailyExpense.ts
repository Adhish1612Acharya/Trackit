import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "@/firebaseconfig";
import { toast } from "react-toastify";
import { RootState } from "../store";
import constructionRoles from "@/filterData/contructionRolesData";
import paymentTypes from "@/filterData/paymentFilters";
import { v4 as uuidv4 } from "uuid";

interface GetUserDailyExpenseResponse {
  userData: any; // Replace `any` with the proper type of your user data if known
  dailyExpense: formValueType[] | []; // Replace `any` with the correct type for expense data
}

export interface formValueType {
  date: Date | string;
  amount: number | string;
  reason: string;
  paidTo: string;
  paymentMode: string;
  project: string;
  miscellaneousPaidToName?: string;
  miscellaneousPaidToRole?: string;
}

export interface expenseType {
  date: string;
  amount: string;
  paidToId: string;
  paidToName: string;
  paymentModeId: string;
  paymentModeName: string;
  projectId: string;
  projectTitle: string;
  reason: string;
  miscellaneous: boolean;
  miscellaneousPaidToRole: string;
  miscellaneuosPaidToId: string;
  miscellaneuosPaidToName: string;
}

export interface filterValueType {
  paidToId: string;
  paymentModeId: string;
  projectId: string;
}

export interface projectOptionsType {
  id: string;
  name: string;
}

interface addProjectFormValueType {
  title: string;
  description: string;
  // image?: string;
  budget: string;
}

interface initialStateType {
  // formValue: formValueType;
  projectsOptions: projectOptionsType[];
  expense: expenseType[];
  openAddProjectDrawer: boolean;
  pageLoading: boolean;
  openAddExpenseDrawer: boolean;
  miscellaneousInput: boolean;
  openFilterDrawer: boolean;
  filterProjects: projectOptionsType[];
  addExpenseBtnLoad: boolean;
  addProjectBtnLoad: boolean;
  addFilterBtnLoad: boolean;
  dataTableLoader: boolean;
}

const initialState: initialStateType = {
  projectsOptions: [],
  filterProjects: [],
  openAddExpenseDrawer: false,

  openAddProjectDrawer: false,

  pageLoading: true,
  expense: [],
  miscellaneousInput: false,
  openFilterDrawer: false,
  addExpenseBtnLoad: false,
  addProjectBtnLoad: false,
  addFilterBtnLoad: false,
  dataTableLoader: false,
};

export const getUserDailyExpense = createAsyncThunk<
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
          // Format the date into "DD-MM-YYYY"
          const todayDate = new Date();

          const formattedDate = todayDate
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .split("/")
            .join("-");

          // Query for daily expenses
          const userExpenseQuery = query(
            collection(db, "expense"),
            where("owner", "==", user.uid),
            where("date", "==", formattedDate)
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

interface addDailyExpenseResponse {
  expenseId: string;
  todayExpense: expenseType | null;
}

export const addDailyExpense = createAsyncThunk<
  addDailyExpenseResponse,
  formValueType,
  { rejectValue: string }
>("/addDailyExpense", async (value: formValueType, thunkAPI) => {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const state = thunkAPI.getState() as RootState;

          const findProjectTitle = (id: string) => {
            return state.addDailyExpense.projectsOptions.filter((p) => {
              return p.id === id;
            });
          };

          const findPaidToRoleName = (id: string) => {
            return constructionRoles.filter((role) => {
              return String(role.id) === id;
            });
          };

          const findPaymentModeName = (id: string) => {
            return paymentTypes.filter((role) => {
              return String(role.id) === id;
            });
          };

          const projectName = findProjectTitle(value.project);

          const paidToRoleName = findPaidToRoleName(value.paidTo);

          const paymentModeName = findPaymentModeName(value.paymentMode);

          const formattedDate = (value.date as Date)
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .split("/")
            .join("-");

          const expenseDocumentData = {
            date: formattedDate,
            amount: value.amount,
            reason: value.reason,
            paidToId: value.paidTo, // { id: value.paidTo, name: paidToRoleName[0].name },
            paidToName: paidToRoleName[0].name,
            paymentModeId: value.paymentMode, // { id: value.paidTo, name: paidToRoleName[0].name },
            paymentModeName: paymentModeName[0].name,
            projectId: value.project,
            projectTitle: projectName[0].name,
            miscellaneous:
              value.miscellaneousPaidToName !== "null" &&
              value.miscellaneousPaidToRole !== "null"
                ? true
                : false,
            miscellaneuosPaidToId:
              value.miscellaneousPaidToName !== "null" &&
              value.miscellaneousPaidToRole !== "null"
                ? uuidv4()
                : "",
            miscellaneuosPaidToName: value.miscellaneousPaidToName,
            miscellaneousPaidToRole: value.miscellaneousPaidToRole,
            owner: user.uid,
          };

          const newExpense = await addDoc(
            collection(db, "expense"),
            expenseDocumentData
          );

          const projectDocRef = doc(db, "projects", value.project);

          const projectDoc = await getDoc(projectDocRef);

          const projectData = projectDoc.data();

          const contrubutersLists = projectData ? projectData.contributers : [];

          const contributerExists = contrubutersLists.some(
            (contributer: any) => contributer.id === value.paidTo
          );

          if (expenseDocumentData.miscellaneous) {
            const data = {
              id: value.paidTo,
              name: expenseDocumentData.miscellaneuosPaidToName as string,
              miscellaneous: true,
              miscellaneousRole:
                expenseDocumentData.miscellaneousPaidToRole as string,
              miscellaneousId: expenseDocumentData.miscellaneuosPaidToId,
            };
            await updateDoc(projectDocRef, {
              expenses: arrayUnion(newExpense.id), // Add the new projectId to the 'projects' array
              contributers: arrayUnion(data),
            });
          } else {
            if (!contributerExists) {
              const data: any = {
                id: value.paidTo,
                name: paidToRoleName[0].name,
                miscellaneous: false,
                miscellaneousRole: null,
                miscellaneousId: null,
              };
              await updateDoc(projectDocRef, {
                expenses: arrayUnion(newExpense.id), // Add the new projectId to the 'projects' array
                contributers: arrayUnion(data),
              });
            } else {
              await updateDoc(projectDocRef, {
                expenses: arrayUnion(newExpense.id), // Add the new projectId to the 'projects' array
              });
            }
          }

          const todayDate = new Date();
          const formattedTodayDate = todayDate
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .split("/")
            .join("-");

          let pushTodayExpense: expenseType | null = null;

          if (expenseDocumentData.date === formattedTodayDate) {
            pushTodayExpense = expenseDocumentData as expenseType;
          }

          resolve({
            expenseId: newExpense.id,
            todayExpense: pushTodayExpense,
          });
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

interface addProjectResponse {
  message: string;
  newProject: any;
}

export const addProject = createAsyncThunk<
  addProjectResponse,
  addProjectFormValueType,
  { rejectValue: string }
>("/addProject", async (value: addProjectFormValueType, thunkAPI) => {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const projectFormDocument = {
            title: value.title,
            description: value.description,
            image: "",
            budget: value.budget,
            expenses: [],
            owner: user.uid,
            contributers: [],
          };
          const addedProject = await addDoc(
            collection(db, "projects"),
            projectFormDocument
          );

          const userDocRef = doc(db, "users", user.uid);

          await updateDoc(userDocRef, {
            projects: arrayUnion({ id: addedProject.id, name: value.title }), // Add the new projectId to the 'projects' array
          });

          thunkAPI.dispatch(
            addProjectOptions({ id: addedProject.id, name: value.title })
          );

          resolve({
            message: "Project Added",
            newProject: { id: addedProject.id, name: value.title },
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
          reject();
        }
      } else {
        reject(new Error("User not authenticated"));
      }
    });
  });
});

interface filterData {
  filteredExpense: expenseType[] | [];
}

export const applyFilter = createAsyncThunk<
  filterData,
  filterValueType,
  { rejectValue: string }
>("/applyFilter", async (filterValue: filterValueType, _thunkAPI) => {
  let filteredExpense: expenseType[] | [] = [];
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const formattedFilterData: any = {
            ...(filterValue.paidToId !== "52" && {
              paidToId: filterValue.paidToId,
            }),
            ...(filterValue.paymentModeId !== "51" && {
              paymentModeId: filterValue.paymentModeId,
            }),
            ...(filterValue.projectId !== "-1" && {
              projectId: filterValue.projectId,
            }),
          };

          // Format the date into "DD-MM-YYYY"
          const todayDate = new Date();

          const formattedDate = todayDate
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .split("/")
            .join("-");

          // Create the base query
          let projectQueryExpense = query(
            collection(db, "expense"),
            where("owner", "==", user.uid),
            where("date", "==", formattedDate)
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


          // Process the documents
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

const dailyExpenseSlice = createSlice({
  name: "dailyExpense",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      const argu = action.payload.filterName as keyof initialStateType;
      state[argu] = action.payload.filterValue;
    },
    setOpenAddProjectDrawer: (state, action) => {
      state.openAddProjectDrawer = action.payload;
    },
    setOpenAddExpenseDrawer: (state, action) => {
      state.openAddExpenseDrawer = action.payload;
    },

    addProjectOptions: (state, action) => {
      state.projectsOptions.push(action.payload);
    },
    initializeProjectOptions: (state, action) => {
      state.projectsOptions = action.payload;
    },

    setMiscellaneousInput: (state, action) => {
      state.miscellaneousInput = action.payload;
    },
    setOpenFilterDrawer: (state, action) => {
      state.openFilterDrawer = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserDailyExpense.pending, (state, _action) => {
      state.pageLoading = true;
      state.dataTableLoader = true;
    });

    builder.addCase(getUserDailyExpense.fulfilled, (state, action) => {
      state.pageLoading = false;
      state.expense = action.payload.dailyExpense as expenseType[] | [];
      state.projectsOptions = action.payload.userData.projects;
      state.filterProjects = [...action.payload.userData.projects];
      state.filterProjects.push({ id: "-1", name: "All" });
      state.dataTableLoader = false;
    });

    builder.addCase(getUserDailyExpense.rejected, (state, _action) => {
      state.pageLoading = false;
      toast.warn("Some Error occurred please try again"); // Add a toast notification
    });

    builder.addCase(addDailyExpense.pending, (state, _action) => {
      state.addExpenseBtnLoad = true;
    });

    builder.addCase(addDailyExpense.fulfilled, (state, action) => {
      toast.success("Expense Added");
      state.addExpenseBtnLoad = false;

      if (action.payload.todayExpense !== null) {
        state.expense.push(action.payload.todayExpense);
      }
    });

    builder.addCase(addDailyExpense.rejected, (state, action) => {
      toast.warn(action.payload);
      state.addExpenseBtnLoad = false;
    });

    builder.addCase(addProject.pending, (state, _action) => {
      state.addProjectBtnLoad = true;
    });

    builder.addCase(addProject.fulfilled, (state, action) => {
      toast.success("Project Added");
      const allOption = state.filterProjects.pop();
      state.filterProjects.push(action.payload.newProject);
      state.filterProjects.push(allOption as projectOptionsType);
      state.addProjectBtnLoad = false;
      state.openAddProjectDrawer = false;
    });

    builder.addCase(addProject.rejected, (state, action) => {
      toast.success(action.payload);
      state.addProjectBtnLoad = false;
      window.location.href = "/";
    });

    builder.addCase(applyFilter.pending, (state, _action) => {
      state.dataTableLoader = true;
      state.addFilterBtnLoad = true;
    });

    builder.addCase(applyFilter.fulfilled, (state, action) => {
      state.expense = action.payload.filteredExpense;
      state.dataTableLoader = false;
      state.addFilterBtnLoad = false;
      state.openFilterDrawer = false;
    });

    builder.addCase(applyFilter.rejected, (state, _action) => {
      state.dataTableLoader = false;
      state.addFilterBtnLoad = false;
      state.openFilterDrawer = false;
      toast.error("Some Error Occured");
    });

    // builder.addCase(getUserProjects.fulfilled, (state, action) => {
    //   state.filterProjects = action.payload;
    // });
  },
});

export default dailyExpenseSlice.reducer;

export const {
  setFilters,
  setOpenAddProjectDrawer,
  setOpenAddExpenseDrawer,
  addProjectOptions,
  initializeProjectOptions,
  setMiscellaneousInput,
  setOpenFilterDrawer,
} = dailyExpenseSlice.actions;
