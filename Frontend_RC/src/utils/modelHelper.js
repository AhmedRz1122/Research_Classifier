import * as FileSystem from 'expo-file-system/legacy';
import axios from 'axios';
import { Platform } from 'react-native';

// Configuration
const API_CONFIG = {
  // For local development (Android emulator)
  LOCAL_ANDROID: 'http://192.168.100.5:8000',
  
  // For local development (iOS simulator)
  LOCAL_IOS: 'http://192.168.100.5:8000',
  
  // For real device testing (update with your computer's IP)
  DEVICE: 'http://192.168.100.5:8000', // Replace with your actual IP
  
  // Production URL
  PRODUCTION: 'http://192.168.100.5:8000',
};

// Helper to get correct API URL
const getApiUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return API_CONFIG.LOCAL_ANDROID;
    } else if (Platform.OS === 'ios') {
      return API_CONFIG.LOCAL_IOS;
    }
  }
  return API_CONFIG.PRODUCTION;
};

const API_BASE_URL = getApiUrl();

/**
 * Test API connection
 * @returns {Promise<object>} Connection test result
 */
export const testApiConnection = async () => {
  try {
    console.log('Testing connection to:', `${API_BASE_URL}/health`);
    const response = await axios.get(`${API_BASE_URL}/health`, {
      timeout: 5000,
    });
    console.log('Connection test successful:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Connection test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received - backend may not be accessible');
    }
    return { success: false, error: error.message };
  }
};

/**
 * Classify image using FastAPI backend
 * @param {object} image - Image object from expo-image-picker
 * @returns {Promise<object>} Classification result
 */
