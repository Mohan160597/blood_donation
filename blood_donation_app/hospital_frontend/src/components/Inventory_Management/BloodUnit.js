import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const BloodUnit = () => {
  const [inventory, setInventory] = useState([]);
  const [selectedBloodType, setSelectedBloodType] = useState(null);
  const [bloodTypeDetails, setBloodTypeDetails] = useState([]);
  const [newBloodUnit, setNewBloodUnit] = useState({ blood_type: '', quantity: '', expiration_date: '' });
  const [editingUnitId, setEditingUnitId] = useState(null);

  const accessToken = localStorage.getItem('accessToken');

  // Fetch blood unit summary on component mount
  useEffect(() => {
    fetchBloodUnits();
  }, []);

  const fetchBloodUnits = () => {
    axios
      .get('http://192.168.1.124:8000/api/blood-units/summary/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setInventory(response.data);
      })
      .catch((error) => {
        console.error('Error fetching blood units summary:', error);
      });
  };

  const handleBloodTypeClick = (bloodType) => {
    setSelectedBloodType(bloodType);
    setNewBloodUnit({ blood_type: bloodType, quantity: '', expiration_date: '' });
    axios
      .get(`http://192.168.1.124:8000/api/blood-units/type/${bloodType}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setBloodTypeDetails(response.data);
      })
      .catch((error) => {
        console.error('Error fetching blood type details:', error);
      });
  };

  const handleInputChange = (e) => {
    setNewBloodUnit({ ...newBloodUnit, [e.target.name]: e.target.value });
  };

// Create a new blood unit
const handleCreateBloodUnit = () => {
  axios
    .post('http://192.168.1.124:8000/api/blood-units/', newBloodUnit, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(() => {
      // Fetch the updated inventory after successful creation
      fetchBloodUnits(); // Refresh the inventory
      setNewBloodUnit({ blood_type: selectedBloodType, quantity: '' }); // Reset form
    })
    .catch((error) => {
      console.error('Error creating blood unit:', error);
    });
};

// Update an existing blood unit
const handleUpdateBloodUnit = () => {
  axios
    .put(`http://192.168.1.124:8000/api/blood-units/${editingUnitId}/`, newBloodUnit, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(() => {
      // Fetch the updated inventory after successful update
      fetchBloodUnits(); // Refresh the inventory
      setNewBloodUnit({ blood_type: selectedBloodType, quantity: '' }); // Reset form
      setEditingUnitId(null); // Reset after update
    })
    .catch((error) => {
      console.error('Error updating blood unit:', error);
    });
};

  const handleDeleteBloodUnit = (unitId) => {
    axios
      .delete(`http://192.168.1.124:8000/api/blood-units/${unitId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(() => {
        fetchBloodUnits();
      })
      .catch((error) => {
        console.error('Error deleting blood unit:', error);
      });
  };

  const handleEditBloodUnit = (unit) => {
    setNewBloodUnit({ blood_type: unit.blood_type, quantity: unit.quantity, expiration_date: unit.expiration_date });
    setEditingUnitId(unit.id);
  };

  return (
    <Container>
      <Header>Inventory Management</Header>
      <InventoryGrid>
        {inventory.map((bloodUnit) => (
          <BloodBox
            key={bloodUnit.blood_type}
            onClick={() => handleBloodTypeClick(bloodUnit.blood_type)}
          >
            <BloodType>{bloodUnit.blood_type}</BloodType>
            <UnitCount>{bloodUnit.total_quantity} Units</UnitCount>
            {bloodUnit.low_stock_alert && <StockLevel>Low Stock</StockLevel>}
            <CrudButtons>
              <EditButton onClick={() => handleEditBloodUnit(bloodUnit)}>Edit</EditButton>
              <DeleteButton onClick={() => handleDeleteBloodUnit(bloodUnit.id)}>Delete</DeleteButton>
            </CrudButtons>
          </BloodBox>
        ))}
      </InventoryGrid>

      {selectedBloodType && (
        <>
          <DetailSection>
            <DetailHeader>Details for {selectedBloodType}</DetailHeader>
            <DetailGrid>
              {bloodTypeDetails.map((unit) => (
                <DetailBox key={unit.id}>
                  <DetailText>Quantity: {unit.quantity}</DetailText>
                  <DetailText>Expiration Date: {unit.expiration_date}</DetailText>
                  <DetailText>Days to Expire: {unit.days_to_expire}</DetailText>
                </DetailBox>
              ))}
            </DetailGrid>
          </DetailSection>

          <FormSection>
            <FormHeader>{editingUnitId ? 'Update Blood Unit' : 'Create Blood Unit'}</FormHeader>
            <Form>
              <Input
                type="text"
                name="blood_type"
                placeholder="Blood Type"
                value={newBloodUnit.blood_type}
                onChange={handleInputChange}
                disabled
              />
              <Input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={newBloodUnit.quantity}
                onChange={handleInputChange}
              />
              <Button onClick={editingUnitId ? handleUpdateBloodUnit : handleCreateBloodUnit}>
                {editingUnitId ? 'Update Blood Unit' : 'Create Blood Unit'}
              </Button>
            </Form>
          </FormSection>
        </>
      )}
    </Container>
  );
};

// Styled Components (unchanged from original code)
const Container = styled.div`
  padding: 20px;
  background-color: #f8f9fa;
`;

const Header = styled.h1`
  text-align: center;
  font-size: 28px;
  margin-bottom: 30px;
  font-weight: bold;
`;

const InventoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
  margin-bottom: 40px;
`;

const BloodBox = styled.div`
  background-color: #ff4d4d;
  color: white;
  padding: 20px;
  text-align: center;
  font-size: 18px;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
`;

const BloodType = styled.div`
  font-size: 24px;
  font-weight: bold;
`;

const UnitCount = styled.div`
  font-size: 20px;
  margin-top: 10px;
`;

const StockLevel = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: #fff;
  color: black;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 14px;
`;

const CrudButtons = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  display: flex;
  gap: 10px;
`;

const EditButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  background-color: #dc3545;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const FormSection = styled.div`
  margin-top: 40px;
`;

const FormHeader = styled.h2`
  font-size: 22px;
  margin-bottom: 20px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const DetailSection = styled.div`
  margin-top: 40px;
`;

const DetailHeader = styled.h2`
  font-size: 22px;
  margin-bottom: 20px;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
`;

const DetailBox = styled.div`
  background-color: #fff;
  padding: 20px;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const DetailText = styled.p`
  font-size: 16px;
`;

export default BloodUnit;
