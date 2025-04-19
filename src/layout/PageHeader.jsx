import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, IconButton, Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

function PageHeader(props) {
  const { title } = props;
  const navigate = useNavigate(); // Initialize useNavigate

  const handleHomeClick = () => {
    navigate("/dashboard"); // Navigate to the Dashboard page
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      padding="16px"
      borderRadius="12px"
      bgcolor="#ffff"
      boxShadow="0px 1px 3px rgba(0, 0, 0, 0.1)"
    >
      {/* Title */}
      <Typography variant="h6" fontWeight="bold">
        {title || "Dashboard"}
      </Typography>

      {/* Icon and Button Group */}
      <Box display="flex" alignItems="center" gap="8px">
        {/* Home Icon */}
        <IconButton onClick={handleHomeClick}>
          <HomeIcon fontSize="small" />
        </IconButton>

        {/* Button */}
        <Button
          variant="contained"
          color="primary"
          sx={{
            textTransform: "none",
            backgroundColor: "#E3E7FF",
            color: "#5C67F2",
            borderRadius: "12px",
            fontWeight: "bold",
            padding: "4px 12px",
            "&:hover": {
              backgroundColor: "#C7D1FF",
            },
          }}
        >
          Shop list
        </Button>
      </Box>
    </Box>
  );
}

export default PageHeader;
