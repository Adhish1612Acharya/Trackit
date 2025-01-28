import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Navigate, Outlet } from "react-router-dom";
import { useLogin } from "@/Context/LoginProviderContext/LoginProviderContext";
import { CircularProgress } from "@mui/material";
import checkLogin from "@/store/features/securedRoutes/Thunks/checkLogin/checkLogin";

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
  }, [loggedIn]);

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
