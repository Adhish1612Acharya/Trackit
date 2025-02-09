import { FC } from "react";
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
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { addProjectFormProps } from "./AddProjectFormTypes";
import {
  setAddProjectBtnLoad,
  setNewProject,
  setOpenAddProjectDrawer as dailyExpenseAddProjectDrawer,
  setOpenAddProjectDrawer,
} from "@/store/features/GetProjects/GetProjectsSlice";
import { addProject } from "@/store/features/DailyExpense/Thunks/addProject/addProject";
import { AddProjectResponse } from "@/store/features/DailyExpense/Thunks/addProject/addProjectType";

const AddProjectForm: FC<addProjectFormProps> = ({
  dispatch,
  navigate,
  addProjectBtnLoad,
  isDailyExpensePage,
  isAddProjectPage,
}) => {
  const form = useForm<z.infer<typeof addProjectFormSchema>>({
    resolver: zodResolver(addProjectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      budget: "",
    },
  });

  const handleFormSubmit = async (
    formValue: z.infer<typeof addProjectFormSchema>
  ) => {
    if (!isDailyExpensePage && !isAddProjectPage) {
      dispatch(setAddProjectBtnLoad(true));
    }
    const response = await dispatch(addProject(formValue));
    form.reset();

    if (isAddProjectPage && navigate) {
      navigate(
        `/u/projects/${(response.payload as AddProjectResponse)?.newProject.id}`
      );
    } else {
      // setOpenAddProjectDrawer as dailyExpenseAddProjectDrawer,
      if (isDailyExpensePage) {
        dispatch(dailyExpenseAddProjectDrawer(true));
      } else {
        const newProjectResponse = (response.payload as AddProjectResponse)
          .newProject?.newProjectData;
        dispatch(setNewProject(newProjectResponse as any));
        dispatch(setOpenAddProjectDrawer(false));
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-gray-700">Title</FormLabel>
              <Input
                placeholder="Enter the title of the project"
                type="text"
                {...field}
                className="border rounded-md px-3 py-2"
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
              <FormLabel className="text-gray-700">Description</FormLabel>
              <textarea
                placeholder="Enter the description of the project"
                {...field}
                className="border rounded-md px-3 py-2 h-24"
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
              <FormLabel className="text-gray-700">Budget</FormLabel>
              <Input
                placeholder="Enter the budget for the project"
                type="number"
                {...field}
                className="border rounded-md px-3 py-2"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4">
          {addProjectBtnLoad ? (
            <Button
              className="w-full text-white px-4 py-2 rounded-md flex items-center justify-center"
              disabled
            >
              <Loader2 className="animate-spin mr-2" />
              Creating...
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full  text-white px-4 py-2 rounded-md"
            >
              Create Project
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default AddProjectForm;
