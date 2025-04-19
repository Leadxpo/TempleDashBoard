import { Box, CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useState } from "react";
import Sidebar from "../components/Sidebar/sidebar";
import Navbar from "../components/Navbar/navbar";
import { Outlet } from "react-router-dom";

const theme = createTheme({
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "6px",
        },
      },
    },
  },
});

const AppLayout = ({ setIsAuthenticated }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", width: "100vw", height: "100vh" }}>
        <CssBaseline />
        
        {/* Sidebar */}
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />

        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          {/* Navbar */}
          <Navbar 
            toggleSidebar={() => setIsCollapsed(!isCollapsed)} 
            setIsAuthenticated={setIsAuthenticated} 
          />

          {/* Main Content without extra spacing */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 2,
              backgroundColor: "#f4f7fb",
              overflow: "auto",
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AppLayout;
