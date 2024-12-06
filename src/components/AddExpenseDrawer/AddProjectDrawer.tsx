import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FC } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import addProjectFormSchema from "@/validations/forms/AddProjectForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import {
  addProject,
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
