import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  deleteExpenseDetails,
  setDeleteConformationDrawerOpen,
} from "@/store/features/EditDeleteExpense";
import { RootState } from "@/store/store";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { FC } from "react";
import { Loader2 } from "lucide-react";
import { setDeletedExpenseInfo } from "@/store/features/DailyExpense";
import { setDeletedProjectExpenseInfo } from "@/store/features/ProjectDetails";
import { deleteProject, setProjectDeleteAlertOpen } from "@/store/features/GetProjects";

interface conformationAlertDialogType {
  openAlertDialog: boolean;
  dispatch: ThunkDispatch<RootState, undefined, Action>;
  expenseId: string;
  deleteFuncLoad: boolean;
  dailyExpensePage: boolean;
  isDeleteProject?:boolean;
}

const ConformationAlertDialog: FC<conformationAlertDialogType> = ({
  openAlertDialog,
  dispatch,
  expenseId,
  deleteFuncLoad,
  dailyExpensePage,
  isDeleteProject
}) => {
  return (
    <AlertDialog
      open={openAlertDialog}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the expense.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {deleteFuncLoad ? (
            <Button disabled>
              <Loader2 className="animate-spin" />
              Please wait
            </Button>
          ) : (
            <>
              <AlertDialogCancel
                onClick={() => {
                  isDeleteProject?dispatch(setProjectDeleteAlertOpen(false)):
                  dispatch(
                    setDeleteConformationDrawerOpen({
                      open: false,
                      expenseId: "",
                    })
                  );
                }}
              >
                No
              </AlertDialogCancel>
              <AlertDialogAction
                style={{ backgroundColor: "red" }}
                onClick={() => {
                  isDeleteProject?dispatch(deleteProject()):
                  dispatch(deleteExpenseDetails({ expenseId })).then(() => {
                    dailyExpensePage ?
                      dispatch(setDeletedExpenseInfo(expenseId))
                      : dispatch(setDeletedProjectExpenseInfo(expenseId));
                  });
                }}
              >
                Yes
              </AlertDialogAction>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConformationAlertDialog;
