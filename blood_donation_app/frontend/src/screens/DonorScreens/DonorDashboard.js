import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faBell, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import HospitalsScreen from './HospitalsScreen';
import RequestsScreen from './RequestsScreen';
import ProfileScreen from './ProfileScreen';
import Home from './Home';

const { width } = Dimensions.get('window');
const Tab = createBottomTabNavigator();

const CustomHeader = ({ onMenuPress }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onMenuPress}>
        <FontAwesomeIcon icon={faBars} size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Donor Dashboard</Text>
      <TouchableOpacity onPress={() => alert('Notifications')}>
        <FontAwesomeIcon icon={faBell} size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

function SafeAreaWrapper(Component) {
  return function WrappedComponent(props) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Component {...props} />
      </SafeAreaView>
    );
  };
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Hospitals') {
            iconName = 'hospital';
          } else if (route.name === 'Requests') {
            iconName = 'list-alt';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }
          return <FontAwesomeIcon icon={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#e91e63',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={SafeAreaWrapper(Home)} />
      <Tab.Screen name="Hospitals" component={SafeAreaWrapper(HospitalsScreen)} />
      <Tab.Screen name="Requests" component={SafeAreaWrapper(RequestsScreen)} />
      <Tab.Screen name="Profile" component={SafeAreaWrapper(ProfileScreen)} />
    </Tab.Navigator>
  );
}

export default function DonorDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width * 0.75)).current; // Start position off-screen
  const navigation = useNavigation();

  const toggleMenu = () => {
    if (menuOpen) {
      Animated.timing(slideAnim, {
        toValue: -width * 0.75,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setMenuOpen(false));
    } else {
      setMenuOpen(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['@access_token', '@refresh_token']);
      navigation.reset({
        index: 0,
        routes: [{ name: 'DonorLogin' }],
      });
    } catch (error) {
      console.error('Error during logout', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader onMenuPress={toggleMenu} />
      <TabNavigator />

      {menuOpen && (
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <Animated.View style={[styles.sideMenu, { transform: [{ translateX: slideAnim }] }]}>
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} size={24} color="#000" />
          <Text style={styles.menuText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#fff',
    elevation: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sideMenu: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: width * 0.5,
    backgroundColor: '#fff',
    paddingVertical: 50,
    paddingHorizontal: 20,
    elevation: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  menuText: {
    fontSize: 18,
    marginLeft: 10,
    color: 'black',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
