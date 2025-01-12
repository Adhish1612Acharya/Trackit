import { DialogContent } from "@mui/material";
import AddExpenseForm from "./AddExpenseForm";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { FC } from "react";
import {
  projectOptionsType,
  setOpenAddExpenseDrawer,
} from "@/store/features/DailyExpense";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";

export interface addExpenseDrawerProps {
  dispatch: ThunkDispatch<RootState, undefined, Action>;
  openDrawer: boolean;
  projectOptions: projectOptionsType[];
  loading: boolean;
  miscellaneousInput: boolean;
}

const AddExpenseDrawer: FC<addExpenseDrawerProps> = ({
  dispatch,
  openDrawer,
  loading,
  projectOptions,
  miscellaneousInput,
}) => {
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Dialog
      fullScreen={fullScreen}
      style={{ height: "max-content", maxHeight: "100vh", overflowY: "auto" }}
      open={openDrawer}
      onClose={() => () => dispatch(setOpenAddExpenseDrawer(false))}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle
        id="responsive-dialog-title"
        style={{
          marginBottom: "0rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {"Add Expense"}{" "}
        <CloseIcon
          style={{ cursor: "pointer" }}
          onClick={() => dispatch(setOpenAddExpenseDrawer(false))}
        />
      </DialogTitle>
      <DialogContent>
        <AddExpenseForm
          dispatch={dispatch}
          projectOptions={projectOptions}
          loading={loading}
          miscellaneousInput={miscellaneousInput}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseDrawer;
