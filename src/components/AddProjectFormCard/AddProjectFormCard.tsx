import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AddProjectForm from "../AddProjectForm/AddProjectForm";
import { AddProjectFormCardTypes } from "./AddProjectFormCardTypes";
import { FC } from "react";

const AddProjectFormCard: FC<AddProjectFormCardTypes> = ({
  addProjectBtnLoad,
  dispatch,
  navigate,
}) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-lg bg-white shadow-lg rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Create a New Project
          </CardTitle>
          <CardDescription className="text-gray-600">
            Add a new project and track expenses effortlessly
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 py-4">
          <AddProjectForm
            isDailyExpensePage={false}
            dispatch={dispatch}
            addProjectBtnLoad={addProjectBtnLoad}
            isAddProjectPage={true}
            navigate={navigate}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProjectFormCard;
