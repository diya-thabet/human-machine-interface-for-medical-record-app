// screens/LoginScreen.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native'; // Added Alert here
import { SafeAreaView } from 'react-native-safe-area-context'; // Ensure this is from safe-area-context

// --- IMPORT FIREBASE SERVICES ---
import { auth, db } from '../config/firebaseConfig'; // Import auth and db from your config
import { signInWithEmailAndPassword } from 'firebase/auth'; // Firebase Auth function for signing in users
import { doc, getDoc } from 'firebase/firestore'; // Firestore functions for getting user role

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  // --- MODIFIED handleLogin FUNCTION ---
  const handleLogin = async () => {
    // Basic input validation
    if (!email || !password) {
      Alert.alert("Login Error", "Please enter both email and password.");
      return;
    }

    try {
      // 1. Sign in user with Firebase Authentication
      console.log('Attempting Firebase user sign-in...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User logged in successfully in Firebase Auth:", user.email, "UID:", user.uid);

      // 2. Fetch user's role from Cloud Firestore to determine navigation
      console.log('Fetching user role from Firestore...');
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const userRole = userData.role; // This will be 'PATIENT' or 'DOCTOR' as saved during registration

        console.log("User role from Firestore:", userRole);

        // 3. Navigate based on the fetched user role
        if (userRole === 'DOCTOR') {
          navigation.replace('DoctorDashboard');
        } else if (userRole === 'PATIENT') {
          navigation.replace('PatientDashboard');
        } else {
          // Fallback if role is not recognized (shouldn't happen with proper registration)
          Alert.alert("Login Error", "User role not recognized. Please contact support.");
          // Optionally, sign out the user here if their data is invalid
          // await auth.signOut();
        }
      } else {
        // This scenario means a user logged in via Auth, but their Firestore profile is missing.
        // This shouldn't happen if registration properly saves to Firestore.
        Alert.alert("Login Error", "User profile data not found. Please contact support.");
        // Consider signing out the user if their data is inconsistent
        // await auth.signOut();
      }

    } catch (error) {
      console.error("Firebase Login failed:", error); // Log the full error object for debugging
      let errorMessage = "Login failed. Please check your credentials.";

      // Provide more user-friendly error messages based on Firebase error codes
      if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address.";
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = "No user found with this email.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed login attempts. Please try again later.";
      }
      // Add more specific error codes if you encounter them during testing

      Alert.alert("Login Error", errorMessage);
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

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>ENTER</Text>
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
    backgroundColor: '#F8F8F8',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 40,
    letterSpacing: 2,
  },
  input: {
    width: '100%',
    height: 55,
    borderColor: '#E0E0E0',
    borderBottomWidth: 1,
    fontSize: 18,
    color: '#333',
    paddingHorizontal: 10,
    marginBottom: 25,
    borderRadius: 5,
  },
  button: {
    width: '100%',
    height: 60,
    backgroundColor: '#00BCD4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  registerLink: {
    color: '#00BCD4',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;