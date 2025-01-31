import { createAsyncThunk } from "@reduxjs/toolkit";
import { AddDailyExpenseResponse, FormValueType } from "./addDailyExpenseTypes";
import { auth, db } from "@/firebaseconfig";
import { RootState } from "@/store/store";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { AllProjectContributerType } from "@/store/features/EditDeleteExpense/Thunks/getExpenseDetails/getExpenseDetailsTypes";

import findMiscContributerId from "@/store/sharedUtils/findMiscContributerId";
import findProjectTitle from "@/store/sharedUtils/findProjectTitle";
import findPaidToRoleName from "@/store/sharedUtils/findPaidToRoleName";
import findPaymentModeName from "@/store/sharedUtils/findPaymentModeName";
import checkContributerExists from "@/store/sharedUtils/checkContributerExists";
import formatDate from "@/store/sharedUtils/formatDate";
import { ExpenseType } from "@/store/SharedTypes/sharedTypes";
import getUserAllMiscContributers from "@/store/sharedUtils/getUserAllMiscContributers";

const addDailyExpense = createAsyncThunk<
  AddDailyExpenseResponse,
  FormValueType,
  { rejectValue: string }
>("/addDailyExpense", async (value: FormValueType, thunkAPI) => {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const state = thunkAPI.getState() as RootState;

          // const allMiscContri=window.location.pathname==="/u/daily-expense"?state.addDailyExpense.userAllMiscContributers:state.getProjectExpense.userAllMiscContributers;

          let allMiscContri:AllProjectContributerType[]=[];

          if(state.addDailyExpense.miscellaneousInput){
           allMiscContri = await getUserAllMiscContributers(
              user.uid
            );
          }
         

          let filteredDuplicateMiscbutersContri: AllProjectContributerType[] =
          allMiscContri;

          const projectDocRef = doc(db, "projects", value.project);

          const projectDoc = await getDoc(projectDocRef);

          const projectData = projectDoc.data();

          const contributersLists = projectData ? projectData.contributers : [];

          const contributerExists = checkContributerExists(
            contributersLists,
            value.paidTo,
            value.miscellaneousPaidToName,
            value.miscellaneousPaidToRole
          );

          const projectName = findProjectTitle(
            value.project,
            state.addDailyExpense.projectsOptions
          );

          const paidToRoleName = findPaidToRoleName(value.paidTo);

          const paymentModeName = findPaymentModeName(value.paymentMode);

          let miscellaneousId ="";

          if(state.addDailyExpense.miscellaneousInput){ 
             miscellaneousId = findMiscContributerId(
              filteredDuplicateMiscbutersContri,
              value.miscellaneousPaidToName,
              value.miscellaneousPaidToRole
            );
          }

         

          const expenseDocumentData: any = {
            date: new Date(value.date),
            amount: Number(value.amount),
            reason: value.reason,
            paidToId: value.paidTo,
            paidToName: paidToRoleName[0].name,
            paymentModeId: value.paymentMode,
            paymentModeName: paymentModeName[0].name,
            projectId: value.project,
            projectTitle: projectName[0].name,
            miscellaneous: state.addDailyExpense.miscellaneousInput,
            miscellaneuosPaidToId: state.addDailyExpense.miscellaneousInput
              ? miscellaneousId
              : "",
            miscellaneuosPaidToName: state.addDailyExpense.miscellaneousInput
              ? value.miscellaneousPaidToName
              : "",
            miscellaneousPaidToRole: state.addDailyExpense.miscellaneousInput
              ? value.miscellaneousPaidToRole
              : "",
            owner: user.uid,
            billImage: value.billImage ? value.billImage : "",
          };

          const newExpense = await addDoc(
            collection(db, "expense"),
            expenseDocumentData
          );

          let data=null;
          if (contributerExists.length == 0) {
         
            if (expenseDocumentData.miscellaneous) {
              data = {
                id: value.paidTo,
                name: expenseDocumentData.miscellaneuosPaidToName as string,
                miscellaneous: true,
                miscellaneousRole:
                  expenseDocumentData.miscellaneousPaidToRole as string,
                miscellaneousId: miscellaneousId,
              };
            } else {
              data = {
                id: value.paidTo,
                name: paidToRoleName[0].name,
                miscellaneous: false,
                miscellaneousRole: "",
                miscellaneousId: "",
              };
            }

            await updateDoc(projectDocRef, {
              expenses: arrayUnion(newExpense.id),
              contributers: arrayUnion(data),
            });
          } else {
            await updateDoc(projectDocRef, {
              expenses: arrayUnion(newExpense.id),
            });
          }

          const todayDate = new Date();

          const formattedTodayDate = formatDate(todayDate);

          const formattedExpDocDate = formatDate(new Date(value.date));

          let pushTodayExpense: ExpenseType | null = null;

          if (formattedExpDocDate === formattedTodayDate) {
            (expenseDocumentData.date as any) = formattedExpDocDate;
            (pushTodayExpense as any) = expenseDocumentData;
          }

          expenseDocumentData.date = formattedExpDocDate;

          expenseDocumentData.expenseId = newExpense.id;

          // const newMiscContri=state.addDailyExpense.miscellaneousInput?data:null;

          resolve({
            expenseId: newExpense.id,
            todayExpense: pushTodayExpense,
            newAddedExpense: expenseDocumentData,
            // newMiscContri:newMiscContri
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

export default addDailyExpense;
