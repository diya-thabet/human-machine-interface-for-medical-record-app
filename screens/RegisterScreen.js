// screens/RegisterScreen.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import { i18n } from '../i18n';

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState('PATIENT');
  const [loading, setLoading] = React.useState(false);

  // Force update
  const [, setTick] = React.useState(0);
  React.useEffect(() => {
    const unsubscribe = i18n.onChange(() => setTick(t => t + 1));
    return unsubscribe;
  }, []);

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Alert.alert(i18n.t('error'), 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Save user details and role to Firestore
      // We use the Auth UID as the document ID for easier lookup later
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: fullName,
        email: email,
        role: role,
        createdAt: new Date().toISOString()
      });

      console.log('User registered and profile created:', user.uid);
      Alert.alert(i18n.t('success'), 'Account created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() } // Navigate back to login
      ]);

    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert(i18n.t('error'), error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{i18n.t('register')}</Text>

          <TextInput
            style={styles.input}
            placeholder={i18n.t('full_name')}
            placeholderTextColor="#888"
            autoCapitalize="words"
            value={fullName}
            onChangeText={setFullName}
          />

          <TextInput
            style={styles.input}
            placeholder={i18n.t('email')}
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder={i18n.t('password')}
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
              <Text style={[styles.roleButtonText, role === 'PATIENT' && styles.roleButtonTextActive]}>{i18n.t('patient')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleButton, role === 'DOCTOR' && styles.roleButtonActive]}
              onPress={() => setRole('DOCTOR')}
            >
              <Ionicons name="medical-outline" size={24} color={role === 'DOCTOR' ? '#FFF' : '#00BCD4'} />
              <Text style={[styles.roleButtonText, role === 'DOCTOR' && styles.roleButtonTextActive]}>{i18n.t('doctor')}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>{i18n.t('register').toUpperCase()}</Text>
            )}
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