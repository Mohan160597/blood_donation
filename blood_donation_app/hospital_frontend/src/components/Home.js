// Home.js
import React from 'react';
import styled from 'styled-components';

const Home = () => {
  return (
    <HomeContainer>
      <h1>Welcome to the Dashboard!</h1>
      <p>This is the home screen. You can manage various services from here.</p>
    </HomeContainer>
  );
};

const HomeContainer = styled.div`
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export default Home;
