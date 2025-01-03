// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
import { expenseType, projectOptionsType } from "@/store/features/DailyExpense";
import { RootState } from "@/store/store";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { FC } from "react";
import AddExpenseForm from "../AddExpenseDrawer/AddExpenseForm";
import { setEditDrawerOpen } from "@/store/features/EditDeleteExpense";
import { CircularProgress } from "@mui/material";

import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

interface EditDialogProps {
  editDialogOpen: boolean;
  dispatch: ThunkDispatch<RootState, undefined, Action>;
  expense: expenseType;
  editExpenseCurrentProject: { id: string; name: string };
  projectOptions: projectOptionsType[];
  editInfoLoad: boolean;
  // isDailyExpense: boolean;
}

const EditDialog: FC<EditDialogProps> = ({
  editDialogOpen,
  dispatch,
  expense,
  editExpenseCurrentProject,
  projectOptions,
  editInfoLoad,
  // isDailyExpense,
}) => {
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  return (
    // <Dialog
    //   open={editDialogOpen}
    //   onOpenChange={() =>
    //     dispatch(
    //       setEditDrawerOpen({
    //         id: "",
    //         open: false,
    //         dailyExpenseOrNot: false,
    //       })
    //     )
    //   }
    // >
    //   <DialogContent className="sm:max-w-[425px]" style={{ width: "100vw" }}>
    //     <DialogHeader>
    //       <DialogTitle>EditExpense</DialogTitle>
    //       {/* <DialogDescription>
    //         Make changes to your profile here. Click save when you're done.
    //       </DialogDescription> */}
    //     </DialogHeader>
    //     <div className="grid gap-4 py-4">
    //       {editInfoLoad ? (
    //         <CircularProgress />
    //       ) : (
    //         <AddExpenseForm
    //           dispatch={dispatch}
    //           projectOptions={projectOptions}
    //           expense={expense}
    //           editForm={true}
    //           editExpenseCurrentProject={editExpenseCurrentProject}
    //         />
    //       )}
    //     </div>
    //     {/* <DialogFooter>
    //       <Button type="submit">Save </Button>
    //     </DialogFooter> */}
    //   </DialogContent>
    // </Dialog>
    <Dialog
      fullScreen={fullScreen}
      style={{ height: "max-content" }}
      open={editDialogOpen}
      onClose={() =>
        dispatch(
          setEditDrawerOpen({
            id: "",
            open: false,
            dailyExpenseOrNot: false,
          })
        )
      }
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title" style={{marginBottom:"0rem"}}>{"Edit Expense"}</DialogTitle>
      {/* <DialogContent> */}
      {/* <DialogContentText> */}
      <div className="grid gap-4 py-4">
        {editInfoLoad ? (
          <CircularProgress />
        ) : (
          <AddExpenseForm
            dispatch={dispatch}
            projectOptions={projectOptions}
            expense={expense}
            editForm={true}
            editExpenseCurrentProject={editExpenseCurrentProject}
          />
        )}
      </div>
      {/* </DialogContentText> */}
      {/* </DialogContent> */}
      {/* <DialogActions>
        <Button
          onClick={() =>
            dispatch(
              setEditDrawerOpen({
                id: "",
                open: false,
                dailyExpenseOrNot: false,
              })
            )
          }
          autoFocus
        >
          Close
        </Button>
      </DialogActions> */}
    </Dialog>
  );
};

export default EditDialog;
