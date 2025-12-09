import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../firebaseConfig'; // Import auth and db
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User logged in:', user.email);

      // Check User Role
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role;

        if (role === 'DOCTOR') {
          navigation.replace('DoctorDashboard');
        } else {
          navigation.replace('PatientDashboard');
        }
      } else {
        // Fallback if no user doc found (shouldn't happen with correct registration)
        console.warn("No user document found for ID:", user.uid);
        navigation.replace('PatientDashboard');
      }

    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPress = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.content}>
          <Text style={styles.title}>LOGIN</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>ENTER</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleRegisterPress}>
            <Text style={styles.registerLink}>Don't have an account? Register now</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8', // Light background for minimalist look
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30, // Horizontal padding for better spacing
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50', // Darker text for high contrast
    marginBottom: 40, // Increased spacing below title
    letterSpacing: 2, // Minimalist touch
  },
  input: {
    width: '100%',
    height: 55, // Larger height for easier tapping
    borderColor: '#E0E0E0',
    borderBottomWidth: 1, // Minimalist underline style
    fontSize: 18, // Larger font size for readability
    color: '#333',
    paddingHorizontal: 10,
    marginBottom: 25, // Spacing between inputs
    borderRadius: 5, // Slightly rounded for a modern feel
  },
  button: {
    width: '100%',
    height: 60, // Larger button height
    backgroundColor: '#00BCD4', // Your accent color (cyan/teal)
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10, // Rounded corners for button
    marginTop: 20, // Spacing above button
    marginBottom: 20, // Spacing below button
    elevation: 3, // Subtle shadow for Android
    shadowColor: '#000', // Subtle shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 22, // Large font for button text
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  registerLink: {
    color: '#00BCD4', // Link color matches accent
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;