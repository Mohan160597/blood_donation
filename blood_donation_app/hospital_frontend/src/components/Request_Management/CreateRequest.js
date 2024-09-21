import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const CreateBloodRequest = () => {
  const [formData, setFormData] = useState({
    blood_type: 'A+', // Default blood type
    quantity: '',
    priority_level: 'normal', // Default priority level
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        setMessage('You are not authorized. Please log in.');
        setLoading(false);
        return;
      }

      // Send a POST request to create a blood request
      const response = await axios.post('http://192.168.35.11:8000/api/blood-requests/', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Pass JWT in the Authorization header
        },
      });

      setMessage('Blood request created successfully!');
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      setMessage('Failed to create blood request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <h2>Create Blood Request</h2>
      <form onSubmit={handleSubmit}>
        {message && <Message>{message}</Message>}

        <InputLabel>
          Blood Type:
          <Select name="blood_type" value={formData.blood_type} onChange={handleChange} required>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </Select>
        </InputLabel>

        <InputLabel>
          Quantity (in units):
          <Input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="1" // Minimum 1 unit
          />
        </InputLabel>

        <InputLabel>
          Priority Level:
          <Select name="priority_level" value={formData.priority_level} onChange={handleChange} required>
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
          </Select>
        </InputLabel>

        <Button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </FormContainer>
  );
};

// Styled components remain the same


// Styled components

const FormContainer = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 10px;
  font-size: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 20px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 20px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Message = styled.p`
  color: ${(props) => (props.error ? 'red' : 'green')};
  text-align: center;
`;

export default CreateBloodRequest;
