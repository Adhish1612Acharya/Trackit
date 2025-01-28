import SignUpForm from "@/components/SignUpForm/SignUpForm";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { CircularProgress, Divider, Typography } from "@mui/material";
import { FC, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import { auth } from "@/firebaseconfig";
import {
  BackgroundContainer,
  CardContainer,
  FormHeader,
  StyledButton,
} from "./SignUpCustomStyles";
import signUp from "@/store/features/Home/Thunks/signUp/signUp";
import { setLoggedIn } from "@/store/features/Home/HomeSlice";
import { googleLogin } from "@/store/features/Home/Thunks/googleLogin/googleLogin";
import { SignUpValueObj, ValueObj } from "@/store/SharedTypes/sharedTypes";

const SignUp: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const loginLoad = useAppSelector((state) => state.home.loginLoad);
  const loggedIn = useAppSelector((state) => state.home.loggedIn);
  const googleLoginLoad = useAppSelector((state) => state.home.googleLoginLoad);

  const handleSignUpSubmit = (value: SignUpValueObj | ValueObj) => {
    dispatch(signUp({ value: value as SignUpValueObj }));
  };

  useEffect(() => {
    async function checkLoggedIn() {
      auth.onAuthStateChanged((user) => {
        if (user) {
          dispatch(setLoggedIn(true));
          navigate("/u/home");
        } else {
          dispatch(setLoggedIn(false));
        }
      });
    }
    checkLoggedIn();
  }, []);

  useEffect(() => {
    if (loggedIn === true) {
      navigate("/u/home");
    }
  }, [loggedIn, navigate]);

  return loggedIn === false ? (
    <BackgroundContainer>
      <CardContainer>
        <FormHeader>Create An Account</FormHeader>
        <SignUpForm
          signUpLoad={loginLoad}
          onSubmit={(value) => handleSignUpSubmit(value)}
        />
        <Divider>OR</Divider>
        <br />
        {googleLoginLoad ? (
          <CircularProgress />
        ) : (
          <StyledButton
            fullWidth
            startIcon={<GoogleIcon />}
            onClick={() => dispatch(googleLogin())}
          >
            Sign In with Google
          </StyledButton>
        )}

        <Typography variant="body2" style={{ marginTop: "1rem" }}>
          Already have an account?{" "}
          <Link to="/" style={{ color: "#2575fc", fontWeight: "bold" }}>
            Login
          </Link>
        </Typography>
      </CardContainer>
    </BackgroundContainer>
  ) : (
    <CircularProgress />
  );
};

export default SignUp;
