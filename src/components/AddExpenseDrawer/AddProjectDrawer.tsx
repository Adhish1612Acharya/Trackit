import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FC } from "react";
import {
  setOpenAddExpenseDrawer,
  setOpenAddProjectDrawer,
} from "@/store/features/DailyExpense";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import AddProjectForm from "./AddProjectForm";

interface addProjectDrawerProps {
  open: boolean;
  dispatch: ThunkDispatch<RootState, undefined, Action>;
}

const AddProjectDrawer: FC<addProjectDrawerProps> = ({ open, dispatch }) => {

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
         dispatch(setOpenAddExpenseDrawer(true))
        dispatch(setOpenAddProjectDrawer(false));
      }}
    >
      <DialogContent className="max-w-md mx-auto p-6">
        <DialogHeader>
          <DialogTitle>Add Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <AddProjectForm dispatch={dispatch} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectDrawer;
