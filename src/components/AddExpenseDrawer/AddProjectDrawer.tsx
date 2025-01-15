import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FC } from "react";
import {
  setOpenAddExpenseDrawer,
  setOpenAddProjectDrawer as dailyExpenseAddProjectDrawer,
} from "@/store/features/DailyExpense";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import AddProjectForm from "./AddProjectForm";
import { setOpenAddProjectDrawer } from "@/store/features/GetProjects";

interface addProjectDrawerProps {
  open: boolean;
  dispatch: ThunkDispatch<RootState, undefined, Action>;
  addProjectBtnLoad:boolean;
  isDailyExpensePage:boolean;
}

const AddProjectDrawer: FC<addProjectDrawerProps> = ({ open, dispatch ,addProjectBtnLoad,isDailyExpensePage}) => {

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        isDailyExpensePage? ()=>{dispatch(setOpenAddExpenseDrawer(true));
          dispatch(dailyExpenseAddProjectDrawer(false));}
        :dispatch(setOpenAddProjectDrawer(false))
      }}
    >
      <DialogContent className="max-w-md mx-auto p-6">
        <DialogHeader>
          <DialogTitle>Add Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <AddProjectForm dispatch={dispatch} addProjectBtnLoad={addProjectBtnLoad} isDailyExpensePage={isDailyExpensePage}/>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectDrawer;
