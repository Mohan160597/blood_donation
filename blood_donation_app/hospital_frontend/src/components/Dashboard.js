import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import {
  FaBell,
  FaHome,
  FaUser,
  FaServicestack,
  FaSignOutAlt,
} from "react-icons/fa";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate

const Dashboard = ({ children }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(""); // State to track the current path
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); // useNavigate hook for navigation
  const location = useLocation(); // Get the current location

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // Clear access token
    localStorage.removeItem("refreshToken"); // Clear refresh token
    navigate("/login"); // Redirect to login page
  };

  // Update currentPath whenever location changes
  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  return (
    <DashboardContainer>
      <Header>
        <Logo src="/logo.png" alt="Logo" />
        <Menu>
          <MenuItem as={Link} to="/dashboard/home">
            <FaHome /> Home
          </MenuItem>

          <ServicesMenu ref={dropdownRef}>
            <MenuItem onClick={toggleDropdown}>
              <FaServicestack /> Services
            </MenuItem>
            {isDropdownOpen && (
              <Dropdown>
                <DropdownItem as={Link} to="/donor-management">Donor Management</DropdownItem>
                <DropdownItem as={Link} to="/delivery-management">Delivery Management</DropdownItem>
                <SubDropdown>
                  <DropdownItem>Request Management</DropdownItem>
                  <SubDropdownContent>
                    <DropdownItem as={Link} to="/dashboard/create-requests">Create Request</DropdownItem>
                    <DropdownItem as={Link} to="/dashboard/manage-requests">Manage Request</DropdownItem>
                  </SubDropdownContent>
                </SubDropdown>
                <SubDropdown>
                  <DropdownItem>Inventory Management</DropdownItem>
                  <SubDropdownContent>
                    <DropdownItem as={Link} to="/dashboard/bloodunit">Blood Units</DropdownItem>
                    <DropdownItem>Update Inventory</DropdownItem>
                  </SubDropdownContent>
                </SubDropdown>
                <SubDropdown>
                  <DropdownItem>Settlement Management</DropdownItem>
                  <SubDropdownContent>
                    <DropdownItem as={Link} to="/dashboard/transfer">Transfer</DropdownItem>
                  </SubDropdownContent>
                </SubDropdown>
              </Dropdown>
            )}
          </ServicesMenu>

          <MenuItem as={Link} to="/dashboard/profile">
            <FaUser /> Profile
          </MenuItem>
          <MenuItem onClick={toggleNotification}>
            <FaBell />
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </MenuItem>
        </Menu>
      </Header>

      {/* Update MainContent based on currentPath */}
      <MainContent key={currentPath}>{children}</MainContent>

      {isNotificationOpen && (
        <>
          <NotificationSidebar>
            <CloseButton onClick={toggleNotification}>X</CloseButton>
            <h3>Notifications</h3>
            <NotificationList>
              <NotificationItem>Notification 1</NotificationItem>
              <NotificationItem>Notification 2</NotificationItem>
              <NotificationItem>Notification 3</NotificationItem>
              <NotificationItem>Notification 4</NotificationItem>
            </NotificationList>
          </NotificationSidebar>
          <Overlay onClick={toggleNotification} />
        </>
      )}
    </DashboardContainer>
  );
};


const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  height: 100vh;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #343a40;
  color: white;
  height: 30px; /* Set a specific height for the header */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.img`
  height: 40px;
  cursor: pointer;
`;

const Menu = styled.nav`
  display: flex;
  gap: 20px;
  justify-content: end;
  flex-grow: 1;
  position: relative;
`;

const MenuItem = styled.a`
  color: white;
  text-decoration: none;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    color: #7dce82;
  }
`;

/* Services Menu with Click-to-Open Dropdown */
const ServicesMenu = styled.div`
  position: relative;
  display: inline-block;
`;

const Dropdown = styled.div`
  position: absolute;
  background-color: white;
  min-width: 200px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
  z-index: 1;
  margin-top: 5px;
  border-radius: 4px;
`;

const DropdownItem = styled.a`
  color: #343a40;
  padding: 10px 20px;
  text-decoration: none;
  display: block;
  white-space: nowrap;

  &:hover {
    background-color: #f1f1f1;
    color: #7dce82;
  }
`;

const SubDropdown = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`;

const SubDropdownContent = styled.div`
  position: absolute;
  right: 100%;
  top: 0;
  background-color: white;
  min-width: 200px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
  z-index: 1;
  display: none;
  ${SubDropdown}:hover & {
    display: block;
  }
`;

const MainContent = styled.div`
  padding: 20px;
  flex-grow: 1;
  background-color: #ffffff;
  border-radius: 8px;
  min-height: calc(100vh - 30px);
  overflow-y: auto; /* Enable vertical scrolling */
  overflow-x: auto; /* Enable horizontal scrolling */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const NotificationSidebar = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  height: 100%;
  width: 300px;
  background-color: #ffffff;
  box-shadow: -4px 0 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  z-index: 1000;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  &:hover {
    color: red;
  }
`;

const NotificationList = styled.ul`
  list-style: none;
  padding: 0;
`;

const NotificationItem = styled.li`
  padding: 10px;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

export default Dashboard;
