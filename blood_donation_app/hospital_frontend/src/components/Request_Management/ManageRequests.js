import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaEdit, FaSave, FaTrash } from 'react-icons/fa';

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingStatus, setEditingStatus] = useState('');
  const [editingQuantity, setEditingQuantity] = useState('');
  const [message, setMessage] = useState('');

  // Fetch requests from the API
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get('http://192.168.1.124:8000/api/blood-requests/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setRequests(response.data);
        setFilteredRequests(response.data);
      } catch (error) {
        console.error('Error fetching blood requests:', error);
      }
    };

    fetchRequests();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    const filtered = requests.filter(
      (req) =>
        req.blood_type.toLowerCase().includes(e.target.value.toLowerCase()) ||
        req.status.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredRequests(filtered);
  };

  // Handle status and quantity change for a specific request
  const handleSaveChanges = async (id) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.put(
        `http://192.168.1.124:8000/api/blood-requests/${id}/`,
        { status: editingStatus, quantity: editingQuantity },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const updatedRequests = requests.map((req) =>
        req.id === id ? { ...req, status: editingStatus, quantity: editingQuantity } : req
      );
      setRequests(updatedRequests);
      setFilteredRequests(updatedRequests);
      setEditingId(null);
      setMessage('Request saved successfully!');
    } catch (error) {
      console.error('Error updating request:', error);
      setMessage('Failed to save request.');
    }
  };

  return (
    <ManageContainer>
      <h2>Manage Blood Requests</h2>

      {/* Search Filter */}
      <SearchInput
        type="text"
        placeholder="Search by blood type or status..."
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {/* Success/Error Message */}
      {message && <Message>{message}</Message>}

      <RequestTable>
        <thead>
          <tr>
            <th>ID</th>
            <th>Blood Type</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map((request) => (
            <tr key={request.id}>
              <td>{request.id}</td>
              <td>{request.blood_type}</td>
              <td>
                {editingId === request.id ? (
                  <Input
                    type="number"
                    value={editingQuantity}
                    onChange={(e) => setEditingQuantity(e.target.value)}
                    min="1"
                  />
                ) : (
                  request.quantity
                )}
              </td>
              <td>
                {editingId === request.id ? (
                  <Select
                    value={editingStatus}
                    onChange={(e) => setEditingStatus(e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </Select>
                ) : (
                  request.status
                )}
              </td>
              <td>
                {editingId === request.id ? (
                  <ActionButton onClick={() => handleSaveChanges(request.id)}>
                    <FaSave /> Save
                  </ActionButton>
                ) : (
                  <ActionButton
                    onClick={() => {
                      setEditingId(request.id);
                      setEditingStatus(request.status);
                      setEditingQuantity(request.quantity);
                    }}
                  >
                    <FaEdit /> Edit
                  </ActionButton>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </RequestTable>
    </ManageContainer>
  );
};

// Styled components
const ManageContainer = styled.div`
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px; /* Increased border-radius */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif; /* Modern font */
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 6px; /* Increased border-radius */
  font-size: 16px;
  transition: border 0.3s;

  &:focus {
    border-color: #007bff; /* Focused border color */
    outline: none; /* Remove outline */
  }
`;

const RequestTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    border: 1px solid #ddd;
    padding: 12px; /* Increased padding for better spacing */
    text-align: left; /* Align text to the left */
  }

  th {
    background-color: #f8f9fa; /* Light background for headers */
    font-weight: bold; /* Bold font for headers */
  }

  tr:hover {
    background-color: #f1f1f1; /* Highlight row on hover */
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  transition: border 0.3s;

  &:focus {
    border-color: #007bff; /* Focused border color */
    outline: none; /* Remove outline */
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  transition: border 0.3s;

  &:focus {
    border-color: #007bff; /* Focused border color */
    outline: none; /* Remove outline */
  }
`;

const ActionButton = styled.button`
  background-color: #007bff; /* Primary button color */
  color: white;
  border: none;
  border-radius: 4px; /* Rounded corners */
  padding: 8px 12px; /* Button padding */
  cursor: pointer;
  font-size: 16px;
  display: flex; /* Flex layout for icon and text */
  align-items: center; /* Center icon and text */
  gap: 5px; /* Space between icon and text */
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3; /* Darker shade on hover */
  }
`;

const Message = styled.p`
  color: ${(props) => (props.error ? 'red' : 'green')};
  text-align: center;
  font-size: 16px;
  margin-bottom: 20px;
`;

export default ManageRequests;
