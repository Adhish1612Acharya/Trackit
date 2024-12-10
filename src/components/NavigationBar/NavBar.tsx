import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import SideDrawer from "./SideDrawer";
import { useState } from "react";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";

const pages = [
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
];

function NavBar() {
  const [open, setOpen] = useState(false);

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl" className="bg-white">
        <Toolbar disableGutters>
          <div className="w-1/2 h-full flex flex-row justify-start items-center">
            <Link to={"/u/home"}>
              <Avatar
                alt=""
                src="https://png.pngtree.com/png-clipart/20230423/original/pngtree-modern-finance-investment-logo-png-image_9077777.png"
                style={{ cursor: "pointer" }}
              />
            </Link>

            <Typography
              variant="h6"
              noWrap
              sx={{
                ml: 5,
                display: { xs: "flex", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                color: "black",
                textDecoration: "none",
              }}
            >
              Trackit
            </Typography>
          </div>
          <div className="w-1/2 h-full flex flex-row justify-end items-center">
            <Box
              sx={{
                width: "80%",
                height: "100%",
                display: { xs: "none", md: "flex" },
                justifyContent: "space-evenly",
              }}
            >
              {pages.map((page) => (
                <Link
                  key={page.link}
                  onClick={() => {
                    handleCloseNavMenu();
                  }}
                  to={page.link}
                  className="text-black hover:text-black hover:cursor-pointer"
                >
                  <div className="flex">
                    {page.icon}
                    &nbsp;
                    {page.title}
                  </div>
                </Link>
              ))}
            </Box>
            <Box className="h-full w-1/4">
              <Tooltip title="Open settings">
                <IconButton onClick={() => setOpen(true)} sx={{ p: 0 }}>
                  <Avatar alt="" src="" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <SideDrawer
                  open={open}
                  setOpen={(value: boolean) => setOpen(value)}
                />
              </Menu>
            </Box>
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;
