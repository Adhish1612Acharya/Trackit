import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { expenseType } from "./DailyExpense";
import { auth, db } from "@/firebaseconfig";
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { RootState } from "../store";
import constructionRoles from "@/filterData/contructionRolesData";
import paymentTypes from "@/filterData/paymentFilters";
import { v4 as uuidv4 } from "uuid";

export interface allProjectContributerType {
  id: string;
  miscellaneous: boolean;
  miscellaneousId: string;
  miscellaneousRole: string;
  name: string;
}

interface initialStateType {
  editDrawerOpen: boolean;
  editInfoLoad: boolean;
  editFuncLoad: boolean;
  expenseInfo: expenseType;
  expenseId: string;
  dailyExpense: boolean;
  deleteFuncLoad: boolean;
  deleteConformationDrawerOpen: boolean;
  miscellaneuosInput: boolean;
  editProjectOptions: { id: string; name: string }[];
  currrentProject: { id: string; name: string };
  allProjectMiscContributer: allProjectContributerType[];
}

interface getExpenseDetailsResponseType {
  expenseDetails: expenseType;
  projectOptions: { id: string; name: string }[];
  userAllProjectMiscContributers: allProjectContributerType[];
}

interface editExpenseDetailsResponseType {
  editedExpense: expenseType;
}

interface deleteExpenseDetailsResponseType {
  deleteExpenseId: string;
}

export interface editedFormValueType {
  date: Date | string;
  amount: number;
  reason: string;
  projectId: string;
  paidToId: string;
  paymentModeId: string;
  miscellaneousPaidToRole: string;
  miscellaneuosPaidToId: string;
  miscellaneuosPaidToName: string;
  billImage: Promise<string> | string;
}

export interface contributer {
  id: string;
  miscellaneous: boolean;
  miscellaneousId: string;
  miscellaneousRole: string;
  name: string;
}

const initialState: initialStateType = {
  editDrawerOpen: false,
  editInfoLoad: true,
  editFuncLoad: false,
  expenseInfo: {
    expenseId: "",
    date: "",
    amount: -1,
    paidToId: "",
    paidToName: "",
    paymentModeId: "",
    paymentModeName: "",
    projectId: "",
    projectTitle: "",
    reason: "",
    miscellaneous: false,
    miscellaneousPaidToRole: "",
    miscellaneuosPaidToId: "",
    miscellaneuosPaidToName: "",
    billImage: "",
    owner:""
  },
  expenseId: "",
  dailyExpense: false,
  deleteFuncLoad: false,
  deleteConformationDrawerOpen: false,
  miscellaneuosInput: false,
  currrentProject: { id: "", name: "" },
  editProjectOptions: [],
  allProjectMiscContributer: [],
};

export const getExpenseDetails = createAsyncThunk<
  getExpenseDetailsResponseType,
  string,
  { rejectValue: string }
