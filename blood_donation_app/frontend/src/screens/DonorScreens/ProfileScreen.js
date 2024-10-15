import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView, // Import ScrollView
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function ProfileScreen() {
  const [profilePic, setProfilePic] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstname: '',
    lastname: '',
    dob: '',
    gender: '',
    email: '',
    bloodType: '',
    phoneNumber: '',
  });

  useEffect(() => {
    // Fetch user details when the component mounts
    getAccessTokenAndFetchDetails();
  }, []);

  // Fetch the access token and then fetch user details
  const getAccessTokenAndFetchDetails = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('@access_token');
      if (accessToken) {
        fetchUserDetails(accessToken);
      } else {
        Alert.alert('Error', 'Access token not found.');
      }
    } catch (error) {
      console.log('Error retrieving access token:', error);
    }
  };

  // Fetch user details
  const fetchUserDetails = async (accessToken) => {
    try {
      const response = await axios.get(`http://192.168.1.124:8000/api/donor/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const userData = response.data;

      // Set user information
      setUserInfo({
        firstname: userData.firstname || '',
        lastname: userData.lastname || '',
        dob: userData.dob || '',
        gender: userData.gender || '',
        email: userData.email || '',
        bloodType: userData.blood_type || '',
        phoneNumber: userData.phone_number || '',
      });

      // If there’s a profile picture in the response, set it
      if (userData.profile_picture) {
        setProfilePic({ uri: userData.profile_picture });
      }
    } catch (error) {
      console.log('Error fetching user details:', error);
    }
  };

  // Function to handle profile picture update
  const handleProfilePicUpdate = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const source = { uri: response.assets[0].uri };
        setProfilePic(source);
      }
    });
  };

  // Function to handle saving updated user information
  const handleSave = async () => {
    const accessToken = await AsyncStorage.getItem('@access_token');
    if (accessToken) {
      try {
        await axios.put(`http://192.168.1.124:8000/api/donor/`, userInfo, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        Alert.alert('Success', 'Profile updated successfully.');
        setIsEditing(false); // Exit editing mode after saving
      } catch (error) {
        console.log('Error updating user details:', error);
        Alert.alert('Error', 'Failed to update profile.');
      }
    } else {
      Alert.alert('Error', 'Access token not found.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Picture */}
      <TouchableOpacity
        onPress={handleProfilePicUpdate}
        style={styles.profilePicContainer}>
        {profilePic ? (
          <Image source={profilePic} style={styles.profilePic} />
        ) : (
          <Image
            source={{ uri: 'https://example.com/default-profile-pic.png' }}
            style={styles.profilePic}
          />
        )}
      </TouchableOpacity>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <Text style={styles.infoTitle}>Profile</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              if (isEditing) {
                handleSave(); // Save the changes if editing
              } else {
                setIsEditing(true); // Enable editing
              }
            }}>
            <Text style={styles.editButtonText}>
              {isEditing ? 'Save' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Display or Edit User Information */}
        <View style={styles.infoList}>
          <View style={styles.card}>
            <Text style={styles.infoLabel}>Name:</Text>
            {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={`${userInfo.firstname} ${userInfo.lastname}`}
                onChangeText={text => {
                  const [firstname, lastname] = text.split(' ');
                  setUserInfo(prev => ({
                    ...prev,
                    firstname: firstname || '',
                    lastname: lastname || '',
                  }));
                }}
              />
            ) : (
              <Text style={styles.infoValue}>
                {userInfo.firstname} {userInfo.lastname}
              </Text>
            )}
          </View>
          <View style={styles.card}>
            <Text style={styles.infoLabel}>DOB:</Text>
            {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={userInfo.dob}
                onChangeText={text =>
                  setUserInfo(prev => ({ ...prev, dob: text }))
                }
              />
            ) : (
              <Text style={styles.infoValue}>{userInfo.dob}</Text>
            )}
          </View>
          <View style={styles.card}>
            <Text style={styles.infoLabel}>Gender:</Text>
            {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={userInfo.gender}
                onChangeText={text =>
                  setUserInfo(prev => ({ ...prev, gender: text }))
                }
              />
            ) : (
              <Text style={styles.infoValue}>{userInfo.gender}</Text>
            )}
          </View>
          <View style={styles.card}>
            <Text style={styles.infoLabel}>Email:</Text>
            {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={userInfo.email}
                onChangeText={text =>
                  setUserInfo(prev => ({ ...prev, email: text }))
                }
              />
            ) : (
              <Text style={styles.infoValue}>{userInfo.email}</Text>
            )}
          </View>
          <View style={styles.card}>
            <Text style={styles.infoLabel}>Blood Type:</Text>
            {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={userInfo.bloodType}
                onChangeText={text =>
                  setUserInfo(prev => ({ ...prev, bloodType: text }))
                }
              />
            ) : (
              <Text style={styles.infoValue}>{userInfo.bloodType}</Text>
            )}
          </View>
          <View style={styles.card}>
            <Text style={styles.infoLabel}>Phone Number:</Text>
            {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={userInfo.phoneNumber}
                onChangeText={text =>
                  setUserInfo(prev => ({ ...prev, phoneNumber: text }))
                }
              />
            ) : (
              <Text style={styles.infoValue}>{userInfo.phoneNumber}</Text>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Allow the container to grow
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20, // Add padding for better spacing
  },
  profilePicContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  infoCard: {
    width: '100%', // Use full width
    backgroundColor: '#ffe0e0',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
  },
  infoList: {
    marginVertical: 10,
  },
  card: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 16,
    marginTop: 5,
  },
  infoInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
});
