import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import LoginForm from '../components/LoginComponent/LoginForm';
import axios from 'axios';

const Login = ({ setIsAuthenticated }) => {
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      navigate('/dashboard'); // ✅ Or '/profile', based on your routing
    }
  }, [navigate, setIsAuthenticated]);

  const handleLogin = async (e, email, password) => {
    e.preventDefault();

    if (!email || !password) {
      setAlertMessage('Please fill in all fields');
      return;
    }

    const formData = { email, password };

    try {
      const response = await axios.post('https://templeservice.signaturecutz.in/systemuser/api/login', formData);
      const { token, user } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(user));

      console.log("0000000000000000>",user)

      setIsAuthenticated(true);
      navigate('/dashboard'); // ✅ Or '/profile'
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      setAlertMessage('Login failed. Please check your credentials.');
    }
  };

  return (
    <Container maxWidth="xs">
      <LoginForm handleLogin={handleLogin} alertMessage={alertMessage} />
    </Container>
  );
};

export default Login;
