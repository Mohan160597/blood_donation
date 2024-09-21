import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker'; // Import the new API

export default function ProfileScreen() {
  const [profilePic, setProfilePic] = useState(null); // State for profile pic
  const [isEditing, setIsEditing] = useState(false); // State to toggle between viewing and editing
  const [userInfo, setUserInfo] = useState({
    bloodGroup: 'A +ve',
    age: '23 year',
    weight: '50 kg',
    contactNo: '1234567890',
    email: 'abcd1@gmail.com',
  });

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
        const source = {uri: response.assets[0].uri}; // Use `response.assets` for the image
        setProfilePic(source);
      }
    });
  };

  // Function to handle profile info editing
  const handleSaveChanges = () => {
    setIsEditing(false);
    Alert.alert(
      'Profile Updated',
      'Your profile has been updated successfully.',
    );
  };

  return (
    <View style={styles.container}>
      {/* Profile Picture */}
      <TouchableOpacity
        onPress={handleProfilePicUpdate}
        style={styles.profilePicContainer}>
        {profilePic ? (
          <Image source={profilePic} style={styles.profilePic} />
        ) : (
          <Image
            source={{uri: 'https://example.com/default-profile-pic.png'}} // Default profile pic URL
            style={styles.profilePic}
          />
        )}
      </TouchableOpacity>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <Text style={styles.infoTitle}>Info</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}>
            <Text style={styles.editButtonText}>
              {isEditing ? 'Save' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Editable Information */}
        {isEditing ? (
          <View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Blood Group</Text>
              <TextInput
                style={styles.infoValue}
                value={userInfo.bloodGroup}
                onChangeText={text =>
                  setUserInfo(prev => ({...prev, bloodGroup: text}))
                }
              />
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Age</Text>
              <TextInput
                style={styles.infoValue}
                value={userInfo.age}
                onChangeText={text =>
                  setUserInfo(prev => ({...prev, age: text}))
                }
              />
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Weight</Text>
              <TextInput
                style={styles.infoValue}
                value={userInfo.weight}
                onChangeText={text =>
                  setUserInfo(prev => ({...prev, weight: text}))
                }
              />
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Contact No.</Text>
              <TextInput
                style={styles.infoValue}
                value={userInfo.contactNo}
                onChangeText={text =>
                  setUserInfo(prev => ({...prev, contactNo: text}))
                }
              />
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email</Text>
              <TextInput
                style={styles.infoValue}
                value={userInfo.email}
                onChangeText={text =>
                  setUserInfo(prev => ({...prev, email: text}))
                }
              />
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Blood Group</Text>
              <Text style={styles.infoValue}>{userInfo.bloodGroup}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Age</Text>
              <Text style={styles.infoValue}>{userInfo.age}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Weight</Text>
              <Text style={styles.infoValue}>{userInfo.weight}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Contact No.</Text>
              <Text style={styles.infoValue}>{userInfo.contactNo}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{userInfo.email}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
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
    width: '90%',
    backgroundColor: '#ffe0e0',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
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
    backgroundColor: '#f00',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  infoItem: {
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 5,
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#f00',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
