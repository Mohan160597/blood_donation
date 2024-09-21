import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; // Added useRoute

const ConfirmationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { role } = route.params;

  const handleLoginNavigation = () => {
    if (role === 'donor') {
      navigation.navigate('DonorLogin', {role}); // Navigate to donor login screen
    } else if (role === 'delivery_staff') {
      navigation.navigate('DeliveryStaffLogin', {role}); // Navigate to delivery staff login screen
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.message}>Registered Successfully!</Text>
      <Button
        title={`Login as ${role === 'donor' ? 'Donor' : 'Delivery Staff'}`}
        onPress={handleLoginNavigation} // Updated the button onPress handler
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontSize: 24,
    marginBottom: 20,
    color: 'green',
  },
});

export default ConfirmationScreen;