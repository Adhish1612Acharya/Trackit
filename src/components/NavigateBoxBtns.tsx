import { Box,  Typography } from "@mui/material";
import  { FC } from "react";

interface NavigationBtnsProps {
  title: string;
  description: string;
  handleClick: () => void;
  icon: any;
}

const NavigateBoxBtns: FC<NavigationBtnsProps> = ({
  title,
  description,
  handleClick,
  icon,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
        border: "1px solid #ddd",
        borderRadius: 4,
        backgroundColor: "#fff",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        width: "300px",
        textAlign: "center",
        transition: "box-shadow 0.3s ease",
        "&:hover": {
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
        },
        cursor: "pointer",
        marginTop:"2rem"
      }}
      onClick={handleClick}
    >
      {/* Icon with gradient */}
      <Box
        sx={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #ff7e5f, #feb47b)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 2,
        }}
      >
        <Box
          sx={{
            width: "40px",
            height: "40px",
            background: "#fff",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#ff7e5f",
              fontSize: "1.5rem",
            }}
          >
            {icon}
          </Typography>
        </Box>
      </Box>

      {/* Title */}
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        {title}
      </Typography>

      {/* Description */}
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
  );
};

export default NavigateBoxBtns;
