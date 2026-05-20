import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem, ListItemIcon, ListItemText, } from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { AuthContext } from "../usercontext/context/authContext";

export default function Header() {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { authenticated, setAuthenticated, setUser, user } =
    useContext(AuthContext);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const goToDashboard = () => {
    handleMenuClose();
    navigate("/");
  };

  const goToProfile = () => {
    handleMenuClose();
    navigate("/profile");
  };

  const goToMyOrder = () => {
    handleMenuClose();
    navigate("/myorders");
  };

  const handleLogout = () => {
    handleMenuClose();
    localStorage.removeItem("user");
    setAuthenticated(false);
    setUser(null);
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Product Store
        </Typography>

        <Box display="flex" gap={2}>
          <Button color="inherit" onClick={() => navigate("/")}>
            Dashboard
          </Button>

          {authenticated ? (
            <>
            <Button color="inherit" startIcon={<ShoppingCartIcon />} onClick={() => navigate("/cart")}>
                Cart
              </Button>
              
              <Avatar
                sx={{ cursor: "pointer", bgcolor: "secondary.main" }}
                onClick={handleMenuOpen}
              >
                {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
              </Avatar>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem onClick={goToDashboard}>
                  <ListItemIcon>
                    <DashboardIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Dashboard</ListItemText>
                </MenuItem>

                <MenuItem onClick={goToProfile}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Profile</ListItemText>
                </MenuItem>

                <MenuItem onClick={goToMyOrder} >
                  <ListItemIcon>
                    <ReceiptLongIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>My Orders</ListItemText>
                </MenuItem>

                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate("/register")}>
                Register
              </Button>
                </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
