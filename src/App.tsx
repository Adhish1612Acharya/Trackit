import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./routes/Home/Home";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { ToastContainer } from "react-toastify";
import SignUp from "./routes/SignUp/SignUp";
import OwnerHome from "./routes/u/Home/Home";
import SecuredRoute from "./routes/securedRoutes/SecuredRoute";
import NavBar from "./components/NavigationBar/NavBar/NavBar";
import DailyExpense from "./routes/u/DailyExpense/DailyExpense";
import Projects from "./routes/u/Projects/Projects";
import ProjectExpense from "./routes/u/ProjectExpense/ProjectExpense";
import {
  LoginProviderContext,
  useLogin,
} from "./Context/LoginProviderContext/LoginProviderContext";
import AddProjectPage from "./routes/u/AddProjectPage/AddProjectPage";

const App = () => {
  return (
    <LoginProviderContext>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <AppContent />
        </ThemeProvider>
      </Provider>
    </LoginProviderContext>
  );
};

const AppContent = () => {
  const { isLoggedIn } = useLogin(); // Safe to use here since LoginProvider is wrapping the tree.

  return (
    <>
      {isLoggedIn && <NavBar />}

      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        bodyClassName="toastBody"
        style={{ marginTop: "5rem" }}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route element={<SecuredRoute />}>
          <Route path="/u/home" element={<OwnerHome />} />
          <Route path="/u/daily-expense" element={<DailyExpense />} />
          <Route path="/u/projects" element={<Projects />} />
          <Route path="/u/projects/:id" element={<ProjectExpense />} />
          <Route path="/u/projects/add" element={<AddProjectPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
