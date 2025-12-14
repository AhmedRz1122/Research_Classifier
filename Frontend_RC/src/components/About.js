import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AboutScreen = ({ navigation }) => {
  const animalCategories = [
    'Dog', 'Cat', 'Horse', 'Spider', 'Butterfly',
    'Chicken', 'Sheep', 'Cow', 'Squirrel', 'Elephant'
  ];

  const openLink = (url) => {
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  const navigateToClassifier = () => {
    navigation.navigate('Research Classifier');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-back" size={24} color="#2c3e50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>About the App</Text>
        </View>

        <View style={styles.content}>
          {/* App Logo/Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.appTitle}>Animal Research Classifier</Text>
            <Text style={styles.appSubtitle}>AI-Powered Animal Image Classification</Text>
          </View>

          {/* App Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.sectionText}>
              The Animal Research Classifier App is a research-focused mobile application 
              designed to collect and classify animal images into ten categories.
            </Text>
            <Text style={styles.sectionText}>
              Beyond classification, the core objective is data collection for future AI research. 
              Each uploaded image is securely stored along with its predicted label, helping build 
              a structured and diverse dataset.
            </Text>
          </View>

          {/* Animal Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Animal Categories</Text>
            <View style={styles.categoriesGrid}>
              {animalCategories.map((animal, index) => (
                <View key={index} style={styles.categoryItem}>
                  <View style={styles.categoryIcon}>
                    <Icon 
                      name={getAnimalIcon(animal)} 
                      size={24} 
                      color="#3498db" 
                    />
                  </View>
                  <Text style={styles.categoryText}>{animal}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Technical Architecture */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technical Architecture</Text>
            <View style={styles.techCard}>
              <View style={styles.techItem}>
                <Icon name="smartphone" size={20} color="#27ae60" />
                <Text style={styles.techText}>React Native Frontend</Text>
              </View>
              <View style={styles.techItem}>
                <Icon name="api" size={20} color="#e74c3c" />
                <Text style={styles.techText}>FastAPI Backend</Text>
              </View>
              <View style={styles.techItem}>
                <Icon name="psychology" size={20} color="#9b59b6" />
                <Text style={styles.techText}>Deep Learning Model</Text>
              </View>
              <View style={styles.techItem}>
                <Icon name="storage" size={20} color="#f39c12" />
                <Text style={styles.techText}>Secure Data Storage</Text>
              </View>
            </View>
          </View>

          {/* Research Objectives */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Research Objectives</Text>
            <View style={styles.objectiveItem}>
              <Icon name="check-circle" size={18} color="#27ae60" />
              <Text style={styles.objectiveText}>
                Collect labeled animal image data for AI research
              </Text>
            </View>
            <View style={styles.objectiveItem}>
              <Icon name="check-circle" size={18} color="#27ae60" />
              <Text style={styles.objectiveText}>
                Build reusable datasets for computer vision research
              </Text>
            </View>
            <View style={styles.objectiveItem}>
              <Icon name="check-circle" size={18} color="#27ae60" />
              <Text style={styles.objectiveText}>
                Enable collaborative AI development and benchmarking
              </Text>
            </View>
            <View style={styles.objectiveItem}>
              <Icon name="check-circle" size={18} color="#27ae60" />
              <Text style={styles.objectiveText}>
                Reduce effort in gathering labeled image data
              </Text>
            </View>
          </View>

          {/* Target Users */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Target Users</Text>
            <View style={styles.userCards}>
              <View style={[styles.userCard, styles.researcherCard]}>
                <Icon name="science" size={24} color="#2980b9" />
                <Text style={styles.userTitle}>Researchers</Text>
                <Text style={styles.userDescription}>
                  For animal behavior studies and computer vision research
                </Text>
              </View>
              <View style={[styles.userCard, styles.developerCard]}>
                <Icon name="code" size={24} color="#27ae60" />
                <Text style={styles.userTitle}>ML Engineers</Text>
                <Text style={styles.userDescription}>
                  For training and benchmarking classification models
                </Text>
              </View>
              <View style={[styles.userCard, styles.dataCard]}>
                <Icon name="data-usage" size={24} color="#e74c3c" />
                <Text style={styles.userTitle}>Data Scientists</Text>
                <Text style={styles.userDescription}>
                  For analyzing animal image datasets and patterns
                </Text>
              </View>
            </View>
          </View>

          {/* Call to Action */}
          <View style={styles.ctaSection}>
            <Text style={styles.ctaTitle}>Ready to Contribute?</Text>
            <Text style={styles.ctaText}>
              Help build the dataset by uploading and classifying animal images
            </Text>
            <TouchableOpacity 
              style={styles.ctaButton}
              onPress={navigateToClassifier}
            >
              <Icon name="camera-alt" size={20} color="white" />
              <Text style={styles.ctaButtonText}>Start Classifying</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              This app promotes open research, dataset reusability, and collaborative AI development
            </Text>
            <View style={styles.linksContainer}>
              <TouchableOpacity onPress={() => openLink('https://github.com')}>
                <Text style={styles.linkText}>GitHub</Text>
              </TouchableOpacity>
              <Text style={styles.linkSeparator}>•</Text>
              <TouchableOpacity onPress={() => openLink('https://fastapi.tiangolo.com')}>
                <Text style={styles.linkText}>FastAPI Docs</Text>
              </TouchableOpacity>
              <Text style={styles.linkSeparator}>•</Text>
              <TouchableOpacity onPress={() => openLink('https://reactnative.dev')}>
                <Text style={styles.linkText}>React Native</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.copyright}>
              © {new Date().getFullYear()} Animal Research Classifier
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Helper function to get icons for animals
const getAnimalIcon = (animal) => {
  const iconMap = {
    'Dog': 'pets',
    'Cat': 'pets',
    'Horse': 'agriculture',
    'Spider': 'bug-report',
    'Butterfly': 'flutter-dash',
    'Chicken': 'egg',
    'Sheep': 'agriculture',
    'Cow': 'agriculture',
    'Squirrel': 'forest',
    'Elephant': 'forest',
  };
  return iconMap[animal] || 'pets';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
  },
  content: {
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 5,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#3498db',
    paddingBottom: 5,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#34495e',
    marginBottom: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ebf5fb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  techCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
  },
  techItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  techText: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 12,
  },
  objectiveItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  objectiveText: {
    fontSize: 16,
    color: '#34495e',
    marginLeft: 10,
    flex: 1,
    lineHeight: 22,
  },
  userCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  userCard: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  researcherCard: {
    borderLeftColor: '#3498db',
  },
  developerCard: {
    borderLeftColor: '#27ae60',
  },
  dataCard: {
    borderLeftColor: '#e74c3c',
  },
  userTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 10,
    marginBottom: 5,
  },
  userDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  ctaSection: {
    backgroundColor: '#3498db',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  ctaText: {
    fontSize: 16,
    color: '#ecf0f1',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  ctaButton: {
    flexDirection: 'row',
    backgroundColor: '#2c3e50',
    borderRadius: 25,
    paddingHorizontal: 25,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 10,
  },
  footer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 15,
  },
  linksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '500',
  },
  linkSeparator: {
    marginHorizontal: 15,
    color: '#bdc3c7',
  },
  copyright: {
    fontSize: 12,
    color: '#95a5a6',
  },
});

export default AboutScreen;