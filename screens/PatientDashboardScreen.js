// screens/PatientDashboardScreen.js
// screens/PatientDashboardScreen.js (Updated for Text strings and Safe Area)
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Placeholder for API data (replace with actual API call later)
const DUMMY_LATEST_READING = {
  glucoseLevel: 120.5,
  bloodPressure: "120/80",
  weight: 75.0,
  date: "Aug 26, 2025 at 10:00 AM" // Using a formatted string for display
};

const PatientDashboardScreen = ({ navigation }) => {
  const patientName = "John Doe"; // This would come from user data after login

  const handleViewAllRecords = () => {
    navigation.navigate('PatientRecordsHistory'); // Navigate to the patient's records history screen
  };

  // Placeholder for tab navigation actions
  const goToHome = () => { /* Already on Home */ };
  const goToMyRecords = () => navigation.navigate('PatientRecordsHistory');
  const goToMyProfile = () => console.log('Go to My Profile (Patient)');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome, {patientName}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Latest Reading</Text>
          <Text style={styles.glucoseLevel}>{DUMMY_LATEST_READING.glucoseLevel}</Text>
          {/* Ensure all details are robustly within <Text> components */}
          <Text style={styles.detailText}>Blood Pressure: {DUMMY_LATEST_READING.bloodPressure}</Text>
          <Text style={styles.detailText}>Weight: {DUMMY_LATEST_READING.weight} kg</Text>
          <Text style={styles.detailText}>Date: {DUMMY_LATEST_READING.date}</Text>

          <TouchableOpacity style={styles.viewRecordsButton} onPress={handleViewAllRecords}>
            <Text style={styles.viewRecordsButtonText}>View All My Records</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Tab Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={goToHome}>
          <Ionicons name="home-outline" size={24} color="#00BCD4" />
          <Text style={styles.tabTextActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={goToMyRecords}>
          <Ionicons name="stats-chart-outline" size={24} color="#888" />
          <Text style={styles.tabText}>My Records</Text>
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
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  header: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'left',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 25,
    alignItems: 'flex-start',
    marginBottom: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#00BCD4',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  glucoseLevel: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#00BCD4',
    marginBottom: 15,
  },
  detailText: {
    fontSize: 18,
    color: '#555',
    marginBottom: 8,
  },
  viewRecordsButton: {
    width: '100%',
    backgroundColor: '#00BCD4',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 25,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  viewRecordsButtonText: {
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

export default PatientDashboardScreen;