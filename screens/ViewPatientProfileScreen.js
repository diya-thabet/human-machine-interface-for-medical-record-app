// screens/ViewPatientProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const ViewPatientProfileScreen = ({ navigation, route }) => {
  // Get patientId and patientName from navigation params
  const { patientId, patientName } = route.params || { patientId: 'unknown', patientName: 'Selected Patient' };

  // Dummy data for the viewed patient - in a real app, you'd fetch this using patientId
  const viewedPatient = {
    name: patientName,
    email: 'patient.email@example.com',
    phone: '+1 555-000-1111',
    address: '456 Wellness Ave, Health City',
    dob: 'February 15, 1985',
    bloodType: 'B-',
    medicalHistory: 'Hypertension, Diabetes Type 2',
    allergies: 'Penicillin',
  };

  const goToPatients = () => navigation.navigate('DoctorDashboard');
  const goToMyProfile = () => navigation.navigate('DoctorProfile'); // Navigates to DoctorProfileScreen

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.title}>Patient Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ViewPatientAddRecord', { patientId, patientName })} style={styles.editButton}>
          <Ionicons name="document-text-outline" size={28} color="#00BCD4" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.profileCard}>
          <Ionicons name="person-circle-outline" size={100} color="#00BCD4" style={styles.profileIcon} />
          <Text style={styles.profileName}>{viewedPatient.name}</Text>
          <Text style={styles.profileRole}>Patient ID: {patientId}</Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Ionicons name="mail-outline" size={24} color="#00BCD4" style={styles.infoIcon} />
            <View>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoText}>{viewedPatient.email}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="call-outline" size={24} color="#00BCD4" style={styles.infoIcon} />
            <View>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoText}>{viewedPatient.phone}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={24} color="#00BCD4" style={styles.infoIcon} />
            <View>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoText}>{viewedPatient.address}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={24} color="#00BCD4" style={styles.infoIcon} />
            <View>
              <Text style={styles.infoLabel}>Date of Birth</Text>
              <Text style={styles.infoText}>{viewedPatient.dob}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="water-outline" size={24} color="#00BCD4" style={styles.infoIcon} />
            <View>
              <Text style={styles.infoLabel}>Blood Type</Text>
              <Text style={styles.infoText}>{viewedPatient.bloodType}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="document-text-outline" size={24} color="#00BCD4" style={styles.infoIcon} />
            <View>
              <Text style={styles.infoLabel}>Medical History</Text>
              <Text style={styles.infoText}>{viewedPatient.medicalHistory}</Text>
            </View>
          </View>

          <View style={[styles.infoItem, { borderBottomWidth: 0 }]}> {/* Last item, no border */}
            <Ionicons name="warning-outline" size={24} color="#E74C3C" style={styles.infoIcon} />
            <View>
              <Text style={styles.infoLabel}>Allergies</Text>
              <Text style={styles.infoTextAlert}>{viewedPatient.allergies}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('ViewPatientAddRecord', { patientId, patientName })}>
          <Text style={styles.actionButtonText}>View/Add Records</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Bottom Tab Navigation (Doctor's) */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={goToPatients}>
          <Ionicons name="people-outline" size={24} color="#00BCD4" />
          <Text style={styles.tabTextActive}>Patients</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={goToMyProfile}>
          <Ionicons name="person-outline" size={24} color="#888" />
          <Text style={styles.tabText}>My Profile</Text>
        </TouchableOpacity>
      </View>
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
  infoIcon: {
    marginRight: 15,
    width: 24,
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
  infoTextAlert: {
    fontSize: 18,
    color: '#E74C3C',
    fontWeight: '500',
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
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  tabItem: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  tabTextActive: {
    fontSize: 14,
    color: '#00BCD4',
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default ViewPatientProfileScreen;