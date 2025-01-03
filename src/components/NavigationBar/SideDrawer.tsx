import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import { auth } from "@/firebaseconfig";
import { toast } from "react-toastify";

interface props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const SideDrawer: React.FC<props> = ({ open, setOpen }) => {
  const list = () => (
    <Box
      sx={{ width: 250, height: "100%" }}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
      }}
      role="presentation"
      onClick={() => setOpen(false)}
      onKeyDown={() => setOpen(false)}
    >
      <List className="flex flex-col justify-evenly  h-full">
        {[
          {
            title: "Home",
            icon: <HomeIcon />,
            link: "/u/home",
          },
          {
            title: "Add Expense",
            icon: <AddIcon />,
            link: "/u/daily-expense",
          },
          {
            title: "Today's Expense",
            icon: <CurrencyRupeeIcon />,
            link: "/u/daily-expense",
          },
          {
            title: "Your Projects",
            icon: <AssignmentIcon />,
            link: "/u/projects",
          },
          {
            title: "Logout",
            icon: <LogoutIcon />,
            link: "",
          },
        ].map((value, index) =>
          value.title === "Logout" ? (
            <ListItem
              key={index}
              disablePadding
              sx={{ display: { md: "none", xs: "flex" } }}
            >
              <ListItemButton
                onClick={async () => {
                  await auth.signOut().then(() => {
                    toast.success("LoggedOut");
                    window.location.href = "/";
                  });
                }}
              >
                <ListItemIcon style={{ color: "black" }}>
                  {value.icon}
                </ListItemIcon>
                <ListItemText primary={value.title} />
              </ListItemButton>
            </ListItem>
          ) : (
            <Link
              key={index}
              to={value.link}
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItem
                disablePadding
                sx={{ display: { md: "none", xs: "flex" } }}
              >
                <ListItemButton>
                  <ListItemIcon style={{ color: "black" }}>
                    {value.icon}
                  </ListItemIcon>
                  <ListItemText primary={value.title} />
                </ListItemButton>
              </ListItem>
            </Link>
          )
        )}
        {[
          {
            title: "Today's Expense",
            icon: <CurrencyRupeeIcon />,
            link: "/u/daily-expense",
          },
          {
            title: "Your Projects",
            icon: <AssignmentIcon />,
            link: "/u/projects",
          },
          {
            title: "Logout",
            icon: <LogoutIcon />,
            link: "",
          },
        ].map((value, index) =>
          value.title !== "Logout" ? (
            <Link
              key={index}
              to={value.link}
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItem
                disablePadding
                sx={{ display: { md: "flex", xs: "none" } }}
              >
                <ListItemButton>
                  <ListItemIcon style={{ color: "black" }}>
                    {value.icon}
                  </ListItemIcon>
                  <ListItemText primary={value.title} />
                </ListItemButton>
              </ListItem>
            </Link>
          ) : (
            <ListItem
              key={index}
              disablePadding
              sx={{ display: { md: "flex", xs: "none" } }}
            >
              <ListItemButton
                onClick={async () => {
                  await auth.signOut().then(() => {
                    toast.success("LoggedOut");
                    window.location.href = "/";
                  });
                }}
              >
                <ListItemIcon style={{ color: "black" }}>
                  {value.icon}
                </ListItemIcon>
                <ListItemText primary={value.title} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
    </Box>
  );

  return (
    <div onClick={() => setOpen(false)}>
      {/* {(["right"] as const).map((anchor) => ( */}
      <React.Fragment key={"right"}>
        <SwipeableDrawer
          anchor={"right"}
          open={open}
          onClose={() => console.log("opened")}
          onOpen={() => console.log("opened")}
          className="drawer"
        >
          {list()}
        </SwipeableDrawer>
      </React.Fragment>
      {/* ))} */}
    </div>
  );
};

export default SideDrawer;
