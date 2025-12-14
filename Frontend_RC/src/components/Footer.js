import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';

const Footer = () => {
  return (
    <View style={styles.container}>
      <Icon name="pets" size={20} color="#fff" />
      <Text style={styles.text}>
        Research Classifier © {new Date().getFullYear()} - Research Platform
      </Text>
      <Text style={styles.subtext}>
        Contributing to AI research datasets
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4F46E5',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  text: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
  subtext: {
    color: '#E0E7FF',
    fontSize: 12,
    marginTop: 2,
  },
});

export default Footer;