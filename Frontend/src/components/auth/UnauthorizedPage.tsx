// src/pages/auth/UnauthorizedPage.tsx
import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const UnauthorizedPage: React.FC = () => {
  return (
    <div style={{ padding: "40px", textAlign: "center", marginTop: "50px" }}>
      <Box textAlign="center" mt={5}>
        <Typography variant="h3" gutterBottom>
          403 - Unauthorized Access
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Sorry, you do not have the necessary permissions to access this
          resource.
        </Typography>
        <Button component={Link} to="/" variant="contained" color="primary">
          Go to Home
        </Button>
      </Box>
    </div>
  );
};

export default UnauthorizedPage;
