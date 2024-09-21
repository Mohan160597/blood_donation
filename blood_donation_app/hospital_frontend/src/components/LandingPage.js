import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const LandingPage = () => {
  return (
    <LandingPageContainer>
      {/* Header Section */}
      <Header>
        <Logo>
          <img src="../assets/logo.png" alt="Logo" />
        </Logo>
        <NavButtons>
          <Link to="/login">
            <Button className="login-btn">Login</Button>
          </Link>
          <Link to="/registration">
            <Button className="register-btn">Register</Button>
          </Link>
        </NavButtons>
      </Header>

      {/* Main content */}
      <Content>
        <Title>Welcome to the Hospital Management System</Title>
        <Description>
          Here is some example content for the landing page... This hospital management system allows hospitals to register, manage donor data, blood units inventory, delivery tracking, and much more!
          <ImageContainer>
            <img src="/image.png" alt="Logo" />
          </ImageContainer>
 
        </Description>
      </Content>
    </LandingPageContainer>
  );
};

// Styled Components for LandingPage

const LandingPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #f5f7fa;
  overflow-y: hidden;
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  height: 30px; /* Set a specific height for the header */
`;

const Content = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 40px;
  margin-top: 80px; /* Adjust to the same height as the header */
  flex-grow: 1;
  overflow-y: auto; /* Enable vertical scrolling */
  overflow-x: auto; /* Enable horizontal scrolling */
  width: 100%; /* Ensure it doesn't overflow horizontally */
  min-height: calc(100vh - 30px);
  background-color: #e9ecef;
`;

const Logo = styled.div`
  img {
    height: 50px;
  }
`;

const NavButtons = styled.nav`
  display: flex;
  gap: 20px;
  margin-right: 50px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &.login-btn {
    background-color: #007bff;
    color: white;
    &:hover {
      background-color: #0056b3;
    }
  }

  &.register-btn {
    background-color: #28a745;
    color: white;
    &:hover {
      background-color: #218838;
    }
  }
`;

const Title = styled.h1`
  font-size: 36px;
  color: #333;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 18px;
  color: #666;
  line-height: 1.6;
  max-width: 800px;
`;


const ImageContainer = styled.div`
  max-width: 100%; /* Ensure image container doesn't overflow */
  margin: 20px 0;

  img {
    max-width: 100%;
    height: auto;
    object-fit: contain; /* Ensures the image fits within the container */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }
`;

export default LandingPage;
