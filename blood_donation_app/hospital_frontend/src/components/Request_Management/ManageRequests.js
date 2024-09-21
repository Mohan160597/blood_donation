import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null); // Track which request is being edited
  const [editingStatus, setEditingStatus] = useState(''); // Track the status being edited
  const [editingQuantity, setEditingQuantity] = useState(''); // Track the quantity being edited
  const [message, setMessage] = useState(''); // Success or error message

  // Fetch requests from the API
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get('http://192.168.35.11:8000/api/blood-requests/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setRequests(response.data);
        setFilteredRequests(response.data); // Set initial filtered requests
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
      // Make a PUT request to update the status and quantity of the blood request
      await axios.put(
        `http://192.168.94.11:8000/api/blood-requests/${id}/`,
        { status: editingStatus, quantity: editingQuantity },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Update the local state after saving to the server
      const updatedRequests = requests.map((req) =>
        req.id === id ? { ...req, status: editingStatus, quantity: editingQuantity } : req
      );
      setRequests(updatedRequests);
      setFilteredRequests(updatedRequests);
      setEditingId(null); // Stop editing after successful update
      setMessage('Request saved successfully!'); // Show success message
    } catch (error) {
      console.error('Error updating request:', error);
      setMessage('Failed to save request.'); // Show error message
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
                  <input
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
                  <select
                    value={editingStatus}
                    onChange={(e) => setEditingStatus(e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                ) : (
                  request.status
                )}
              </td>
              <td>
                {editingId === request.id ? (
                  <button onClick={() => handleSaveChanges(request.id)}>Save</button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(request.id);
                      setEditingStatus(request.status); // Set the initial status value for editing
                      setEditingQuantity(request.quantity); // Set the initial quantity value for editing
                    }}
                  >
                    Edit
                  </button>
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
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const RequestTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }

  th {
    background-color: #f2f2f2;
    text-align: left;
  }
`;

const Message = styled.p`
  color: ${(props) => (props.error ? 'red' : 'green')};
  text-align: center;
  font-size: 16px;
  margin-bottom: 20px;
`;

export default ManageRequests;
