import { FC } from "react";
import EngineeringIcon from "@mui/icons-material/Engineering";
import HomeIcon from "@mui/icons-material/Home";
import { Button as ShadCNButton } from "@/components/ui/button";
import {
  Card,
  CardContent,
  Typography,
  CardHeader,
  Button,
  IconButton,
  styled,
  Divider,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const StyledCard = styled(Card)({
  width: 300,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  borderRadius: "16px",
  overflow: "hidden",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    boxShadow: "0 6px 25px rgba(0, 0, 0, 0.15)",
    transform: "scale(1.05)",
  },
});

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LoginForm from "./LoginForm";
import {
  googleLogin,
  signUpValueObj,
  valueObj,
} from "@/store/features/Home/Home";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import SignUpForm from "../SignUpForm";

type props = {
  owner: boolean;

  loginLoad: boolean;
  dispatch: ThunkDispatch<RootState, undefined, Action>;
  signUpPage: boolean;
  handleLogin: (value: valueObj | signUpValueObj) => void;
  googleLoginLoad: boolean;
};

const LoginFormDialog: FC<props> = ({
  owner,
  handleLogin,
  loginLoad,
  dispatch,
  signUpPage,
  googleLoginLoad,
}) => {
  return (
    <Dialog>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {!signUpPage
              ? owner
                ? "Login as Owner"
                : "Login as Engineer"
              : owner
              ? "Sign Up AS Owner"
              : "Sign Up as Engineer"}
          </DialogTitle>
        </DialogHeader>
        {signUpPage ? (
          <SignUpForm
            signUpLoad={loginLoad}
            onSubmit={(value) => handleLogin(value)}
          />
        ) : (
          <LoginForm
            loginLoad={loginLoad}
            onSubmit={(value: valueObj) => handleLogin(value)}
          />
        )}
        <Divider>OR</Divider>
        <div className="mt-6">
          <ShadCNButton
            variant="outline"
            className="w-full border border-gray-300 rounded-lg py-2 text-gray-700 flex items-center justify-center hover:bg-gray-100"
            onClick={() => dispatch(googleLogin())}
            disabled={googleLoginLoad ? true : false}
          >
            <GoogleIcon />
            Sign In with Google
          </ShadCNButton>
        </div>
      </DialogContent>
      <StyledCard>
        <CardHeader
          avatar={
            <IconButton
              sx={{ color: "white", bgcolor: owner ? "#FF7043" : "#512DA8" }}
            >
              {owner ? (
                <HomeIcon fontSize="large" />
              ) : (
                <EngineeringIcon fontSize="large" />
              )}
            </IconButton>
          }
          title={
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#ffffff" }}
            >
              {owner ? "Owner" : "Engineer"}
            </Typography>
          }
          sx={{
            bgcolor: owner ? "secondary.main" : "primary.main",
            color: "white",
            textAlign: "center",
            py: 2,
            background: owner
              ? "linear-gradient(90deg, #FF7043, #FF5722)"
              : "linear-gradient(90deg, #673AB7, #3F51B5)",
          }}
        />
        <CardContent
          sx={{
            textAlign: "center",
            bgcolor: "#F5F5F5",
            py: 3,
            height: "100%",
          }}
        >
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {owner
              ? " Manage properties and track your listings and finance"
              : " Access engineer-specific features and tools"}
          </Typography>
          <DialogTrigger asChild>
            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                bgcolor: owner ? "#FF7043" : "#512DA8",
                "&:hover": { bgcolor: owner ? "#D84315" : "#311B92" },
              }}
              // onClick={() => dispatch(setIsOwner(owner))}
            >
              {!signUpPage
                ? owner
                  ? "Login as House Owner"
                  : "Login as Builder"
                : owner
                ? "Sign Up as House Owner"
                : "Sign Up as Builder"}
            </Button>
          </DialogTrigger>
        </CardContent>
      </StyledCard>
    </Dialog>
  );
};

export default LoginFormDialog;
