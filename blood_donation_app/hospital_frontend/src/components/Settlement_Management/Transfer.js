import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
} from '@mui/material';

const BloodTransfer = () => {
  // Hardcoded values
  const [patientName, setPatientName] = useState("John Doe");
  const [bloodType, setBloodType] = useState("O+");
  const [donorHospital, setDonorHospital] = useState("City Hospital");
  const [recipientHospital, setRecipientHospital] = useState("County Hospital");
  const accessToken = "your-access-token"; // Replace with your actual token
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode

  const handleTransfer = async () => {
    const transferData = {
      patient_name: patientName,
      blood_type: bloodType,
      donor_hospital: donorHospital,
      recipient_hospital: recipientHospital,
    };

    try {
      const response = await axios.post('http://192.168.1.124:8000/api/blood-transfer/', transferData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setMessage(`Transfer successful: ${response.data.message}`);
      // Reset fields if needed after successful transfer
    } catch (error) {
      setMessage(`Transfer failed: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  const handleSave = () => {
    // Logic to handle save, if necessary
    setIsEditing(false); // Exit editing mode
  };

  return (
    <Container maxWidth="sm">
      <Card variant="outlined">
        <CardContent>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" align="center" gutterBottom>
              Blood Transfer Request
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setIsEditing(prev => !prev)} // Toggle editing mode
            >
              {isEditing ? 'Cancel Edit' : 'Edit'}
            </Button>
          </div>
          <Typography variant="h6">Patient Information</Typography>
          <TextField
            label="Patient Name"
            value={patientName}
            fullWidth
            margin="normal"
            onChange={(e) => setPatientName(e.target.value)}
            disabled={!isEditing} // Disable if not in editing mode
          />
          <TextField
            label="Blood Type"
            value={bloodType}
            fullWidth
            margin="normal"
            onChange={(e) => setBloodType(e.target.value)}
            disabled={!isEditing} // Disable if not in editing mode
          />
          <Typography variant="h6">Hospital Information</Typography>
          <TextField
            label="Donor Hospital"
            value={donorHospital}
            fullWidth
            margin="normal"
            onChange={(e) => setDonorHospital(e.target.value)}
            disabled={!isEditing} // Disable if not in editing mode
          />
          <TextField
            label="Recipient Hospital"
            value={recipientHospital}
            fullWidth
            margin="normal"
            onChange={(e) => setRecipientHospital(e.target.value)}
            disabled={!isEditing} // Disable if not in editing mode
          />
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="contained"
              color="success"
              onClick={isEditing ? handleSave : handleTransfer} 
              style={{ flex: 1, marginRight: '8px' }} 
            >
              {isEditing ? 'Save' : 'Transfer Blood'} 
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setIsEditing(prev => !prev)} // Toggle editing mode
              style={{ flex: 1, marginLeft: '8px' }} // Adjust spacing
            >
              {isEditing ? 'Cancel Edit' : 'Edit'} 
            </Button>
          </div>
          {message && (
            <Alert severity={message.includes('failed') ? 'error' : 'success'} style={{ marginTop: '16px' }}>
              {message}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default BloodTransfer;
