import React, { useState } from 'react';
import { Box, Typography, TextField, Button, FormHelperText, Link, IconButton, InputAdornment } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const LoginForm = ({ handleLogin, alertMessage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box
      sx={{
        marginTop: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <LockOutlinedIcon sx={{ fontSize: 40, color: "pink", marginBottom: 2 }} />
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>

      {alertMessage && (
        <FormHelperText error sx={{ marginBottom: 2 }}>
          {alertMessage}
        </FormHelperText>
      )}

      <Box
        component="form"
        onSubmit={(e) => handleLogin(e, email, password)}
        sx={{ mt: 5, width: '100%' }}
      >
        <TextField
          margin="normal"
          fullWidth
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
        />

        <TextField
          margin="normal"
          fullWidth
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Sign In
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
          <Link href="#" variant="body2" sx={{ fontSize: '0.875rem' }}>
            Forgot password?
          </Link>
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 5 }}>
        {"Copyright © Your Website 2025."}
      </Typography>
    </Box>
  );
};

export default LoginForm;