>("/expense-details", async (id: string, _thunkAPI) => {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userProjectsCollectionRef = collection(db, "projects");

          const userProjectsRefQuery = query(
            userProjectsCollectionRef,
            where("owner", "==", user.uid)
          );

          const userProjectsSnapShot = await getDocs(userProjectsRefQuery);

          const userProjectsMiscContributers: allProjectContributerType[][] =
            userProjectsSnapShot.docs.map((doc) => {
              const project = doc.data();

              const projectContributers = project.contributers;

              const miscContributer: allProjectContributerType[] =
                projectContributers.filter(
                  (eachContributer: allProjectContributerType) => {
                    return eachContributer.miscellaneous === true;
                  }
                );

              return miscContributer;
            });

          const userAllProjectsMiscContributers =
            userProjectsMiscContributers.flatMap((project) => {
              return project;
            });

          const normalizeString = (str: string): string => {
            return str.trim().toLowerCase().replace(/\s+/g, "");
          };

          const filteredDuplicateMiscbutersContri: allProjectContributerType[] =
            userAllProjectsMiscContributers.filter((item, index, self) => {
              const normalizeName = normalizeString(item.name);
              const normalizeRole = normalizeString(item.miscellaneousRole);

              const uniqueIdx = self.findIndex((each) => {
                return (
                  normalizeString(each.name) === normalizeName &&
                  normalizeString(each.miscellaneousRole) === normalizeRole
                );
              });

              return index === uniqueIdx;
            });

          const docRef = doc(db, "expense", id);
          const document = await getDoc(docRef);

          if (!document.exists()) {
            return reject("Expense details not found.");
          }

          const expenseDetails = document.data() as expenseType;
          expenseDetails.expenseId = document.id;

          const userDocRef = doc(db, "users", user.uid);

          const userDocSnap = await getDoc(userDocRef);

          const formattedDate = (
            expenseDetails.date instanceof Timestamp
              ? expenseDetails.date.toDate()
              : (expenseDetails.date as Date)
          )
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .split("/")
            .join("-");

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

export const editExpenseDetails = createAsyncThunk<
  editExpenseDetailsResponseType,
  { editFormValue: editedFormValueType },
  { rejectValue: string }
>("/edit/expense", async ({ editFormValue }, thunkAPI) => {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const state = thunkAPI.getState() as RootState;

          let contrubutersLists = [];

          let contributerData;

          let userProjects: {
            id: string;
            name: string;
          }[] = [];

          const normalizeString = (str: string): string => {
            return str.trim().toLowerCase().replace(/\s+/g, "");
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

          //To find project Title/

          if (
            editFormValue.projectId !==
            state.editDeleteExpense.currrentProject.id
          ) {
            const docRef = doc(db, "users", user.uid);

            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              userProjects = docSnap.data().projects;
            } else {
              reject("User Not Found");
            }
          }

          const findProjectTitle = (id: string) => {
            return userProjects.filter((p) => {
              return p.id === id;
            });
          };

          // const checkMiscellaneousSame = () => {
          //   return (
          //     normalizeString(
          //       state.editDeleteExpense.expenseInfo.miscellaneuosPaidToName
          //     ) ===
          //       normalizeString(
          //         editFormValue.miscellaneuosPaidToName as string
          //       ) &&
          //     normalizeString(
          //       state.editDeleteExpense.expenseInfo.miscellaneousPaidToRole
          //     ) ===
          //       normalizeString(editFormValue.miscellaneousPaidToRole as string)
          //   );
          // };

          //

          // ----------------------Checking Contributer already exists----------------------------/

          const projectDocRef = doc(db, "projects", editFormValue.projectId);
          const projectDoc = await getDoc(projectDocRef);

          const projectData = projectDoc.data();

          contrubutersLists = projectData ? projectData.contributers : [];

          const contributerExists: contributer[] = contrubutersLists.filter(
            (contributer: contributer) =>
              editFormValue.paidToId != "51"
                ? contributer.id === editFormValue.paidToId
                : normalizeString(contributer.name) ===
                    normalizeString(
                      editFormValue.miscellaneuosPaidToName as string
                    ) &&
                  normalizeString(contributer.miscellaneousRole) ===
                    normalizeString(
                      editFormValue.miscellaneousPaidToRole as string
                    )
          );

         const findMiscContributerId = () => {
            const matchedMiscContributer =
              state.editDeleteExpense.allProjectMiscContributer.filter(
                (eachContributer) => {
                  return (
                    normalizeString(eachContributer.name) ===
                      normalizeString(editFormValue.miscellaneuosPaidToName) &&
                    normalizeString(eachContributer.miscellaneousRole) ===
                      normalizeString(editFormValue.miscellaneousPaidToRole)
                  );
                }
              );
            if (matchedMiscContributer.length > 0) {
              return matchedMiscContributer[0].miscellaneousId;
            } else {
              return uuidv4();
            }
          };

            const miscellaneousId=findMiscContributerId();

          if (contributerExists.length == 0) {
            if (state.editDeleteExpense.miscellaneuosInput) {
              contributerData = {
                id: editFormValue.paidToId,
                name: editFormValue.miscellaneuosPaidToName as string,
                miscellaneous: true,
                miscellaneousRole:
                  editFormValue.miscellaneousPaidToRole as string,
                miscellaneousId: miscellaneousId,
              };
            } else {
              contributerData = {
                id: editFormValue.paidToId,
                name: findPaidToRoleName(editFormValue.paidToId)[0].name,
                miscellaneous: false,
                miscellaneousRole: "",
                miscellaneousId: "",
              };
            }
          }

          // -------------------***Checking Contributer already exists***-------------------------//

          const updatedFormValue:any= {
            date: new Date(editFormValue.date),
            amount: editFormValue.amount,
            paidToId: editFormValue.paidToId,
            paidToName: findPaidToRoleName(editFormValue.paidToId)[0].name,
            paymentModeId: editFormValue.paymentModeId,
            paymentModeName: findPaymentModeName(editFormValue.paymentModeId)[0]
              .name,
            projectId: editFormValue.projectId,
            projectTitle:
              editFormValue.projectId !==
              state.editDeleteExpense.currrentProject.id
                ? findProjectTitle(editFormValue.projectId)[0].name
                : state.editDeleteExpense.expenseInfo?.projectTitle,
            reason: editFormValue.reason,
            miscellaneous: state.editDeleteExpense.miscellaneuosInput,
            miscellaneuosPaidToName: state.editDeleteExpense.miscellaneuosInput
              ? editFormValue.miscellaneuosPaidToName
              : "",
            miscellaneousPaidToRole: state.editDeleteExpense.miscellaneuosInput
              ? editFormValue.miscellaneousPaidToRole
              : "",
            miscellaneuosPaidToId: state.editDeleteExpense.miscellaneuosInput
              ? miscellaneousId
              : "",
            billImage: editFormValue.billImage ? editFormValue.billImage as string : "",
            owner:user.uid
            // (checkMiscellaneousSame() && contributerExists.length > 0) ||
            //   (!checkMiscellaneousSame() && contributerExists.length > 0)
            //   ? contributerExists[0].miscellaneousId
            //   : // state.editDeleteExpense.expenseInfo.miscellaneuosPaidToId
            //   checkMiscellaneousSame() && contributerExists.length == 0
            //   ? state.editDeleteExpense.expenseInfo.miscellaneuosPaidToId
            //     : uuidv4()
            //   : "",
          };

          const expenseDocRef = doc(
            db,
            "expense",
            state.editDeleteExpense.expenseId
          );

          await updateDoc(expenseDocRef, updatedFormValue);

          updatedFormValue.expenseId  = state.editDeleteExpense.expenseId;
          updatedFormValue.date =String(editFormValue.date);

          if (
            editFormValue.projectId !==
            state.editDeleteExpense.currrentProject.id
          ) {
            const batch = writeBatch(db);

            // Reference to the first document
            const expenseDocRef1 = doc(
              db,
              "projects",
              state.editDeleteExpense.currrentProject.id
            );

            // Reference to the second document
            const expenseDocRef2 = doc(db, "projects", editFormValue.projectId);

            // Update data for the first document
            batch.update(expenseDocRef1, {
              expenses: arrayRemove(state.editDeleteExpense.expenseId),
            });

            // Update data for the second document
            if (contributerExists.length === 0) {
              batch.update(expenseDocRef2, {
                expenses: arrayUnion(state.editDeleteExpense.expenseId),
                contributers: arrayUnion(contributerData),
              });
            } else {
              batch.update(expenseDocRef2, {
                expenses: arrayUnion(state.editDeleteExpense.expenseId),
              });
            }

            // Commit the batch
            await batch.commit();
          } else {
            if (contributerExists.length === 0) {
              const projectDocRef = doc(
                db,
                "projects",
                editFormValue.projectId
              );

              await updateDoc(projectDocRef, {
                contributers: arrayUnion(contributerData),
              });
            }
          }

          resolve({
            editedExpense: updatedFormValue,
          });
        } catch (err) {
          console.log(err);
          reject("Failed to edit expense details. Please try again.");
        }
      } else {
        reject("User Not Found");
      }
    });
  });
});

