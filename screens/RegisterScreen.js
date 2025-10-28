// screens/RegisterScreen.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons in role selection

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState('PATIENT'); // Default role: PATIENT

  const handleRegister = () => {
    // Implement your registration logic here
    console.log('Attempting registration with:', { fullName, email, password, role });
    // In a real app, you would make an API call to /auth/register
    // e.g., fetch('http://localhost:8080/auth/register', { /* ... */ })
    // On successful registration, you might navigate back to login or directly to a dashboard
    // For now, let's navigate back to Login
    navigation.goBack();
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
    fontSize: 28, // Slightly smaller than login for more content
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
    marginTop: 10, // Added spacing
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row', // Align icon and text horizontally
    alignItems: 'center',
    justifyContent: 'center',
    height: 60, // Large tap target
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
    backgroundColor: '#00BCD4', // Accent color when active
  },
  roleButtonText: {
    color: '#00BCD4',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8, // Space between icon and text
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