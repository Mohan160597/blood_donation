import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import MapView from 'react-native-maps';

export default function HospitalsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}> Hospital </Text>

    </View>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 10,
    color: 'black',
  },

});
