import React, { useEffect } from "react";
import { auth } from "@/firebaseconfig";
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { checkLogin } from "@/store/features/securedRoutes/SecureRoute";
import { useLogin } from "@/Context/LoginProviderContext";
import { CircularProgress } from "@mui/material";

const SecuredRoute = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { setIsLoggedIn } = useLogin();
  const loggedIn = useAppSelector((state) => state.securedRoute.loggedIn);
  const roleIsOwner = useAppSelector((state) => state.securedRoute.roleIsOwner);

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
