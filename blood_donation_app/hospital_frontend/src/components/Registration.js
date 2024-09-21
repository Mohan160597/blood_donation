import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';


const Register = () => {
  const [formData, setFormData] = useState({
    hospital_name: '',
    staff_name: '',
    staff_id: '',
    email: '',
    contact_info: '',
    address: '',
    documents: null,
    password: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, documents: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await axios.post('http://192.168.35.11:8000/api/register/hospital/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error: Unable to register. Check your inputs.');
    }
  };

  return (
    <Container>
      <Header>
        <NavButtons>
          <Link to="/login">
            <Button className="login-btn">Login</Button>
          </Link>
          <Link to="/landingpage">
            <Button className="Home">Home</Button>
          </Link>
        </NavButtons>
      </Header>
      <Title>Hospital Registration</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="hospital_name"
          placeholder="Hospital Name"
          value={formData.hospital_name}
          onChange={handleChange}
          required
        />
        <Input
          type="text"
          name="staff_name"
          placeholder="Staff Name"
          value={formData.staff_name}
          onChange={handleChange}
          required
        />
        <Input
          type="text"
          name="staff_id"
          placeholder="Staff ID"
          value={formData.staff_id}
          onChange={handleChange}
          required
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Input
          type="text"
          name="contact_info"
          placeholder="Contact Information"
          value={formData.contact_info}
          onChange={handleChange}
          required
        />
        <Textarea
          name="address"
          placeholder="Hospital Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <Input
          type="file"
          name="documents"
          onChange={handleFileChange}
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
        <Button type="submit">Register</Button>
      </Form>
      {message && <Message success={message.includes('success')}>{message}</Message>}
    </Container>
  );
};


const Header = styled.header`
  background-color: white;
  padding: 10px;
  color: #fff;
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  transition: background-color 0.3s ease-in-out;
`;

const NavButtons = styled.div`
  display: flex;
  justify-content: end;
  padding: 0 30px;
`;


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px auto;
  padding: 20px;
  max-width: 400px;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Input = styled.input`
  margin-bottom: 15px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
  
  &:focus {
    border-color: #7dce82;
  }
`;

const Textarea = styled.textarea`
  margin-bottom: 15px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
  resize: vertical;

  &:focus {
    border-color: #7dce82;
  }
`;

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  background-color: #7dce82;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #67b468;
  }

  &.login-btn {
    background-color: #007bff;
    color: white;
    margin-right: 20px;
    &:hover {
      background-color: #0056b3;
    }
  }

  &.Home {
    background-color: red;
    color: white;
    &:hover {
      background-color: red;
    }
  }

`;

const Message = styled.p`
  margin-top: 20px;
  color: ${props => (props.success ? 'green' : 'red')};
`;

export default Register;
