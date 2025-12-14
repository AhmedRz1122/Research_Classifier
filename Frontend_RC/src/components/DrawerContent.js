import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      <View style={styles.drawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="pets" color={color} size={size} />
          )}
          label="Classify Pet"
          onPress={() => props.navigation.navigate('Home')}
        />
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="folder" color={color} size={size} />
          )}
          label="Dataset"
          onPress={() => props.navigation.navigate('Dataset')}
        />
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="info" color={color} size={size} />
          )}
          label="About"
          onPress={() => {
            console.log('Navigating to About...');
            props.navigation.navigate('About');
          }}
        />
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="settings" color={color} size={size} />
          )}
          label="Settings"
          onPress={() => props.navigation.navigate('Settings')}
        />
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerSection: {
    marginTop: 15,
  },
});

export default DrawerContent;