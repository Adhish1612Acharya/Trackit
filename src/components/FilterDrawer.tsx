import { FC } from "react";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FilterForm from "./FilterForm";
import {
  projectOptionsType,
  setOpenFilterDrawer,
} from "@/store/features/DailyExpense";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { setProjectDetailsOpenFilterDrawer } from "@/store/features/ProjectDetails";
import ProjectExpenseFilterForm from "./ProjectExpenseFilterForm";
import CloseIcon from '@mui/icons-material/Close';

interface filterDrawerOpenProps {
  open: boolean;
  dispatch: ThunkDispatch<RootState, undefined, Action>;
  projectOptions: projectOptionsType[];
  projectExpense: boolean;
  projectId: string;
}

const FilterDrawer: FC<filterDrawerOpenProps> = ({
  open,
  dispatch,
  projectOptions,
  projectExpense,
  projectId,
}) => {
  return (

    <Dialog
    open={open}
      onClose={() =>
        projectExpense
          ? dispatch(setProjectDetailsOpenFilterDrawer(false))
          : dispatch(setOpenFilterDrawer(false))
      }
  >
    <DialogTitle style={{display:"flex", justifyContent:"space-between"}}>Search Expense<CloseIcon style={{cursor:"pointer"}} onClick={() =>
        projectExpense
          ? dispatch(setProjectDetailsOpenFilterDrawer(false))
          : dispatch(setOpenFilterDrawer(false))
      }/></DialogTitle>
    <DialogContent>
      <DialogContentText>
     Find expense based on the filter
      </DialogContentText>
          {projectExpense ? (
          <ProjectExpenseFilterForm dispatch={dispatch} projectId={projectId} />
       ) : (
          <FilterForm dispatch={dispatch} projectOptions={projectOptions} />
    )}
    </DialogContent>
  </Dialog>
  );
};

export default FilterDrawer;
