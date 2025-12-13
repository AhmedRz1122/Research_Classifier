import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  BackHandler,
} from 'react-native';

const LoginScreen = ({ navigation }) => {
  // Double tap to exit functionality
  React.useEffect(() => {
    let backCount = 0;
    let backTimer = null;

    const backAction = () => {
      if (backCount === 1) {
        BackHandler.exitApp();
        return true;
      } else {
        backCount++;
        Alert.alert(
          'Exit App',
          'Press back again to exit',
          [{ text: 'OK', onPress: () => {} }]
        );
        
        if (backTimer) clearTimeout(backTimer);
        backTimer = setTimeout(() => {
          backCount = 0;
        }, 2000);
        
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => {
      if (backTimer) clearTimeout(backTimer);
      backHandler.remove();
    };
  }, []);

  const handlePhoneLogin = () => {
    // TODO: Implement Phone Sign In
    navigation.replace('CameraCapture');
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google Sign In
    navigation.replace('CameraCapture');
  };

  const handleSignUp = () => {
    navigation.navigate('Signup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Spacer equivalent */}
          <View style={styles.spacer} />

          {/* Image */}
          <Image
            source={require('../../assets/images/Theme_img.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.spacerMedium} />

          {/* Continue with phone button */}
          <TouchableOpacity
            style={styles.phoneButton}
            onPress={handlePhoneLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.phoneButtonText}>Continue with phone</Text>
          </TouchableOpacity>
          <View style={styles.spacerSmall} />

          {/* Continue with Google button */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <View style={styles.spacerMedium} />

          {/* Create Account Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account?</Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signupLink}>Create Account</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.spacer} />

          {/* Terms and Conditions */}
          <Text style={styles.termsText}>
            Joining our app means you agree with our Terms of Use and Privacy Policy
          </Text>
          <View style={styles.spacerSmall} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: {
    flex: 1,
  },
  spacerMedium: {
    height: 40,
  },
  spacerSmall: {
    height: 20,
  },
  logo: {
    height: 200,
    width: 200,
  },
  phoneButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#9CCC65', // Light Green
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 0, // For Android shadow
    shadowColor: 'transparent', // For iOS shadow
  },
  phoneButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '500',
  },
  googleButton: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'grey',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIcon: {
    fontSize: 30,
    color: 'blue',
    fontWeight: 'bold',
    marginRight: 10,
  },
  googleButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '500',
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupText: {
    fontSize: 16,
    color: 'black',
  },
  signupLink: {
    fontSize: 16,
    color: 'blue',
    marginLeft: 5,
    fontWeight: '500',
  },
  termsText: {
    fontSize: 12,
    color: 'grey',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default LoginScreen;