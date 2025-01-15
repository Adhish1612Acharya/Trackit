import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { NavigateFunction } from "react-router-dom";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import {
  setDeleteProjectId,
  setProjectDeleteAlertOpen,
} from "@/store/features/GetProjects";

interface ProjectInfoProps {
  title: string;
  description: string;
  budget: string;
  id: string;
  navigate: NavigateFunction;
  dispatch: ThunkDispatch<RootState, undefined, Action>;
}

const ProjectInfoCard: React.FC<ProjectInfoProps> = ({
  title,
  description,
  budget,
  id,
  navigate,
  dispatch,
}) => {
  return (
    <Card className="w-full max-w-4xl mx-auto my-6 transition-transform transform hover:scale-105 shadow-lg rounded-xl overflow-hidden bg-white flex flex-col md:flex-row">
      {/* Image Section */}
      <CardMedia
        className="w-full md:w-1/2 h-64 md:h-auto bg-cover bg-center"
        image="https://clipart-library.com/data_images/220852.jpg"
        title="Project"
      />
      {/* Content Section */}
      <div className="flex flex-col justify-between p-6 md:w-1/2 bg-gradient-to-b from-blue-50 to-white">
        <CardContent className="flex-grow">
          <div className="flex items-center justify-between">
            <Typography
              variant="h5"
              component="h2"
              className="font-bold text-gray-800"
            >
              {title}
            </Typography>
            {/* Budget Badge */}
            <div className="bg-blue-100 text-blue-700 text-sm font-medium px-4 py-2 rounded-full flex items-center gap-1 shadow">
              <CurrencyRupeeIcon fontSize="small" />
              {budget}
            </div>
          </div>
          <Typography
            variant="body2"
            className="text-gray-600 mt-4 leading-relaxed"
          >
            {description}
          </Typography>
        </CardContent>
        {/* Actions Section */}
        <CardActions className="flex justify-end mt-4">
          <Button
            variant="contained"
            size="medium"
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
            onClick={() => navigate(`/u/projects/${id}`)}
          >
            View Expense
          </Button>

          <Button
            variant="contained"
            size="medium"
            color="error"
            onClick={() => {
              dispatch(setDeleteProjectId(id));
              dispatch(setProjectDeleteAlertOpen(true));
            }}
          >
            Delete project
          </Button>
        </CardActions>
      </div>
    </Card>
  );
};

export default ProjectInfoCard;
