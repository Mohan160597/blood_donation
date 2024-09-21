import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useLayoutEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// Validation schema
const validationSchema = yup.object().shape({
  firstname: yup.string().required('First name is required'),
  lastname: yup.string().required('Last name is required'),
  dob: yup.string().required('Date of birth is required'),
  gender: yup.string().required('Gender is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  blood_type: yup.string().required('Blood type is required'),
  phone_number: yup.string().required('Phone number is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const DonorRegistrationScreen = () => {
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
      const response = await axios.post('http://192.168.94.11:8000/api/register/donor/', values);

      if (response.status === 201) {
        navigation.navigate('Confirmation', { role: 'donor' });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const { email, phone_number, password } = error.response.data;
        if (email) {
          Alert.alert('Registration Error', email);
        }
        if (phone_number) {
          Alert.alert('Registration Error', phone_number);
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
        initialValues={{ firstname: '', lastname: '', dob: '', gender: '', email: '', blood_type: '', phone_number: '', password: '', confirmPassword: '' }}
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

            <Text style={styles.label}>Date of Birth</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('dob')}
              onBlur={handleBlur('dob')}
              value={values.dob}
              placeholder="Enter your date of birth (YYYY-MM-DD)"
            />
            {errors.dob && touched.dob && <Text style={styles.error}>{errors.dob}</Text>}

            {/* Gender and Blood Type */}
            <Text style={styles.label}>Gender</Text>
            <RNPickerSelect
              style={pickerSelectStyles}
              onValueChange={(value) => setFieldValue('gender', value)}
              value={values.gender}
              items={[
                { label: 'Male', value: 'Male' },
                { label: 'Female', value: 'Female' },
                { label: 'Other', value: 'Other' },
              ]}
              placeholder={{ label: 'Select your gender', value: '' }}
            />
            {errors.gender && touched.gender && <Text style={styles.error}>{errors.gender}</Text>}

            <Text style={styles.label}>Blood Type</Text>
            <RNPickerSelect
              style={pickerSelectStyles}
              onValueChange={(value) => setFieldValue('blood_type', value)}
              value={values.blood_type}
              items={[
                { label: 'A+', value: 'A+' },
                { label: 'A-', value: 'A-' },
                { label: 'B+', value: 'B+' },
                { label: 'B-', value: 'B-' },
                { label: 'AB+', value: 'AB+' },
                { label: 'AB-', value: 'AB-' },
                { label: 'O+', value: 'O+' },
                { label: 'O-', value: 'O-' },
              ]}
              placeholder={{ label: 'Select your blood type', value: '' }}
            />
            {errors.blood_type && touched.blood_type && <Text style={styles.error}>{errors.blood_type}</Text>}

            {/* Phone and Password Fields */}
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('phone_number')}
              onBlur={handleBlur('phone_number')}
              value={values.phone_number}
              placeholder="Enter your phone number"
            />
            {errors.phone_number && touched.phone_number && <Text style={styles.error}>{errors.phone_number}</Text>}

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
                <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} size={24} color="black" />
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
                <FontAwesomeIcon icon={confirmPasswordVisible ? faEye : faEyeSlash} size={24} color="black" />
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
    backgroundColor: '#fff',
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

export default DonorRegistrationScreen;
