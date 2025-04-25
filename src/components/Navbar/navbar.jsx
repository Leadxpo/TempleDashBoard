import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  Box,
  Chip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import FaceIcon from "@mui/icons-material/Face";
import Logo from '../../components/Images/Kotilinga Temple Logo 1.png';

const Navbar = ({ toggleSidebar, setIsAuthenticated }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    setUserData(user);
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const handleProfileNavigate = () => {
    navigate("/profile");
    handleMenuClose();
  };

  const userInitial = userData?.userName?.[0]?.toUpperCase() || "U";

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#001f4d", // Navy Blue color
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
        zIndex: 1000,
        height: 80, // Increased height
        justifyContent: "center",
      }}
    >
      <Toolbar sx={{ minHeight: 80 }}> {/* match height with AppBar */}
        {/* Left - Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <img
            src={Logo}
            alt="Logo"
            style={{ height: 60 }}
          />
          <Typography variant="h6" sx={{ color: "#ffffff", fontSize: "1.2rem" }}>
            Sri Shaktipeetha Koti Linga Kshethram
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" gap={2} sx={{ marginLeft: "auto" }}>
          <Tooltip title="Account settings">
            <Chip
              avatar={
                <Avatar
                  src={
                    userData?.profilePic
                      ? `https://temple.signaturecutz.in/storage/userdp/${userData.profilePic}`
                      : undefined
                  }
                  alt={userData?.userName || "User"}
                >
                  {userInitial}
                </Avatar>
              }
              label={userData?.userName || "User"}
              onClick={handleMenuOpen}
              sx={{
                backgroundColor: "#f0f0f0",
                "&:hover": { backgroundColor: "#e0e0e0" },
                cursor: "pointer",
                padding: "4px 8px",
                fontWeight: "500",
              }}
            />
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              elevation: 4,
              sx: {
                mt: 1,
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              },
            }}
          >
            <MenuItem onClick={handleProfileNavigate}>
              <Avatar /> Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
