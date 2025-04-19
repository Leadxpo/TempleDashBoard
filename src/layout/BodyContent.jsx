import React from "react";
import { Box } from "@mui/material";

// interface Props {
//   children: ReactNode;
// }

const BodyContent = ({ children }) => {
  return (
    <Box
      mt={2}
      alignItems="center"
      padding="16px"
      borderRadius="12px"
      bgcolor="#ffff"  // Fixed color value
      boxShadow="0px 1px 3px rgba(0, 0, 0, 0.1)"
    >
      {children}
    </Box>
  );
};

export default BodyContent;
