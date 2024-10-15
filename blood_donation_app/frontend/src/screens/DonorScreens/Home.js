import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';

// Import local blood drop and blood bag icons from the assets folder
const bloodDropIcon = require('../blood_drop.png'); // Adjust the path
const bloodBagIcon = require('../blood-bag.png');   // Adjust the path

const notifications = [
  {
    id: 1,
    bloodGroup: 'A+',
    units: '0.3 Unit',
    date: '25/09/2024',
  },
  {
    id: 2,
    bloodGroup: 'A+',
    units: '1 Unit',
    date: '18/08/2024',
  },
];

export default function Home() {
  // Render individual notification reminders in a simplified format
  const renderReminderCard = ({ item }) => (
    <View style={styles.reminderCard}>
      <Image
        source={bloodDropIcon} // Use the local blood drop image
        style={styles.bloodIcon}
      />
      <View style={styles.reminderInfo}>
        <Text style={styles.reminderText}>{item.units} ({item.bloodGroup})</Text>
        <Text style={styles.reminderDate}>Date: {item.date}</Text>
      </View>
      <TouchableOpacity style={styles.acceptButton}>
        <Text style={styles.acceptButtonText}>Accept</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Welcome and User ID section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeMessage}>Thank you for registering with us.</Text>
        <Text style={styles.welcomeBoldText}>YOU ARE NOW A DONAR</Text>
        <Image
          source={bloodDropIcon} // Use the local blood drop image
          style={styles.bloodIconLarge}
        />

      </View>

      {/* Reminder Section */}
      <Text style={styles.reminderTitle}>Reminders</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderReminderCard}
      />

      {/* Donate Button */}
      <TouchableOpacity style={styles.donateButton}>
        <Image source={bloodBagIcon} style={styles.bloodBagIcon} />
        <Text style={styles.donateButtonText}>Donate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  welcomeSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  welcomeMessage: {
    fontSize: 16,
    color: '#333',
  },
  welcomeBoldText: {
    fontSize: 18,
    color: '#f44336',
    fontWeight: 'bold',
  },
  bloodIconLarge: {
    width: 50,
    height: 50,
    marginVertical: 10,
  },
  userId: {
    fontSize: 14,
    color: '#666',
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'black'
  },
  reminderCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  bloodIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'black'
  },
  reminderDate: {
    fontSize: 14,
    color: '#666',
  },
  acceptButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  donateButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    borderColor: '#f44336',
    borderWidth: 2,
    marginHorizontal: 40,
    marginTop: 20,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  bloodBagIcon: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  donateButtonText: {
    color: '#f44336',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
