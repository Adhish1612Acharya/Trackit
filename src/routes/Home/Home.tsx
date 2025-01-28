import { useAppDispatch, useAppSelector } from "@/store/store";
import { CircularProgress, Divider, Typography } from "@mui/material";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginForm from "@/components/LoginForm/LoginForm";
import GoogleIcon from "@mui/icons-material/Google";
import { useLogin } from "@/Context/LoginProviderContext/LoginProviderContext";
import { auth } from "@/firebaseconfig";
import {
  BackgroundContainer,
  CardContainer,
  FormHeader,
  StyledButton,
} from "./HomeCustomStyles";
import login from "@/store/features/Home/Thunks/login/login";
import { setLoggedIn } from "@/store/features/Home/HomeSlice";
import { googleLogin } from "@/store/features/Home/Thunks/googleLogin/googleLogin";
import { ValueObj } from "@/store/SharedTypes/sharedTypes";

const Home = () => {
  const { setIsLoggedIn } = useLogin();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const loginLoad = useAppSelector((state) => state.home.loginLoad);
  const loggedIn = useAppSelector((state) => state.home.loggedIn);
  const googleLoginLoad = useAppSelector((state) => state.home.googleLoginLoad);

  const handleLoginSubmit = async (value: ValueObj) => {
    dispatch(login({ value }));
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
  }, [navigate]);

  useEffect(() => {
    setIsLoggedIn(false);
  }, [setIsLoggedIn]);

  useEffect(() => {
    if (loggedIn === true) {
      navigate("/u/home");
    }
  }, [loggedIn, navigate]);

  return loggedIn === false ? (
    <BackgroundContainer>
      <CardContainer>
        <FormHeader>Login to Your Account</FormHeader>
        <LoginForm
          loginLoad={loginLoad}
          onSubmit={(value) => handleLoginSubmit(value)}
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
            disabled={googleLoginLoad}
          >
            Sign In with Google
          </StyledButton>
        )}

        <Typography variant="body2" style={{ marginTop: "1rem" }}>
          Don't have an account?{" "}
          <Link to="/sign-up" style={{ color: "#2575fc", fontWeight: "bold" }}>
            Sign-up
          </Link>
        </Typography>
      </CardContainer>
    </BackgroundContainer>
  ) : (
    <CircularProgress />
  );
};

export default Home;
