import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FC } from "react";
import {
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
  // const form = useForm<z.infer<typeof addProjectFormSchema>>({
  //   resolver: zodResolver(addProjectFormSchema),
  //   defaultValues: {
  //     title: "",
  //     description: "",
  //     budget: undefined,
  //   },
  // });

  // const handleFormSubmit = (
  //   formValue: z.infer<typeof addProjectFormSchema>
  // ) => {
  //   dispatch(addProject(formValue)).then(() => form.reset());
  // };

  return (
    <Dialog
      open={open}
      onOpenChange={() => dispatch(setOpenAddProjectDrawer(false))}
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
