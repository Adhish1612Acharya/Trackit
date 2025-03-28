import { Button, Card, styled, Typography, Box } from "@mui/material";

export const BackgroundContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  backgroundImage:
    "url(https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  textAlign: "center",
  position: "relative",
  padding: "1rem",
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 1,
  },
});

export const CardContainer = styled(Card)({
  zIndex: 2,
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  padding: "2rem",
  borderRadius: "15px",
  boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
  maxWidth: "400px",
  width: "100%",
  textAlign: "center",
  "@media (max-width: 600px)": {
    padding: "1.5rem",
  },
});

export const FormHeader = styled(Typography)({
  fontSize: "1.5rem",
  fontWeight: "bold",
  marginBottom: "1rem",
  "@media (max-width: 600px)": {
    fontSize: "1.2rem",
  },
});

export const StyledButton = styled(Button)({
  background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
  color: "#fff",
  padding: "0.8rem",
  borderRadius: "30px",
  textTransform: "none",
  fontSize: "1rem",
  "&:hover": {
    background: "linear-gradient(90deg, #2575fc 0%, #6a11cb 100%)",
  },
});
