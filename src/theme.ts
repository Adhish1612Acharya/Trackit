import { createTheme } from "@mui/material";

const theme = createTheme({
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:focus": {
            outline: "none",
            boxShadow: "none",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          "&:focus": {
            outline: "none",
            boxShadow: "none",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          "&:focus": {
            outline: "none",
            // border: "none",
            // boxShadow: "none",
          },
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          margin: "auto",
        },
      },
    },
  },
});

export default theme;
