import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';

const SignupScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Please enter a password';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSignUp = () => {
    if (validateForm()) {
      // TODO: Implement Signup Logic
      Alert.alert('Success', 'Account created successfully!');
      navigation.replace('CustomerHome');
    }
  };

  const handleGoogleSignup = () => {
    // TODO: Implement Google Signup
    Alert.alert('Info', 'Google signup coming soon');
  };

  const handleFacebookSignup = () => {
    // TODO: Implement Facebook Signup
    Alert.alert('Info', 'Facebook signup coming soon');
  };

  const handlePhoneSignup = () => {
    // TODO: Implement Phone Signup
    Alert.alert('Info', 'Phone signup coming soon');
  };

  const handleLogin = () => {
    navigation.goBack(); // Go back to Login
  };

  const SocialButton = ({ label, icon, color, onPress }) => {
    // For actual icons, you'd use react-native-vector-icons
    // Here using text as placeholder
    const getIconText = (iconName) => {
      switch (iconName) {
        case 'google': return 'G';
        case 'facebook': return 'f';
        case 'phone': return '📱';
        default: return '';
      }
    };

    return (
      <TouchableOpacity
        style={styles.socialButton}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={[styles.socialIcon, { color }]}>
          {getIconText(icon)}
        </Text>
        <Text style={styles.socialButtonText}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.spacer} />
          
          {/* Logo */}
          <Image
            source={require('../../assets/images/Theme_img.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.spacerMedium} />

          {/* Title */}
          <Text style={styles.title}>Create Account</Text>
          <View style={styles.spacerLarge} />

          {/* Name Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.prefixIcon}>👤</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                placeholder="Enter your full name"
                autoCapitalize="words"
              />
            </View>
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          </View>

          {/* Email Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.prefixIcon}>✉️</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          </View>

          {/* Password Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.prefixIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                value={formData.password}
                onChangeText={(text) => handleInputChange('password', text)}
                placeholder="Enter your password"
                secureTextEntry
              />
            </View>
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
          </View>

          <View style={styles.spacerLarge} />

          {/* Sign Up Button */}
          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleSignUp}
            activeOpacity={0.8}
          >
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.spacerMedium} />

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.spacerMedium} />

          {/* Social Sign Up Buttons */}
          <SocialButton
            label="Sign up with Google"
            icon="google"
            color="red"
            onPress={handleGoogleSignup}
          />
          <View style={styles.spacerSmall} />

          <SocialButton
            label="Sign up with Facebook"
            icon="facebook"
            color="#1877F2" // Facebook blue
            onPress={handleFacebookSignup}
          />
          <View style={styles.spacerSmall} />

          <SocialButton
            label="Sign up with Phone"
            icon="phone"
            color="green"
            onPress={handlePhoneSignup}
          />

          <View style={styles.spacerMedium} />

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.spacer} />
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
  },
  spacer: {
    height: 20,
  },
  spacerSmall: {
    height: 10,
  },
  spacerMedium: {
    height: 20,
  },
  spacerLarge: {
    height: 30,
  },
  logo: {
    height: 150,
    width: 150,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.87)',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 56,
  },
  prefixIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  signupButton: {
    width: '100%',
    height: 50,
    backgroundColor: 'blue',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  dividerText: {
    marginHorizontal: 10,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  socialButton: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  socialIcon: {
    fontSize: 24,
    marginRight: 10,
    fontWeight: 'bold',
  },
  socialButtonText: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.87)',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.87)',
  },
  loginLink: {
    fontSize: 16,
    color: 'blue',
    marginLeft: 5,
    fontWeight: '500',
  },
});

export default SignupScreen;