export const deleteExpenseDetails = createAsyncThunk<
  deleteExpenseDetailsResponseType,
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

const editDeleteExpenseSlice = createSlice({
  name: "editAndDeleteExpense",
  initialState,
  reducers: {
    setEditDrawerOpen: (
      state,
      action: PayloadAction<{
        id: string;
        open: boolean;
        dailyExpenseOrNot: boolean;
      }>
    ) => {
      if (action.payload.open === false) {
        state.allProjectMiscContributer = [];
      }
      state.editDrawerOpen = action.payload.open;
      state.expenseId = action.payload.id;
      state.dailyExpense = action.payload.dailyExpenseOrNot;
    },
    setDeleteConformationDrawerOpen: (
      state,
      action: PayloadAction<{ open: boolean; expenseId: string }>
    ) => {
      state.expenseId = action.payload.expenseId;
      state.deleteConformationDrawerOpen = action.payload.open;
    },
    setEditExpenseMiscellaneousInput: (state, action) => {
      state.miscellaneuosInput = action.payload;
    },
    setEditFuncLoad: (state, action: PayloadAction<boolean>) => {
      state.editFuncLoad = action.payload;
    },
    setExpenseBillImage: (state, action: PayloadAction<string>) => {
      state.expenseInfo.billImage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getExpenseDetails.pending, (state, _action) => {
      state.editInfoLoad = true;
    });

    builder.addCase(getExpenseDetails.fulfilled, (state, action) => {
      state.allProjectMiscContributer =
        action.payload.userAllProjectMiscContributers;
      state.miscellaneuosInput = action.payload.expenseDetails.miscellaneous;
      state.currrentProject = action.payload.projectOptions.filter(
        (p) => p.id === action.payload.expenseDetails.projectId
      )[0];
      state.editProjectOptions = action.payload.projectOptions;
      state.editInfoLoad = false;
      state.expenseInfo = action.payload.expenseDetails;
    });

    builder.addCase(getExpenseDetails.rejected, (state, action) => {
      state.editInfoLoad = false;
      toast.error(action.payload);
    });

    builder.addCase(editExpenseDetails.pending, (state, _action) => {
      state.editFuncLoad = true;
    });

    builder.addCase(editExpenseDetails.fulfilled, (state, action) => {
      state.expenseInfo = action.payload.editedExpense;
      state.allProjectMiscContributer = [];
      toast.success("Expense Edited successfully");
    });

    builder.addCase(editExpenseDetails.rejected, (state, action) => {
      toast.error(action.payload);
      state.editFuncLoad = false;
      state.editDrawerOpen = true;
    });

    builder.addCase(deleteExpenseDetails.pending, (state, _action) => {
      state.deleteFuncLoad = true;
    });

    builder.addCase(deleteExpenseDetails.fulfilled, (state, _action) => {
      toast.success("Expense Deleted");
      state.deleteFuncLoad = false;
      state.expenseId = "";
      state.deleteConformationDrawerOpen = false;
    });

    builder.addCase(deleteExpenseDetails.rejected, (state, action) => {
      state.deleteFuncLoad = false;
      state.deleteConformationDrawerOpen = false;
      toast.error(action.payload);
    });
  },
});

export default editDeleteExpenseSlice.reducer;

export const {
  setEditDrawerOpen,
  setDeleteConformationDrawerOpen,
  setEditExpenseMiscellaneousInput,
  setEditFuncLoad,
  setExpenseBillImage,
} = editDeleteExpenseSlice.actions;
