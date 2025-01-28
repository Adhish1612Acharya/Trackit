import { DialogContent } from "@mui/material";
import AddExpenseForm from "../AddExpenseForm/AddExpenseForm";
import { FC } from "react";
import { setOpenAddExpenseDrawer } from "@/store/features/DailyExpense/DailyExpenseSlice";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import { addExpenseDrawerProps } from "./AddExpenseDrawerTypes";

const AddExpenseDrawer: FC<addExpenseDrawerProps> = ({
  dispatch,
  openDrawer,
  loading,
  projectOptions,
  miscellaneousInput,
  isDailyExpense,
  isProjectPage,
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
          isDailyExpense={isDailyExpense}
          isProjectPage={isProjectPage}
          editForm={false}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseDrawer;
