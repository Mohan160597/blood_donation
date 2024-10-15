import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
// Import API_BASE_URL from a separate configuration file for API URLs
// import { API_BASE_URL } from './apiconfig';

export default function DonorLoginPage({ route }) {
  const { role } = route?.params || {}; // Safe handling if route.params is undefined
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
  const [isLoading, setIsLoading] = useState(false); // Loading state for the login process
  const navigation = useNavigation();

// Function to handle saving donor ID along with JWT tokens securely
const storeTokens = async (access, refresh) => {
  try {
    await AsyncStorage.multiSet([
      ['@access_token', access],
      ['@refresh_token', refresh],
      
    ]);
  } catch (error) {
    console.error('Error saving tokens and donor ID', error);
  }
};

  const handleLogin = async () => {
    // Simple validation to ensure both fields are filled
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please fill in both email and password fields.');
      return;
    }

    setIsLoading(true); // Start loading indicator

    try {
      // Send login request to the backend
      const response = await axios.post('http://192.168.1.124:8000/api/login/donor/', {
        email,
        password,
      });

      if (response.status === 200) {
        const { access, refresh } = response.data;
        await storeTokens(access, refresh); // Store tokens

        Alert.alert('Login Success', 'You are now logged in.');
        navigation.reset({
          index: 0,
          routes: [{ name: 'DonorDashboard' }], // Reset navigation stack to DonorDashboard
        });
      }
    } catch (error) {
      // Handle errors during login
      if (error.response && error.response.data) {
        Alert.alert('Login Error', error.response.data.detail || 'Invalid email or password.');
      } else {
        Alert.alert('Login Error', 'Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login as Donor</Text>
      
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="black"
      />

      {/* Password input with eye icon for visibility toggle */}
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible} // Toggles password visibility
          style={styles.passwordInput}
          placeholderTextColor="black"
        />
        <TouchableOpacity
          onPress={() => setPasswordVisible(!passwordVisible)} // Toggle password visibility
          style={styles.eyeIcon}
        >
          <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Display loading indicator while logging in */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}

      <TouchableOpacity onPress={() => navigation.navigate('SignUp', { role })}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 4,
    fontSize: 16,
    color: 'black',
  },
  passwordContainer: {
    position: 'relative',
    marginVertical: 10,
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    paddingRight: 40, // Add padding to avoid icon overlap with text
    borderRadius: 4,
    fontSize: 16,
    color: 'black',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10, // Position the icon inside TextInput
    top: 15,   // Adjust vertical alignment to center the icon
  },
  link: {
    color: 'blue',
    marginTop: 20,
    textAlign: 'center',
  },
});
