import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome } from 'react-icons/fa'; // Importing a home icon from react-icons

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for UX

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send a POST request to the login endpoint with the form data
      const response = await axios.post('http://192.168.1.124:8000/api/login/hospital/', formData);

      // Handle the response based on the approval status
      if (response.data.status === 'pending') {
        setMessage('Your registration is still pending approval.');
      } else if (response.data.status === 'rejected') {
        setMessage('Your registration was rejected.');
      } else {
        // Store JWT tokens in localStorage (assuming backend returns access and refresh tokens)
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);

        setMessage('Login successful!');
        // Redirect to hospital dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setMessage('Invalid login credentials.');
      } else {
        setMessage('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleHomeClick = () => {
    navigate('/landingpage');
  };

  return (
    <Container>
      {/* Header with Home Icon */}
      <Header>
        <HomeButton onClick={handleHomeClick}>
          <FaHome />
          Home
        </HomeButton>
      </Header>
      <LoginForm>
        <Title>Hospital Login</Title>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        {message && <Message error={message.includes('Invalid') || message.includes('rejected')}>{message}</Message>}
        <RegisterText>
          Don't have an account? <a href="/registration">Register here</a>.
        </RegisterText>
      </LoginForm>
    </Container>
  );
};

// Styled components

const Header = styled.header`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 20px;
  background-color: #f8f9fa;
  display: flex;
  justify-content: absolute;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const HomeButton = styled.button`
  background: none;
  border: none;
  color: red;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  text-decoration: none;
  &:hover {
    color: red;
  }
  svg {
    font-size: 22px;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f4f8;
`;

const LoginForm = styled.div`
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 400px;
  max-width: 100%;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 24px;
  color: #333;
  font-size: 24px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 12px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #0056b3;
  }
`;

const Message = styled.p`
  color: ${(props) => (props.error ? 'red' : 'green')};
  text-align: center;
`;

const RegisterText = styled.p`
  text-align: center;
  font-size: 14px;
  color: #555;
  a {
    color: #007bff;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default Login;
