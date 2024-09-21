import React from 'react';
import { View, StyleSheet } from 'react-native';
import DonorRegistrationScreen from './DonorRegistrationScreen';
import DeliveryStaffRegistrationScreen from './DeliveryStaffRegistrationScreen';

export default function SignUpPage({ route }) {
  const { role } = route.params;

  return (
    <View style={styles.container}>
      {role === 'donor' ? (
        <DonorRegistrationScreen />
      ) : (
        <DeliveryStaffRegistrationScreen />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});