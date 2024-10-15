import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa'; // Import icons
import axios from 'axios';

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(true); // State for authorization check
  const [loading, setLoading] = useState(true); // Loading state
  const [message, setMessage] = useState('');

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      setIsAuthorized(false);
      setLoading(false); // Stop loading if not authorized
      return;
    }

    const fetchUserDetails = async () => {
      try {
        // Fetch user details from your API
        const response = await axios.get('http://192.168.1.124:8000/api/hospital/details/', {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Pass JWT in the Authorization header
          },
        });

        setUserDetails(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error.response ? error.response.data : error.message);
        setMessage('Failed to load user details.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails(); // Call the function to fetch user details
  }, []);

  if (!isAuthorized) {
    return <UnauthorizedMessage>You are not authorized to view this profile. Please log in.</UnauthorizedMessage>;
  }

  if (loading) {
    return <LoadingMessage>Loading user details...</LoadingMessage>;
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <h1>{userDetails.hospital_name}</h1>
        <UserRole>{userDetails.staff_name}</UserRole>
      </ProfileHeader>
      
      <ProfileDetail>
        <FaEnvelope /> <strong>Email:</strong> {userDetails.email}
      </ProfileDetail>
      <ProfileDetail>
        <FaMapMarkerAlt /> <strong>Address:</strong> {userDetails.address}
      </ProfileDetail>
      <ProfileDetail>
        <FaPhone /> <strong>Phone:</strong> {userDetails.contact_info}
      </ProfileDetail>
    </ProfileContainer>
  );
};

// Styled components
const ProfileContainer = styled.div`
  padding: 30px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 500px; /* Set a max width for the profile container */
  margin: auto; /* Center the container */
  font-family: 'Arial', sans-serif; /* Use a modern font */
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const UserRole = styled.p`
  font-size: 16px;
  color: #6c757d; /* Gray color for role */
  margin: 5px 0 15px;
`;

const ProfileDetail = styled.div`
  display: flex;
  align-items: center;
  margin: 15px 0;
  font-size: 16px;
  color: #343a40; /* Dark color for text */

  strong {
    margin-left: 10px;
    color: #495057; /* Slightly lighter color for strong text */
  }

  svg {
    color: #7dce82; /* Green color for icons */
    margin-right: 10px; /* Space between icon and text */
    font-size: 20px; /* Size of the icons */
  }
`;

const UnauthorizedMessage = styled.p`
  color: red;
  text-align: center;
  font-size: 18px;
  margin: 20px 0; /* Spacing for the unauthorized message */
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 18px;
  margin: 20px 0; /* Spacing for the loading message */
`;

export default Profile;
