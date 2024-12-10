import { googleLogin, login, valueObj } from "@/store/features/Home/Home";
import { useAppDispatch, useAppSelector } from "@/store/store";
import styled from "@emotion/styled";
import { Box, Button, Divider, Typography } from "@mui/material";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import LoginForm from "@/components/Home/LoginForm";
import GoogleIcon from "@mui/icons-material/Google";
import { useLogin } from "@/Context/LoginProviderContext";
import { auth } from "@/firebaseconfig";

const backgroundImageUrl =
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const BackgroundContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  backgroundImage: `url(${backgroundImageUrl})`,
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
    backdropFilter: "blur(8px)",
    zIndex: 1,
  },
});

const CardContainer = styled(Card)({
  zIndex: 2,
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  padding: "2rem",
  borderRadius: "15px",
  boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
  maxWidth: "400px",
  width: "100%",
  textAlign: "center",
});

const FormHeader = styled(Typography)({
  fontSize: "1.5rem",
  fontWeight: "bold",
  marginBottom: "1rem",
});

const StyledButton = styled(Button)({
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

const Home = () => {
  const { setIsLoggedIn } = useLogin();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const loginLoad = useAppSelector((state) => state.home.loginLoad);
  const loggedIn = useAppSelector((state) => state.home.loggedIn);
  const googleLoginLoad = useAppSelector((state) => state.home.googleLoginLoad);

  const handleLoginSubmit = async (value: valueObj) => {
    dispatch(login({ value }));
  };

  useEffect(() => {
    async function checkLoggedIn() {
      auth.onAuthStateChanged((user) => {
        if (user) {
          navigate("/u/home");
        }
      });
    }
    checkLoggedIn();
  }, []);

  useEffect(() => {
    setIsLoggedIn(false);
  }, [setIsLoggedIn]);

  useEffect(() => {
    if (loggedIn === true) {
      navigate("/u/home");
    }
  }, [loggedIn, navigate]);

  return (
    <BackgroundContainer>
      <CardContainer>
        <FormHeader>Login to Your Account</FormHeader>
        <LoginForm
          loginLoad={loginLoad}
          onSubmit={(value) => handleLoginSubmit(value)}
        />
        <Divider>OR</Divider>
        <br />
        <StyledButton
          fullWidth
          startIcon={<GoogleIcon />}
          onClick={() => dispatch(googleLogin())}
          disabled={googleLoginLoad}
        >
          Sign In with Google
        </StyledButton>
        <Typography variant="body2" style={{ marginTop: "1rem" }}>
          Don't have an account?{" "}
          <Link to="/sign-up" style={{ color: "#2575fc", fontWeight: "bold" }}>
            Sign-up
          </Link>
        </Typography>
      </CardContainer>
    </BackgroundContainer>
  );
};

export default Home;
