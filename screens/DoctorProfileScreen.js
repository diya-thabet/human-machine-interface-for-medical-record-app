// screens/DoctorProfileScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const DoctorProfileScreen = ({ navigation }) => {
  // Dummy Doctor Data - replace with actual data from a state management or API call
  const [doctorName, setDoctorName] = useState('Dr. Jane Smith');
  const [doctorSpecialty, setDoctorSpecialty] = useState('General Practitioner');
  const [doctorEmail, setDoctorEmail] = useState('jane.smith@clinic.com');
  const [doctorPhone, setDoctorPhone] = useState('+1 555-987-6543');
  const [doctorClinic, setDoctorClinic] = useState('Central Health Clinic');
  const [doctorLicense, setDoctorLicense] = useState('MD1234567');

  const [isEditing, setIsEditing] = useState(false);

  const handleSaveProfile = () => {
    // Here you would typically send updated data to your backend
    console.log('Saving Doctor Profile:', {
      doctorName,
      doctorSpecialty,
      doctorEmail,
      doctorPhone,
      doctorClinic,
      doctorLicense,
    });
    Alert.alert("Success", "Your profile has been updated!");
    setIsEditing(false);
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
            console.log("Doctor logged out");
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

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.profileCard}>
          <Ionicons name="medkit-outline" size={100} color="#00BCD4" style={styles.profileIcon} />
          {isEditing ? (
            <TextInput
              style={styles.editableNameInput}
              value={doctorName}
              onChangeText={setDoctorName}
              placeholder="Full Name"
            />
          ) : (
            <Text style={styles.profileName}>{doctorName}</Text>
          )}
          <Text style={styles.profileRole}>{doctorSpecialty}</Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Ionicons name="mail-outline" size={24} color="#00BCD4" style={styles.infoIcon} />
            <View>
              <Text style={styles.infoLabel}>Email</Text>
              {isEditing ? (
                <TextInput
                  style={styles.editableInput}
                  value={doctorEmail}
                  onChangeText={setDoctorEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              ) : (
                <Text style={styles.infoText}>{doctorEmail}</Text>
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
                  value={doctorPhone}
                  onChangeText={setDoctorPhone}
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.infoText}>{doctorPhone}</Text>
              )}
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="business-outline" size={24} color="#00BCD4" style={styles.infoIcon} />
            <View>
              <Text style={styles.infoLabel}>Clinic/Hospital</Text>
              {isEditing ? (
                <TextInput
                  style={styles.editableInput}
                  value={doctorClinic}
                  onChangeText={setDoctorClinic}
                />
              ) : (
                <Text style={styles.infoText}>{doctorClinic}</Text>
              )}
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="id-card-outline" size={24} color="#00BCD4" style={styles.infoIcon} />
            <View>
              <Text style={styles.infoLabel}>Medical License</Text>
              {isEditing ? (
                <TextInput
                  style={styles.editableInput}
                  value={doctorLicense}
                  onChangeText={setDoctorLicense}
                  autoCapitalize="characters"
                />
              ) : (
                <Text style={styles.infoText}>{doctorLicense}</Text>
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
    flex: 1,
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
    minWidth: '70%',
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

export default DoctorProfileScreen;