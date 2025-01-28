import { FC } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FilterForm from "../FilterForm/FilterForm";
import { setProjectDetailsOpenFilterDrawer } from "@/store/features/ProjectDetails/ProjectDetailsSlice";
import ProjectExpenseFilterForm from "../ProjectExpenseFilterForm/ProjectExpenseFilterForm";
import CloseIcon from "@mui/icons-material/Close";
import { filterDrawerOpenProps } from "./FilterDrawerTypes";
import { setOpenFilterDrawer } from "@/store/features/DailyExpense/DailyExpenseSlice";

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
      <DialogTitle style={{ display: "flex", justifyContent: "space-between" }}>
        Search Expense
        <CloseIcon
          style={{ cursor: "pointer" }}
          onClick={() =>
            projectExpense
              ? dispatch(setProjectDetailsOpenFilterDrawer(false))
              : dispatch(setOpenFilterDrawer(false))
          }
        />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>Find expense based on the filter</DialogContentText>
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
