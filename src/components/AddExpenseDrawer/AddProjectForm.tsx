import React, { FC } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import addProjectFormSchema from "@/validations/forms/AddProjectForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addProject } from "@/store/features/DailyExpense";
import { z } from "zod";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAppSelector } from "@/store/store";
import { Loader2 } from "lucide-react";

interface addProjectFormProps {
  dispatch: ThunkDispatch<RootState, undefined, Action>;
}

const AddProjectForm: FC<addProjectFormProps> = ({ dispatch }) => {
  const form = useForm<z.infer<typeof addProjectFormSchema>>({
    resolver: zodResolver(addProjectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      budget: undefined,
    },
  });

  const handleFormSubmit = (
    formValue: z.infer<typeof addProjectFormSchema>
  ) => {
    dispatch(addProject(formValue)).then(() => form.reset());
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Title</FormLabel>
              <Input
                placeholder="Enter the Title of the project"
                type="text"
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Description</FormLabel>
              <Input
                placeholder="Enter the description of the project"
                type="text"
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Budget</FormLabel>
              <Input
                placeholder="Enter the image of the project"
                type="number"
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {useAppSelector((state) => state.addDailyExpense.addProjectBtnLoad) ? (
          <Button style={{ marginTop: 20, width: "100%" }} disabled>
            <Loader2 className="animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button
            // variant="contained"
            color="primary"
            // fullWidth
            type="submit"
            style={{ marginTop: 20, width: "100%" }}
            // disabled={useAppSelector(
            //   (state) => state.addDailyExpense.addExpenseBtnLoad
            // )}
          >
            Create Project
          </Button>
        )}
      </form>
    </Form>
  );
};

export default AddProjectForm;
