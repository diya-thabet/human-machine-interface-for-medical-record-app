// screens/RegisterScreen.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Alert } from 'react-native'; // Added Alert here
import { Ionicons } from '@expo/vector-icons'; // For icons in role selection

// --- IMPORT FIREBASE SERVICES ---
import { auth, db } from '../config/firebaseConfig'; // Import auth and db from your config
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Firebase Auth function for creating users
import { doc, setDoc } from 'firebase/firestore'; // Firestore functions for saving user role

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState('PATIENT'); // Default role: PATIENT

  // --- MODIFIED handleRegister FUNCTION ---
  const handleRegister = async () => {
    // Basic input validation
    if (!fullName || !email || !password) {
      Alert.alert("Registration Error", "Please fill in all fields (Full Name, Email, Password).");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Registration Error", "Password should be at least 6 characters long.");
      return;
    }

    try {
      // 1. Create user in Firebase Authentication
      console.log('Attempting Firebase user creation...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User registered successfully in Firebase Auth:", user.email, "UID:", user.uid);

      // 2. Save user's additional data (like fullName and role) to Cloud Firestore
      //    The document ID for this user will be their unique Firebase UID (user.uid)
      console.log('Saving user data to Firestore...');
      await setDoc(doc(db, "users", user.uid), {
        fullName: fullName,
        email: user.email,
        role: role, // 'PATIENT' or 'DOCTOR'
        createdAt: new Date(), // Optional: A timestamp for when the user was created
        // You can add more initial profile fields here as needed
      });
      console.log("User data saved to Firestore successfully for UID:", user.uid);

      Alert.alert("Success", "Account created successfully! You can now log in.");
      navigation.replace('Login'); // Navigate back to Login screen after successful registration

    } catch (error) {
      console.error("Firebase Registration failed:", error); // Log the full error object for debugging
      let errorMessage = "Registration failed. Please try again.";

      // Provide more user-friendly error messages based on Firebase error codes
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "That email address is already in use!";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "That email address is invalid!";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password should be at least 6 characters.";
      }
      // Add more specific error codes if you encounter them during testing

      Alert.alert("Registration Error", errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.content}>
          <Text style={styles.title}>REGISTER NEW ACCOUNT</Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#888"
            autoCapitalize="words"
            value={fullName}
            onChangeText={setFullName}
          />

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

          {/* Role Selection */}
          <View style={styles.roleSelectionContainer}>
            <TouchableOpacity
              style={[styles.roleButton, role === 'PATIENT' && styles.roleButtonActive]}
              onPress={() => setRole('PATIENT')}
            >
              <Ionicons name="person-outline" size={24} color={role === 'PATIENT' ? '#FFF' : '#00BCD4'} />
              <Text style={[styles.roleButtonText, role === 'PATIENT' && styles.roleButtonTextActive]}>I am a Patient</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleButton, role === 'DOCTOR' && styles.roleButtonActive]}
              onPress={() => setRole('DOCTOR')}
            >
              <Ionicons name="medical-outline" size={24} color={role === 'DOCTOR' ? '#FFF' : '#00BCD4'} />
              <Text style={[styles.roleButtonText, role === 'DOCTOR' && styles.roleButtonTextActive]}>I am a Doctor</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>REGISTER</Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 30,
    letterSpacing: 1.5,
  },
  input: {
    width: '100%',
    height: 55,
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 1,
    fontSize: 18,
    color: '#333',
    paddingHorizontal: 10,
    marginBottom: 25,
    borderRadius: 5,
  },
  roleSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
    marginTop: 10,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    backgroundColor: '#FFF',
    borderColor: '#00BCD4',
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  roleButtonActive: {
    backgroundColor: '#00BCD4',
  },
  roleButtonText: {
    color: '#00BCD4',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  roleButtonTextActive: {
    color: '#FFF',
  },
  button: {
    width: '100%',
    height: 60,
    backgroundColor: '#00BCD4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
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
});

export default RegisterScreen;