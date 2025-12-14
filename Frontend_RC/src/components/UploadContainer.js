import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const UploadContainer = ({ onImageSelect }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      Alert.alert('Permission needed', 'Camera and gallery permissions are required to upload images.');
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    setModalVisible(false);
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      onImageSelect(result.assets[0]);
    }
  };

  const chooseFromGallery = async () => {
    setModalVisible(false);
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      onImageSelect(result.assets[0]);
    }
  };

  //Creation of Alert for image uploaded
  const handleImageSelect = async (image) => {
    if (image) {
      onImageSelect(image);
      Alert.alert("handleImageSelect", "Image Successfully Selected")
    }
    else{
      Alert.alert("handleImageSelect", "Image not Selected")
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="cloud-upload" size={60} color="#4F46E5" />
        <Text style={styles.title}>Upload Animal Image</Text>
        <Text style={styles.subtitle}>
          Supports 10 animals: Dog, Cat, Horse, Spider, Butterfly, Chicken, Sheep, Cow, Squirrel, Elephant
        </Text>
        <View style={styles.supportedFormats}>
          <Text style={styles.formatText}>Supports: JPG, PNG</Text>
          <Text style={styles.formatText}>Max size: 5MB</Text>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Image Source</Text>
            
            <TouchableOpacity style={styles.modalOption} onPress={takePhoto}>
              <Icon name="camera-alt" size={30} color="#4F46E5" />
              <Text style={styles.modalOptionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalOption} onPress={chooseFromGallery}>
              <Icon name="photo-library" size={30} color="#4F46E5" />
              <Text style={styles.modalOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#4F46E5',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 15,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  supportedFormats: {
    marginTop: 10,
    alignItems: 'center',
  },
  formatText: {
    fontSize: 12,
    color: '#888',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 30,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#333',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 15,
  },
  modalOptionText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },
  cancelButton: {
    marginTop: 10,
    padding: 15,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default UploadContainer;