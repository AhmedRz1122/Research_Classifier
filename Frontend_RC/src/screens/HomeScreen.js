import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import UploadContainer from '../components/UploadContainer';
import Footer from '../components/Footer';
import { classifyImage, saveClassifiedImage, testApiConnection, getDatasetStats } from '../utils/modelHelper';

// Helper function to get animal emoji
const getAnimalEmoji = (className) => {
  const emojiMap = {
    dog: '🐶',
    cat: '🐱',
    horse: '🐴',
    spider: '🕷️',
    butterfly: '🦋',
    chicken: '🐔',
    sheep: '🐑',
    cow: '🐄',
    squirrel: '🐿️',
    elephant: '🐘',
  };
  return emojiMap[className?.toLowerCase()] || '🐾';
};

// Helper function to get animal color
const getAnimalColor = (className) => {
  const colorMap = {
    dog: '#4ECDC4',
    cat: '#FF6B6B',
    horse: '#95E1D3',
    spider: '#8B4513',
    butterfly: '#FFB6C1',
    chicken: '#FFA500',
    sheep: '#E0E0E0',
    cow: '#A0522D',
    squirrel: '#D2691E',
    elephant: '#808080',
  };
  return colorMap[className?.toLowerCase()] || '#4F46E5';
};

const HomeScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [classification, setClassification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [apiConnected, setApiConnected] = useState(false);
  const [datasetStats, setDatasetStats] = useState(null);
  const [savingProgress, setSavingProgress] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerAnimation] = useState(new Animated.Value(-250));

  // Check API connection on component mount
  useEffect(() => {
    checkApiConnection();
    loadDatasetStats();
  }, []);

  const checkApiConnection = async () => {
    const result = await testApiConnection();
    setApiConnected(result.success);
    
    if (!result.success && __DEV__) {
      Alert.alert(
        'Connection Error',
        `Could not connect to backend at http://192.168.100.5:8000\n\nError: ${result.error}\n\nPlease ensure:\n1. Backend is running\n2. Device is on same WiFi network\n3. Windows Firewall allows port 8000`,
        [{ text: 'OK' }]
      );
    }
  };

  const loadDatasetStats = async () => {
    const stats = await getDatasetStats();
    setDatasetStats(stats);
  };

  const toggleDrawer = () => {
    if (drawerVisible) {
      // Close drawer
      Animated.timing(drawerAnimation, {
        toValue: -250,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setDrawerVisible(false));
    } else {
      // Open drawer
      setDrawerVisible(true);
      Animated.timing(drawerAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleImageSelect = async (image) => {
    if (image) {
      setImageUri(image.uri);
      setSelectedImage(image);
      setClassification(null);
      setLoading(true);
      setSavingProgress('');

      try {
        // Step 1: Classify the image
        setSavingProgress('Classifying image...');
        const result = await classifyImage(image);
        setClassification(result);
        
        // Step 2: Save the image with classification
        setSavingProgress('Saving to dataset...');
        // const saveResult = await saveClassifiedImage(image, result.class, result);
        // Note: saveClassifiedImage might fail in Expo Go on Android if permissions aren't perfect or paths differ.
        // We'll wrap it to be safe.
        try {
             await saveClassifiedImage(image, result.class, result);
        } catch (saveError) {
            console.log("Save error (expected in some envs):", saveError);
        }
        
        // Step 3: Update stats
        await loadDatasetStats();
        
        // Step 4: Show success
        Alert.alert(
          'Success!',
          `✅ Image classified as ${result.class.toUpperCase()}\n` +
          `📊 Confidence: ${(result.confidence * 100).toFixed(1)}%\n` +
          `💾 Saved to: data/${result.class}/`,
          [{ text: 'OK' }]
        );
        
      } catch (error) {
        console.error('Error in handleImageSelect:', error);
        Alert.alert(
          'Error',
          error.message || 'Failed to process image',
          [{ text: 'OK' }]
        );
      } finally {
        setLoading(false);
        setSavingProgress('');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Menu Button */}
      <TouchableOpacity style={styles.menuButton} onPress={toggleDrawer}>
        <Icon name="menu" size={28} color="#4F46E5" />
      </TouchableOpacity>

      {/* Drawer Modal */}
      <Modal
        visible={drawerVisible}
        transparent={true}
        animationType="none"
        onRequestClose={toggleDrawer}
      >
        <TouchableOpacity 
          style={styles.drawerOverlay} 
          activeOpacity={1} 
          onPress={toggleDrawer}
        >
          <Animated.View 
            style={[
              styles.drawerContainer,
              { transform: [{ translateX: drawerAnimation }] }
            ]}
          >
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Research Classifier</Text>
              <TouchableOpacity onPress={toggleDrawer}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.drawerContent}>
              <TouchableOpacity 
                style={styles.drawerItem}
                onPress={() => {
                  toggleDrawer();
                  // Already on Home screen
                }}
              >
                <Icon name="home" size={24} color="#4F46E5" />
                <Text style={styles.drawerItemText}>Home</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.drawerItem}
                onPress={() => {
                  toggleDrawer();
                  // Navigate to Dataset screen when implemented
                  Alert.alert('Coming Soon', 'Dataset view will be available soon!');
                }}
              >
                <Icon name="folder" size={24} color="#4F46E5" />
                <Text style={styles.drawerItemText}>Dataset</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.drawerItem}
                onPress={() => {
                  toggleDrawer();
                  // Navigate to Statistics screen when implemented
                  Alert.alert('Coming Soon', 'Statistics view will be available soon!');
                }}
              >
                <Icon name="bar-chart" size={24} color="#4F46E5" />
                <Text style={styles.drawerItemText}>Statistics</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.drawerItem}
                onPress={() => {
                  toggleDrawer();
                  // Navigate to Settings screen when implemented
                  Alert.alert('Coming Soon', 'Settings will be available soon!');
                }}
              >
                <Icon name="settings" size={24} color="#4F46E5" />
                <Text style={styles.drawerItemText}>Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.drawerItem}
                onPress={() => {
                  toggleDrawer();
                  navigation.navigate('About');
                }}
              >
                <Icon name="info" size={24} color="#4F46E5" />
                <Text style={styles.drawerItemText}>About</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>🐾 Research Classifier</Text>
          <Text style={styles.subtitle}>
            Upload or take a photo to classify Animals for Future research
          </Text>

        

          {/* Dataset Stats */}
          {datasetStats && (
            <View style={styles.statsContainer}>
              <Text style={styles.statsTitle}>Dataset Statistics</Text>
              <View style={styles.statsGrid}>
                {['dog', 'cat', 'horse', 'spider', 'butterfly', 'chicken', 'sheep', 'cow', 'squirrel', 'elephant'].map((animal) => (
                  <View key={animal} style={styles.statCard}>
                    <Text style={styles.statEmoji}>{getAnimalEmoji(animal)}</Text>
                    <Text style={styles.statCount}>{datasetStats[animal] || 0}</Text>
                    <Text style={styles.statLabel}>{animal}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.totalStats}>
                <Text style={styles.totalStatsText}>Total Images: {datasetStats.total || 0}</Text>
              </View>
            </View>
          )}

          <UploadContainer onImageSelect={handleImageSelect} />

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4F46E5" />
              <Text style={styles.loadingText}>
                {savingProgress || 'Processing image...'}
              </Text>
            </View>
          )}

          {imageUri && !loading && (
            <View style={styles.imagePreview}>
              <Image source={{ uri: imageUri }} style={styles.image} />
              
              {classification && (
                <View style={styles.resultContainer}>
                  <Text style={styles.resultTitle}>Classification Result</Text>
                  
                  {/* Top Prediction Badge */}
                  <View style={[
                    styles.classBadge,
                    { backgroundColor: getAnimalColor(classification.class) }
                  ]}>
                    <Text style={styles.classBadgeEmoji}>
                      {getAnimalEmoji(classification.class)}
                    </Text>
                    <Text style={styles.classBadgeText}>
                      {classification.class.toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.confidenceBar}>
                    <View style={styles.confidenceLabel}>
                      <Text style={styles.confidenceText}>Confidence</Text>
                      <Text style={styles.confidenceValue}>
                        {(classification.confidence * 100).toFixed(1)}%
                      </Text>
                    </View>
                    <View style={styles.barBackground}>
                      <View 
                        style={[
                          styles.barFill,
                          { 
                            width: `${classification.confidence * 100}%`,
                            backgroundColor: getAnimalColor(classification.class)
                          }
                        ]} 
                      />
                    </View>
                  </View>

                  {/* Top 3 Predictions */}
                  {classification.predictions && classification.predictions.length > 0 && (
                    <View style={styles.predictionsContainer}>
                      <Text style={styles.predictionsTitle}>Top Predictions:</Text>
                      {classification.predictions.slice(0, 3).map((pred, index) => (
                        <View key={index} style={styles.predictionRow}>
                          <View style={styles.predictionLabel}>
                            <Text style={styles.predictionEmoji}>{getAnimalEmoji(pred.class)}</Text>
                            <Text style={styles.predictionName}>{pred.class}</Text>
                          </View>
                          <View style={styles.predictionBarContainer}>
                            <View style={styles.predictionBarBackground}>
                              <View 
                                style={[
                                  styles.predictionBarFill,
                                  { 
                                    width: `${pred.confidence}%`,
                                    backgroundColor: getAnimalColor(pred.class)
                                  }
                                ]} 
                              />
                            </View>
                            <Text style={styles.predictionValue}>{pred.confidence.toFixed(1)}%</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Save Info */}
                  <View style={styles.infoBox}>
                    <Icon name="check-circle" size={20} color="#10B981" />
                    <Text style={styles.infoText}>
                    Save Image for the dataset collection for future research
                    </Text>
                  </View>

                 
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  apiStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  apiConnected: {
    backgroundColor: '#10B981',
  },
  apiDisconnected: {
    backgroundColor: '#EF4444',
  },
  apiStatusText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '600',
  },
  statsContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    width: '100%',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '18%',
    aspectRatio: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 5,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  statCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  statLabel: {
    fontSize: 9,
    color: '#666',
    textAlign: 'center',
  },
  totalStats: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  totalStatsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statText: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#4F46E5',
    fontSize: 16,
  },
  imagePreview: {
    marginTop: 30,
    alignItems: 'center',
    width: '100%',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#E5E7EB',
  },
  resultContainer: {
    marginTop: 20,
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  classBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 20,
  },
  classBadgeEmoji: {
    fontSize: 32,
  },
  classBadgeText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  confidenceBar: {
    width: '100%',
    marginBottom: 20,
  },
  confidenceLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  confidenceText: {
    fontSize: 16,
    color: '#666',
  },
  confidenceValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4F46E5',
  },
  barBackground: {
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
  predictionsContainer: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  predictionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  predictionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  predictionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  predictionEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  predictionName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  predictionBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
  },
  predictionBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 8,
  },
  predictionBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  predictionValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    width: 45,
    textAlign: 'right',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginTop: 10,
  },
  infoText: {
    color: '#065F46',
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  mockWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    alignSelf: 'flex-start',
  },
  mockWarningText: {
    color: '#92400E',
    marginLeft: 8,
    fontSize: 12,
  },
  menuButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1000,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  drawerContent: {
    flex: 1,
    paddingTop: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  drawerItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    fontWeight: '500',
  },
});

export default HomeScreen;