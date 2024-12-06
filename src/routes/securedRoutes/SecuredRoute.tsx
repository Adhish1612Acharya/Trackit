import  { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Navigate, Outlet } from "react-router-dom";
import { checkLogin } from "@/store/features/securedRoutes/SecureRoute";
import { useLogin } from "@/Context/LoginProviderContext";
import { CircularProgress } from "@mui/material";

const SecuredRoute = () => {
  const dispatch = useAppDispatch();
  const { setIsLoggedIn } = useLogin();
  const loggedIn = useAppSelector((state) => state.securedRoute.loggedIn);

  useEffect(() => {
    dispatch(checkLogin());
  }, [dispatch]);

  useEffect(() => {
    if (loggedIn) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  });

  // useEffect(() => {
  //   if (roleIsOwner === false) {
  //     navigate("/engineer");
  //   }
  // }, [roleIsOwner, navigate]);

  if (loggedIn == null) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  return loggedIn !== null && loggedIn === false ? (
    <Navigate to={"/"} replace />
  ) : (
    <Outlet />
  );
};

export default SecuredRoute;
