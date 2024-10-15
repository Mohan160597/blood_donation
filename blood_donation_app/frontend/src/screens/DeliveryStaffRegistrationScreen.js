import React, { useState, useLayoutEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; // Import KeyboardAwareScrollView


// Define gender options
const genderOptions = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' },
];

// Validation schema
const validationSchema = yup.object().shape({
  firstname: yup.string().required('First name is required'),
  lastname: yup.string().required('Last name is required'),
  gender: yup.string().required('Gender is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  license_number: yup.string().required('License number is required'),
  vehicle_type: yup.string().required('Vehicle type is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const DeliveryStaffRegistrationScreen = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigation = useNavigation();

  const route = useRoute();
  const { role } = route.params || {}; // Get the role parameter passed from the previous screen

  // Set dynamic header title based on the role
  useLayoutEffect(() => {
    let headerTitle;
    
    if (role === 'donor') {
      headerTitle = 'Donor Sign Up';
    } else if (role === 'deliveryStaff') {
      headerTitle = 'Delivery Staff Sign Up';
    } else {
      headerTitle = 'Sign Up'; 
    }

    navigation.setOptions({
      title: headerTitle,
    });
  }, [navigation, role]);

  const handleRegister = async (values) => {
    try {
      const response = await axios.post('http://192.168.1.124:8000/api/register/deliverystaff/', {
        firstname: values.firstname,
        lastname: values.lastname,
        gender: values.gender,
        email: values.email,
        license_number: values.license_number,
        vehicle_type: values.vehicle_type,
        password: values.password,
      });

      if (response.status === 201) {
        navigation.navigate('Confirmation', { role: 'delivery_staff' });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const { email, license_number, password } = error.response.data;

        if (email) {
          Alert.alert('Registration Error', email);
        }

        if (license_number) {
          Alert.alert('Registration Error', license_number);
        }
        if (password) {
          Alert.alert('Registration Error', password);
        }
      } else {
        Alert.alert('Registration Error', 'An unexpected error occurred.');
      }
    }
  };

  return (
    <KeyboardAwareScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Formik
        initialValues={{ firstname: '', lastname: '', gender: '', email: '', license_number: '', vehicle_type: '', password: '', confirmPassword: '' }}
        validationSchema={validationSchema}
        onSubmit={handleRegister}
      >
        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
          <View style={styles.container}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('firstname')}
              onBlur={handleBlur('firstname')}
              value={values.firstname}
              placeholder="Enter your first name"
            />
            {errors.firstname && touched.firstname && <Text style={styles.error}>{errors.firstname}</Text>}

            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('lastname')}
              onBlur={handleBlur('lastname')}
              value={values.lastname}
              placeholder="Enter your last name"
            />
            {errors.lastname && touched.lastname && <Text style={styles.error}>{errors.lastname}</Text>}

            <Text style={styles.label}>Gender</Text>
            <RNPickerSelect
              style={pickerSelectStyles}
              onValueChange={(value) => setFieldValue('gender', value)}
              onBlur={handleBlur('gender')}
              value={values.gender}
              items={genderOptions}
              placeholder={{ label: 'Select your gender', value: '' }}
            />
            {errors.gender && touched.gender && <Text style={styles.error}>{errors.gender}</Text>}

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              placeholder="Enter your email"
            />
            {errors.email && touched.email && <Text style={styles.error}>{errors.email}</Text>}

            <Text style={styles.label}>License Number</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('license_number')}
              onBlur={handleBlur('license_number')}
              value={values.license_number}
              placeholder="Enter your license number"
            />
            {errors.license_number && touched.license_number && <Text style={styles.error}>{errors.license_number}</Text>}

            <Text style={styles.label}>Vehicle Type</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('vehicle_type')}
              onBlur={handleBlur('vehicle_type')}
              value={values.vehicle_type}
              placeholder="Enter your vehicle type"
            />
            {errors.vehicle_type && touched.vehicle_type && <Text style={styles.error}>{errors.vehicle_type}</Text>}

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                placeholder="Enter your password"
                secureTextEntry={!passwordVisible}
              />
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} size={24} />
              </TouchableOpacity>
            </View>
            {errors.password && touched.password && <Text style={styles.error}>{errors.password}</Text>}

            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                value={values.confirmPassword}
                placeholder="Confirm your password"
                secureTextEntry={!confirmPasswordVisible}
              />
              <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                <FontAwesomeIcon icon={confirmPasswordVisible ? faEye : faEyeSlash} size={24} />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && touched.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}

            <Button title="Register" onPress={handleSubmit} />
          </View>
        )}
      </Formik>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#ccc',
    flex: 1,
  },
  label: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#ccc',
    marginBottom: 16,
  },
  inputAndroid: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#ccc',
    marginBottom: 16,
  },
});

export default DeliveryStaffRegistrationScreen;