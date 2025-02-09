import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { HomeIcon, Eye, Pencil, Trash2 } from "lucide-react";
import {
  setDeleteProjectId,
  setProjectDeleteAlertOpen,
} from "@/store/features/GetProjects/GetProjectsSlice";
import { ProjectInfoProps } from "./ProjectInfoCardTypes";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { cn } from "@/lib/utils";

const ProjectInfoCard: React.FC<ProjectInfoProps> = ({
  title,
  description,
  budget,
  expenseTotal,
  id,
  navigate,
  dispatch,
}) => {
  const spentPercentage = (expenseTotal / Number(budget)) * 100;
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      {/* Image Section */}
      <div className="relative h-48">
        <img
          src={"https://clipart-library.com/data_images/220852.jpg"}
          alt={title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
          <HomeIcon className="h-5 w-5" />
          <span className="font-semibold">{title}</span>
        </div>
      </div>
      {/* Content Section */}

      <CardContent className="space-y-4 p-6">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Budget</span>
            <span className="text-primary">{budget}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Spent</span>
            <span className="text-primary">{expenseTotal}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{spentPercentage.toFixed(2)}%</span>
          </div>
          <Progress
            value={spentPercentage}
            data-high={spentPercentage > 90}

          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => navigate(`/u/projects/${id}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          {/* <Button variant="outline" size="sm" className="flex-1">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button> */}
          <Button
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={() => {
              dispatch(setDeleteProjectId(id));
              dispatch(setProjectDeleteAlertOpen(true));
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectInfoCard;
