// screens/PatientProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const PatientProfileScreen = ({ navigation }) => {
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAddress, setPatientAddress] = useState('');
  const [patientDOB, setPatientDOB] = useState('');
  const [patientBloodType, setPatientBloodType] = useState('');
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigation.replace('Login');
          return;
        }

        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setPatientName(userData.fullName || '');
          setPatientEmail(userData.email || '');
          setPatientPhone(userData.phone || '');
          setPatientAddress(userData.address || '');
          setPatientDOB(userData.dob || '');
          setPatientBloodType(userData.bloodType || '');
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await updateDoc(doc(db, "users", user.uid), {
        fullName: patientName,
        phone: patientPhone,
        address: patientAddress,
        dob: patientDOB,
        bloodType: patientBloodType,
        // Email is usually not updated directly in Firestore for Auth purposes without re-auth, 
        // but we can update the record here. For Auth email change, utilize updateEmail from firebase/auth
      });

      Alert.alert("Success", "Your profile has been updated!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };



  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: () => {
            // Implement your logout logic here (e.g., clear tokens, navigate to login)
            console.log("Patient logged out");
            navigation.replace('Login'); // Navigate to Login screen
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.title}>My Profile</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.editButton}>
          <Ionicons name={isEditing ? "checkmark-circle-outline" : "create-outline"} size={28} color="#00BCD4" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#00BCD4" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.profileCard}>
            <Ionicons name="person-circle-outline" size={100} color="#00BCD4" style={styles.profileIcon} />
            {isEditing ? (
              <TextInput
                style={styles.editableNameInput}
                value={patientName}
                onChangeText={setPatientName}
                placeholder="Full Name"
              />
            ) : (
              <Text style={styles.profileName}>{patientName}</Text>
            )}
            <Text style={styles.profileRole}>Patient</Text>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={24} color="#00BCD4" style={styles.infoIcon} />
              <View>
                <Text style={styles.infoLabel}>Email</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.editableInput}
                    value={patientEmail}
                    onChangeText={setPatientEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                ) : (
                  <Text style={styles.infoText}>{patientEmail}</Text>
                )}
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="call-outline" size={24} color="#00BCD4" style={styles.infoIcon} />
              <View>
                <Text style={styles.infoLabel}>Phone Number</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.editableInput}
                    value={patientPhone}
                    onChangeText={setPatientPhone}
                    keyboardType="phone-pad"
                  />
                ) : (
                  <Text style={styles.infoText}>{patientPhone}</Text>
                )}
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={24} color="#00BCD4" style={styles.infoIcon} />
              <View>
                <Text style={styles.infoLabel}>Address</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.editableInput}
                    value={patientAddress}
                    onChangeText={setPatientAddress}
                    multiline
                  />
                ) : (
                  <Text style={styles.infoText}>{patientAddress}</Text>
                )}
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={24} color="#00BCD4" style={styles.infoIcon} />
              <View>
                <Text style={styles.infoLabel}>Date of Birth</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.editableInput}
                    value={patientDOB}
                    onChangeText={setPatientDOB}
                    placeholder="DD Month YYYY"
                  />
                ) : (
                  <Text style={styles.infoText}>{patientDOB}</Text>
                )}
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="water-outline" size={24} color="#00BCD4" style={styles.infoIcon} />
              <View>
                <Text style={styles.infoLabel}>Blood Type</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.editableInput}
                    value={patientBloodType}
                    onChangeText={setPatientBloodType}
                    autoCapitalize="characters"
                  />
                ) : (
                  <Text style={styles.infoText}>{patientBloodType}</Text>
                )}
              </View>
            </View>
          </View>

          {isEditing && (
            <TouchableOpacity style={styles.actionButton} onPress={handleSaveProfile}>
              <Text style={styles.actionButtonText}>Save Changes</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert("Change Password", "Navigate to change password screen.")}>
            <Text style={styles.actionButtonText}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
            <Text style={styles.actionButtonText}>Logout</Text>
          </TouchableOpacity>

        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 0 : 10,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1, // Allows title to take available space for centering
    textAlign: 'center',
  },
  editButton: {
    padding: 5,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  profileCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  profileIcon: {
    marginBottom: 10,
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  editableNameInput: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderColor: '#00BCD4',
    textAlign: 'center',
    paddingVertical: 2,
    width: '80%',
  },
  profileRole: {
    fontSize: 18,
    color: '#888',
  },
  infoSection: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    padding: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  // Ensure the last item has no border
  'infoItem:last-child': {
    borderBottomWidth: 0,
  },
  infoIcon: {
    marginRight: 15,
    width: 24, // Fixed width for consistent alignment
  },
  infoLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  editableInput: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
    borderBottomWidth: 1,
    borderColor: '#00BCD4',
    paddingVertical: 0,
    minWidth: '70%', // Ensure text input takes enough space
  },
  actionButton: {
    width: '100%',
    backgroundColor: '#00BCD4',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#E74C3C', // A distinct color for logout
  },
});

export default PatientProfileScreen;