export const classifyImage = async (image) => {
  try {
    console.log('Sending image to:', `${API_BASE_URL}/predict`);
    
    // Create FormData for file upload
    const formData = new FormData();
    
    // Determine file extension
    const uri = image.uri;
    const fileExtension = uri.split('.').pop().toLowerCase();
    const mimeType = image.type === 'image' || image.type === 'video' 
      ? `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}` // simplistic type guess
      : (image.mimeType || `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`);
    
    // Extract filename from URI or generate one
    let filename = image.fileName || `pet_${Date.now()}.${fileExtension}`;
    
    // Clean filename for FormData
    filename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    
    // Append file to FormData
    formData.append('file', {
      uri: uri,
      type: mimeType,
      name: filename,
    });
    console.log(formData._parts)

    // Send request to FastAPI backend
    console.log('Sending POST request to:', `${API_BASE_URL}/predict/`);
    
    const response = await axios.post(
      `${API_BASE_URL}/predict/`,
      formData,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout
      }
    );

    console.log('API Response:', response.data);
    
    // Parse the new array response format
    // Backend returns: [{"class": "cat", "confidence": 98.69, "class_idx": 1}, ...]
    const predictions = response.data;
    
    if (!Array.isArray(predictions) || predictions.length === 0) {
      throw new Error('Invalid response format from backend');
    }
    
    // Extract top prediction
    const topPrediction = predictions[0];
    
    // Return structured data with all predictions
    return {
      class: topPrediction.class,
      confidence: topPrediction.confidence / 100, // Convert percentage to decimal for compatibility
      class_idx: topPrediction.class_idx,
      predictions: predictions, // All predictions for display
      probabilities: predictions.reduce((acc, pred) => {
        acc[pred.class] = pred.confidence / 100;
        return acc;
      }, {}),
    };
    
  } catch (error) {
    console.error('Classification error:', error.response || error.message || error);
    
    // Provide detailed error information
    let errorMessage = 'Failed to classify image';
    
    if (error.response) {
      // Server responded with error status
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      errorMessage = `Server error: ${error.response.status}`;
    } else if (error.request) {
      // Request made but no response
      console.error('No response received');
      errorMessage = 'Cannot connect to server. Please check your connection and ensure the backend is running.';
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Save classified image to local storage
 * @param {object} image - Image object
 * @param {string} className - Animal class name
 * @param {object} classification - Full classification result
 * @returns {Promise<string>} Path where image was saved
 */
export const saveClassifiedImage = async (image, className, classification = null) => {
  try {
    // Create directories if they don't exist
    const baseDir = `${FileSystem.documentDirectory}data`;
    const classDir = `${baseDir}/${className}`;
    const metadataDir = `${baseDir}/metadata`;

    // Create directories using legacy API (still supported, no deprecation warnings)
    await FileSystem.makeDirectoryAsync(baseDir, { intermediates: true });
    await FileSystem.makeDirectoryAsync(classDir, { intermediates: true });
    await FileSystem.makeDirectoryAsync(metadataDir, { intermediates: true });

    // Generate unique filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${className}_${timestamp}.jpg`;
    const destinationPath = `${classDir}/${fileName}`;

    // Copy image to classified folder
    await FileSystem.copyAsync({
      from: image.uri,
      to: destinationPath
    });

    // Save metadata as JSON
    const metadata = {
      filename: fileName,
      class: className,
      confidence: classification?.confidence || null,
      probabilities: classification?.probabilities || null,
      predictions: classification?.predictions || null,
      timestamp: new Date().toISOString(),
      originalUri: image.uri,
      savedPath: destinationPath,
    };

    const metadataPath = `${metadataDir}/${fileName.replace('.jpg', '.json')}`;
    // writeAsStringAsync without deprecated encoding parameter
    await FileSystem.writeAsStringAsync(
      metadataPath, 
      JSON.stringify(metadata, null, 2)
    );

    console.log(`Image saved to: ${destinationPath}`);
    console.log(`Metadata saved to: ${metadataPath}`);
    
    return {
      imagePath: destinationPath,
      metadataPath: metadataPath,
      metadata: metadata,
    };
    
  } catch (error) {
    console.error('Error saving image:', error);
    throw new Error(`Failed to save image: ${error.message}`);
  }
};

/**
 * Get statistics about saved images
 * @returns {Promise<object>} Statistics
 */
export const getDatasetStats = async () => {
  try {
    const baseDir = `${FileSystem.documentDirectory}data`;
    
    // Check if base directory exists
    try {
      const dirInfo = await FileSystem.getInfoAsync(baseDir);
      if (!dirInfo.exists) {
        return { 
          dog: 0, cat: 0, horse: 0, spider: 0, butterfly: 0, 
          chicken: 0, sheep: 0, cow: 0, squirrel: 0, elephant: 0, 
          total: 0 
        };
      }
    } catch (e) {
      return { 
        dog: 0, cat: 0, horse: 0, spider: 0, butterfly: 0, 
        chicken: 0, sheep: 0, cow: 0, squirrel: 0, elephant: 0, 
        total: 0 
      };
    }

    // Define all 10 animal classes
    const animalClasses = ['dog', 'cat', 'horse', 'spider', 'butterfly', 'chicken', 'sheep', 'cow', 'squirrel', 'elephant'];
    const stats = {};
    let totalCount = 0;

    // Count images for each class
    for (const animalClass of animalClasses) {
      const classDir = `${baseDir}/${animalClass}`;
      let count = 0;
      
      try {
        const files = await FileSystem.readDirectoryAsync(classDir);
        count = files.filter(file => file.endsWith('.jpg')).length;
      } catch (e) {
        // Directory doesn't exist or error reading, count stays 0
        count = 0;
      }
      
      stats[animalClass] = count;
      totalCount += count;
    }

    stats.total = totalCount;
    return stats;
    
  } catch (error) {
    console.error('Error getting dataset stats:', error);
    return { 
      dog: 0, cat: 0, horse: 0, spider: 0, butterfly: 0, 
      chicken: 0, sheep: 0, cow: 0, squirrel: 0, elephant: 0, 
      total: 0, 
      error: error.message 
    };
  }
};

/**
 * Get all saved images with metadata
 * @returns {Promise<object>} Images grouped by class
 */
export const getAllSavedImages = async () => {
  try {
    const baseDir = `${FileSystem.documentDirectory}data`;
    const dirInfo = await FileSystem.getInfoAsync(baseDir);
    
    if (!dirInfo.exists) {
      return { 
        dog: [], cat: [], horse: [], spider: [], butterfly: [], 
        chicken: [], sheep: [], cow: [], squirrel: [], elephant: [], 
        metadata: [] 
      };
    }

    const animalClasses = ['dog', 'cat', 'horse', 'spider', 'butterfly', 'chicken', 'sheep', 'cow', 'squirrel', 'elephant'];
    const metadataDir = `${baseDir}/metadata`;
    
    const results = {
      metadata: [],
    };

    // Initialize empty arrays for each class
    animalClasses.forEach(animalClass => {
      results[animalClass] = [];
    });

    // Read images for each class
    for (const animalClass of animalClasses) {
      const classDir = `${baseDir}/${animalClass}`;
      
      try {
        const images = await FileSystem.readDirectoryAsync(classDir);
        results[animalClass] = images
          .filter(file => file.endsWith('.jpg'))
          .map(file => ({
            name: file,
            class: animalClass,
            uri: `${classDir}/${file}`,
          }));
      } catch (e) {
        console.log(`Error reading ${animalClass} images:`, e.message);
      }
    }

    // Read metadata
    try {
      const metadataFiles = await FileSystem.readDirectoryAsync(metadataDir);
      for (const file of metadataFiles) {
        if (file.endsWith('.json')) {
          // readAsStringAsync without deprecated encoding parameter
          const content = await FileSystem.readAsStringAsync(`${metadataDir}/${file}`);
          results.metadata.push(JSON.parse(content));
        }
      }
    } catch (e) {
      console.log('Error reading metadata:', e.message);
    }

    return results;
    
  } catch (error) {
    console.error('Error reading saved images:', error);
    return { 
      dog: [], cat: [], horse: [], spider: [], butterfly: [], 
      chicken: [], sheep: [], cow: [], squirrel: [], elephant: [], 
      metadata: [], 
      error: error.message 
    };
  }
};

/**
 * Clear all saved data (for testing/reset)
 * @returns {Promise<boolean>} Success status
 */
export const clearDataset = async () => {
  try {
    const baseDir = `${FileSystem.documentDirectory}data`;
    const dirInfo = await FileSystem.getInfoAsync(baseDir);
    
    if (dirInfo.exists) {
      await FileSystem.deleteAsync(baseDir);
      return true;
    }
    return true;
  } catch (error) {
    console.error('Error clearing dataset:', error);
    return false;
  }
};