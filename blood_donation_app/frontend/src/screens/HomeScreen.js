import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
//import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'


export default function HomePage({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Are you a?</Text>

      <TouchableOpacity
        style={styles.slideButton}
        onPress={() => navigation.navigate('DonorLogin', { role: 'donor' })}
      >
        <Text style={styles.buttonText}>DONOR</Text>
        <FontAwesomeIcon icon="arrow-right" size={20} color="white" style={styles.arrowIcon} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.slideButton}
        onPress={() => navigation.navigate('DeliveryStaffLogin', { role: 'deliveryStaff' })}
      >
        <Text style={styles.buttonText}>DELIVERY DRIVER</Text>
        <FontAwesomeIcon icon="arrow-right" size={20} color="white" style={styles.arrowIcon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  slideButton: {
    flexDirection: 'row', 
    backgroundColor: '#B64245',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between', 
    width: '70%', 
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  arrowIcon: {
    marginLeft: 5, // Space between text and icon
  },
});
