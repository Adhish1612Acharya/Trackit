import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { NavigateFunction } from "react-router-dom";

interface ProjectInfoProps {
  title: string;
  description: string;
  budget: string;
  id: string;
  navigate: NavigateFunction;
}

const ProjectInfoCard: React.FC<ProjectInfoProps> = ({
  title,
  description,
  budget,
  id,
  navigate,
}) => {
  return (
    <Card className="w-full max-w-4xl mx-auto my-4 transition-transform transform hover:scale-[1.02] shadow-lg rounded-2xl overflow-hidden bg-gradient-to-r from-blue-500 to-blue-700 text-white flex flex-col md:flex-row">
      {/* Image Section */}
      <CardMedia
        className="w-full md:w-1/2 h-64 md:h-auto bg-cover bg-center"
        image="https://clipart-library.com/data_images/220852.jpg"
        title="Project"
      />
      {/* Content Section */}
      <div className="flex flex-col justify-between p-6 md:w-1/2">
        <CardContent className="flex-grow">
          <div className="flex items-center justify-between">
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              className="font-bold text-black"
            >
              {title}
            </Typography>
            {/* Budget Badge */}
            <div className="bg-white text-blue-700 text-sm font-semibold px-3 py-1 rounded-full shadow-md">
              {budget}
            </div>
          </div>
          <Typography
            variant="body2"
            className="text-blue-200 mt-4 leading-relaxed"
          >
            {description}
          </Typography>
        </CardContent>
        {/* Actions Section */}
        <CardActions className="flex justify-end mt-4">
          <Button
            variant="contained"
            size="small"
            className="bg-white text-blue-700 font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-gray-200 transition"
            onClick={() => navigate(`/u/projects/${id}`)}
          >
            View Expense
          </Button>
        </CardActions>
      </div>
    </Card>
  );
};

export default ProjectInfoCard;
