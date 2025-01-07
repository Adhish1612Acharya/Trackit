import { Drawer, DrawerContent } from "@/components/ui/drawer";
import AddExpenseForm from "./AddExpenseForm";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { FC } from "react";
import AddProjectDrawer from "./AddProjectDrawer";
import { projectOptionsType } from "@/store/features/DailyExpense";

export interface addExpenseDrawerProps {
  dispatch: ThunkDispatch<RootState, undefined, Action>;
  openDrawer: boolean;
  openAddProjectDrawer: boolean;
  projectOptions: projectOptionsType[];
}

const AddExpenseDrawer: FC<addExpenseDrawerProps> = ({
  dispatch,
  openDrawer,
  openAddProjectDrawer,
  projectOptions,
  // submit,
}) => {
  return (
    <Drawer
      open={openDrawer}
      
      // onOpenChange={() => dispatch(setOpenAddExpenseDrawer(false))}
    >
      <DrawerContent
        aria-labelledby="add-daily-expense-title"
        style={
          {
            // overflowY: "auto", // Enable vertical scrolling
           
          padding:"16px"
          }
        }
      >
        {/* <DrawerTitle>
          <Typography
            variant="h5"
            component="div" // Renders as a div instead of an h5
            align="center"
            sx={{ mb: 2 }}
          >
            Add Daily Expense
          </Typography>
        </DrawerTitle> */}

        <AddExpenseForm
          dispatch={dispatch}
          projectOptions={projectOptions}
        />

        <AddProjectDrawer open={openAddProjectDrawer} dispatch={dispatch} />

        {/* </motion.div> */}
      </DrawerContent>
    </Drawer>
  );
};

export default AddExpenseDrawer;
