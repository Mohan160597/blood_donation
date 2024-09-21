import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
  FlatList,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faPhone,
  faLocationArrow,
  faShareAlt,
  faCheck,
  faMapMarkerAlt,
  faEllipsisV,
} from '@fortawesome/free-solid-svg-icons';

export default function RequestsScreen() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      bloodGroup: 'AB+',
      units: '0.3 Unit',
      distance: '3 Km',
      hospitalName: 'City Hospital',
      location: '470 Bourke St, Melbourne VIC 3000',
      timeLimit: '25/09/2024',
    },
    // You can add more notifications here
  ]);

  const [accepted, setAccepted] = useState(null); // To manage accepted state per notification
  const [menuVisible, setMenuVisible] = useState(false); // State to toggle three-dot menu after accept

  // Function to handle "Accept" button click
  const handleAccept = notificationId => {
    setAccepted(notificationId);
    Alert.alert('Accepted', 'You have accepted the request.');
  };

  // Function to handle navigation to hospital address
  const handleNavigate = hospitalAddress => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      hospitalAddress,
    )}`;
    Linking.openURL(url).catch(err => console.error('Error opening maps', err));
  };

  // Function to handle "Cancel Accept" button click
  const handleCancelAccept = () => {
    setAccepted(null);
    setMenuVisible(false); // Hide the menu when cancelling
    Alert.alert('Cancelled', 'You have cancelled the acceptance.');
  };

  // Function to handle clearing a single notification
  const handleClearNotification = notificationId => {
    // Prevent clearing if the notification is accepted
    if (accepted === notificationId) {
      Alert.alert('Error', 'You cannot clear an accepted notification.');
      return;
    }
    setNotifications(
      notifications.filter(notification => notification.id !== notificationId),
    );
  };

  const renderNotificationCard = ({item}) => (
    <View style={styles.card}>
      {/* Blood group and icon */}
      <View style={styles.bloodGroupContainer}>
        <Image
          source={{uri: 'https://example.com/blood-drop-icon.png'}} // Use your blood drop icon URL
          style={styles.bloodDropIcon}
        />
        <Text style={styles.bloodGroup}>{item.bloodGroup}</Text>
        <Text style={styles.units}>{item.units}</Text>
      </View>

      {/* Hospital and location details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.distance}>{item.distance}</Text>
        <Text style={styles.hospitalName}>{item.hospitalName}</Text>
        <Text style={styles.location}>{item.location}</Text>
        <View style={styles.timeLimitContainer}>
          <Text style={styles.timeLimitLabel}>Time Limit:</Text>
          <Text style={styles.timeLimit}>{item.timeLimit}</Text>
        </View>
      </View>

      {/* Three Dot Menu */}
      {accepted === item.id && (
        <TouchableOpacity
          onPress={() => setMenuVisible(!menuVisible)}
          style={styles.menuButton}>
          <FontAwesomeIcon icon={faEllipsisV} size={24} color="#000" />
        </TouchableOpacity>
      )}

      {menuVisible && (
        <View style={styles.menuContainer}>
          <TouchableOpacity onPress={handleCancelAccept}>
            <Text style={styles.menuItem}>Cancel Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleClearNotification(item.id)}>
            <Text style={styles.menuItem}>Clear Notification</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Action buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesomeIcon icon={faShareAlt} size={20} color="#000" />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>

        {/* Toggle between Accept and Navigate button based on state */}
        {accepted !== item.id ? (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleAccept(item.id)}>
            <FontAwesomeIcon icon={faCheck} size={20} color="#000" />
            <Text style={styles.actionButtonText}>Accept</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleNavigate(item.hospitalName)}>
            <FontAwesomeIcon icon={faMapMarkerAlt} size={20} color="#000" />
            <Text style={styles.actionButtonText}>Navigate</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id.toString()}
        renderItem={renderNotificationCard}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bloodGroupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  bloodDropIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  bloodGroup: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  units: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  detailsContainer: {
    marginBottom: 10,
  },
  distance: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  timeLimitContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  timeLimitLabel: {
    fontSize: 14,
    color: '#666',
  },
  timeLimit: {
    fontSize: 14,
    color: '#fff',
    backgroundColor: '#4caf50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 5,
  },
  menuButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  menuContainer: {
    position: 'absolute',
    top: 35,
    right: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  menuItem: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 5,
  },
});
