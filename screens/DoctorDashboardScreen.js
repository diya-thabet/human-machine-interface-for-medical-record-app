// screens/DoctorDashboardScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Dummy data for patients
const DUMMY_PATIENTS = [
  { id: '1', name: 'Alice Johnson', lastVisit: 'Aug 28, 2025', status: 'Stable', details: 'Regular check-up' },
  { id: '2', name: 'Bob Williams', lastVisit: 'Aug 27, 2025', status: 'Follow-up', details: 'Post-op review' },
  { id: '3', name: 'Charlie Brown', lastVisit: 'Aug 26, 2025', status: 'New Patient', details: 'Initial consultation' },
  { id: '4', name: 'Diana Prince', lastVisit: 'Aug 25, 2025', status: 'Improving', details: 'Diabetes management' },
  { id: '5', name: 'Eve Adams', lastVisit: 'Aug 24, 2025', status: 'Critical', details: 'Urgent care' },
  { id: '6', name: 'Frank White', lastVisit: 'Aug 23, 2025', status: 'Stable', details: 'Annual physical' },
  { id: '7', name: 'Grace Hall', lastVisit: 'Aug 22, 2025', status: 'Stable', details: 'Vaccination' },
];

const DoctorDashboardScreen = ({ navigation }) => {

  const goToPatients = () => { /* Already on Patients tab */ };
  const goToMyProfile = () => navigation.navigate('DoctorProfile'); // Navigates to DoctorProfileScreen

  const handleViewPatientRecords = (patientId, patientName) => {
    navigation.navigate('ViewPatientAddRecord', { patientId, patientName });
  };

  const handleAddPatient = () => {
    console.log("Navigate to Add New Patient screen");
    // navigation.navigate('AddPatient'); // You would create an AddPatientScreen
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Doctor Dashboard</Text>
        <TouchableOpacity onPress={() => console.log('Doctor Settings')} style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={28} color="#2C3E50" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.sectionTitle}>My Patients</Text>
        <View style={styles.patientList}>
          {DUMMY_PATIENTS.map(patient => (
            <TouchableOpacity
              key={patient.id}
              style={styles.patientCard}
              onPress={() => handleViewPatientRecords(patient.id, patient.name)}
            >
              <View style={styles.patientInfo}>
                <Ionicons name="person-circle-outline" size={40} color="#00BCD4" />
                <View style={styles.patientTextContainer}>
                  <Text style={styles.patientName}>{patient.name}</Text>
                  <Text style={styles.patientDetail}>Last Visit: {patient.lastVisit}</Text>
                  <Text style={styles.patientDetail}>Status: {patient.status}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward-outline" size={24} color="#888" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button for adding new patient */}
      <TouchableOpacity style={styles.fab} onPress={handleAddPatient}>
        <Ionicons name="person-add-outline" size={35} color="#FFFFFF" />
      </TouchableOpacity>

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
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
    textAlign: 'center',
    marginLeft: 28, // Offset for settings button to center title
  },
  settingsButton: {
    padding: 5,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
  },
  patientList: {
    width: '100%',
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  patientTextContainer: {
    marginLeft: 15,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  patientDetail: {
    fontSize: 14,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 25,
    bottom: Platform.OS === 'ios' ? 100 : 120, // Keep consistent with patient screens
    backgroundColor: '#00BCD4',
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 10,
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

export default DoctorDashboardScreen;