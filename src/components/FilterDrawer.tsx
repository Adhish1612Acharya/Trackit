import { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FilterForm from "./FilterForm";
import {
  projectOptionsType,
  setOpenFilterDrawer,
} from "@/store/features/DailyExpense";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { setProjectDetailsOpenFilterDrawer } from "@/store/features/ProjectDetails";
import ProjectExpenseFilterForm from "./ProjectExpenseFilterForm";

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
      onOpenChange={() =>
        projectExpense
          ? dispatch(setProjectDetailsOpenFilterDrawer(false))
          : dispatch(setOpenFilterDrawer(false))
      }
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Apply filter</DialogTitle>
          <DialogDescription>
            Search daily expense based on the filters
          </DialogDescription>
        </DialogHeader>
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
