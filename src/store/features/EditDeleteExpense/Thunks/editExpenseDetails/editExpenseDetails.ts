import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  Contributer,
  EditedFormValueType,
  EditExpenseDetailsResponseType,
} from "./editExpenseDetailsTypes";
import { RootState } from "@/store/store";
import {
  doc,
  getDoc,
  updateDoc,
  writeBatch,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { auth, db } from "@/firebaseconfig";
import findMiscContributerId from "@/store/sharedUtils/findMiscContributerId";
import checkContributerExists from "@/store/sharedUtils/checkContributerExists";
import findPaidToRoleName from "@/store/sharedUtils/findPaidToRoleName";
import findPaymentModeName from "@/store/sharedUtils/findPaymentModeName";
import findProjectTitle from "@/store/sharedUtils/findProjectTitle";
import checkAndRemoveContributer from "../utils/removeContributer";

const editExpenseDetails = createAsyncThunk<
  EditExpenseDetailsResponseType,
  { editFormValue: EditedFormValueType },
  { rejectValue: string }
>("/edit/expense", async ({ editFormValue }, thunkAPI) => {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const state = thunkAPI.getState() as RootState;

          let contrubutersLists: Contributer[] = [];

          let contributerData;

          let userProjects: {
            id: string;
            name: string;
          }[] = [];

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

          const projectDocRef = doc(db, "projects", editFormValue.projectId);
          const projectDoc = await getDoc(projectDocRef);

          const projectData = projectDoc.data();

          contrubutersLists = projectData ? projectData.contributers : [];

          const contributerExists = checkContributerExists(
            contrubutersLists,
            editFormValue.paidToId,
            editFormValue.miscellaneuosPaidToName,
            editFormValue.miscellaneousPaidToRole
          );

          let miscellaneousId = "";

          if (state.editDeleteExpense.miscellaneuosInput) {
            miscellaneousId = findMiscContributerId(
              state.editDeleteExpense.allProjectMiscContributer,
              editFormValue.miscellaneuosPaidToName,
              editFormValue.miscellaneousPaidToRole
            );
          }

          const updatedFormValue: any = {
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
                ? findProjectTitle(editFormValue.projectId, userProjects)[0]
                    .name
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
            billImage: editFormValue.billImage
              ? (editFormValue.billImage as string)
              : "",
            owner: user.uid,
          };

          const expenseDocRef = doc(
            db,
            "expense",
            state.editDeleteExpense.expenseId
          );

          await updateDoc(expenseDocRef, updatedFormValue);

          updatedFormValue.expenseId = state.editDeleteExpense.expenseId;
          updatedFormValue.date = String(editFormValue.date);

          const contributerIdOfUneditedExpenseInfo = state.editDeleteExpense
            .expenseInfo.miscellaneous
            ? state.editDeleteExpense.expenseInfo.miscellaneuosPaidToId
            : state.editDeleteExpense.expenseInfo.paidToId;

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

            // Update data for the first document
            batch.update(expenseDocRef1, {
              expenses: arrayRemove(state.editDeleteExpense.expenseId),
            });

            // Reference to the second document
            const expenseDocRef2 = doc(db, "projects", editFormValue.projectId);

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

          await checkAndRemoveContributer(
            user.uid,
            state.editDeleteExpense.currrentProject.id,
            contributerIdOfUneditedExpenseInfo,
            state.editDeleteExpense.expenseInfo.miscellaneous
          );

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

export default editExpenseDetails;
