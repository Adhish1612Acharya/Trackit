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
import { FC } from "react";
import { Loader2 } from "lucide-react";
import { setDeletedProjectExpenseInfo } from "@/store/features/ProjectDetails/ProjectDetailsSlice";
import { conformationAlertDialogType } from "./ConformationAlertDialogTypes";
import { setProjectDeleteAlertOpen } from "@/store/features/GetProjects/GetProjectsSlice";
import { setDeleteConformationDrawerOpen } from "@/store/features/EditDeleteExpense/EditDeleteExpenseSlice";
import deleteProject from "@/store/features/GetProjects/Thunks/deleteProject/deleteProject";
import { deleteExpenseDetails } from "@/store/features/EditDeleteExpense/Thunks/deleteExpenseDetails/deleteExpenseDetails";
import { setDeletedExpenseInfo } from "@/store/features/DailyExpense/DailyExpenseSlice";

const ConformationAlertDialog: FC<conformationAlertDialogType> = ({
  openAlertDialog,
  dispatch,
  expenseId,
  deleteFuncLoad,
  dailyExpensePage,
  isDeleteProject,
}) => {
  return (
    <AlertDialog open={openAlertDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the{" "}
            {isDeleteProject
              ? "project and the expense Related to it"
              : "expense"}
            .
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
                  isDeleteProject
                    ? dispatch(setProjectDeleteAlertOpen(false))
                    : dispatch(
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
                  isDeleteProject
                    ? dispatch(deleteProject())
                    : dispatch(deleteExpenseDetails({ expenseId })).then(() => {
                        dailyExpensePage
                          ? dispatch(setDeletedExpenseInfo(expenseId))
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
