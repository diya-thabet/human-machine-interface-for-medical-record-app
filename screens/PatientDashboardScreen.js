// screens/PatientDashboardScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Dummy data for upcoming appointments
const DUMMY_APPOINTMENTS = [
  { id: '1', doctor: 'Dr. Jane Smith', time: '10:00 AM', date: 'Sept 1, 2025', type: 'Follow-up' },
  { id: '2', doctor: 'Dr. John Doe', time: '02:30 PM', date: 'Sept 3, 2025', type: 'Consultation' },
];

// Dummy data for recent health metrics
const DUMMY_METRICS = [
  { id: 'm1', label: 'Glucose', value: '120 mg/dL', trend: 'up', icon: 'thermometer-outline' },
  { id: 'm2', label: 'Blood Pressure', value: '120/80 mmHg', trend: 'stable', icon: 'heart-outline' },
  { id: 'm3', label: 'Weight', value: '75 kg', trend: 'down', icon: 'fitness-outline' },
];

const PatientDashboardScreen = ({ navigation }) => {

  const goToHome = () => { /* Already on Home */ };
  const goToMyRecords = () => navigation.navigate('PatientRecordsHistory');
  // FIX: This line is updated to navigate to PatientProfile
  const goToMyProfile = () => navigation.navigate('PatientProfile');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hello, John!</Text>
        <TouchableOpacity onPress={() => console.log('Notifications pressed')} style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={28} color="#2C3E50" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Quick Access Card */}
        <View style={styles.quickAccessCard}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.quickAccessButtons}>
            <TouchableOpacity style={styles.quickActionButton} onPress={goToMyRecords}>
              <Ionicons name="stats-chart-outline" size={30} color="#00BCD4" />
              <Text style={styles.quickActionButtonText}>My Records</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton} onPress={() => navigation.navigate('AddRecord')}>
              <Ionicons name="add-circle-outline" size={30} color="#00BCD4" />
              <Text style={styles.quickActionButtonText}>Add Record</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton} onPress={() => console.log('Request Appointment')}>
              <Ionicons name="calendar-outline" size={30} color="#00BCD4" />
              <Text style={styles.quickActionButtonText}>Appointment</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Appointments Section */}
        <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {DUMMY_APPOINTMENTS.map(appointment => (
            <View key={appointment.id} style={styles.appointmentCard}>
              <Text style={styles.appointmentDate}>{appointment.date}</Text>
              <Text style={styles.appointmentTime}>{appointment.time}</Text>
              <Text style={styles.appointmentDoctor}>with {appointment.doctor}</Text>
              <Text style={styles.appointmentType}>{appointment.type}</Text>
              <TouchableOpacity style={styles.detailsButton}>
                <Text style={styles.detailsButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Recent Health Metrics Section */}
        <Text style={styles.sectionTitle}>Recent Health Metrics</Text>
        <View style={styles.metricsGrid}>
          {DUMMY_METRICS.map(metric => (
            <View key={metric.id} style={styles.metricCard}>
              <Ionicons name={metric.icon} size={30} color="#00BCD4" />
              <Text style={styles.metricLabel}>{metric.label}</Text>
              <Text style={styles.metricValue}>{metric.value}</Text>
              <View style={styles.trendContainer}>
                <Ionicons
                  name={metric.trend === 'up' ? 'arrow-up-circle-outline' : metric.trend === 'down' ? 'arrow-down-circle-outline' : 'remove-circle-outline'}
                  size={16}
                  color={metric.trend === 'up' ? '#E74C3C' : metric.trend === 'down' ? '#2ECC71' : '#888'}
                />
                <Text style={[styles.trendText, { color: metric.trend === 'up' ? '#E74C3C' : metric.trend === 'down' ? '#2ECC71' : '#888' }]}>
                  {metric.trend.charAt(0).toUpperCase() + metric.trend.slice(1)}
                </Text>
              </View>
            </View>
          ))}
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
  },
  notificationButton: {
    padding: 5,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  quickAccessCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  quickAccessButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  quickActionButton: {
    alignItems: 'center',
    padding: 10,
  },
  quickActionButtonText: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
  },
  horizontalScroll: {
    paddingRight: 20, // Add some padding to the end of the scroll view
    marginBottom: 30,
  },
  appointmentCard: {
    backgroundColor: '#E0F7FA', // Light blue background
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    width: Dimensions.get('window').width * 0.7, // Take up 70% of screen width
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00BCD4',
    marginBottom: 5,
  },
  appointmentTime: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  appointmentDoctor: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  appointmentType: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#777',
    marginBottom: 10,
  },
  detailsButton: {
    backgroundColor: '#00BCD4',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  detailsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    width: (width / 2) - 30, // Approx half screen width minus padding
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  metricLabel: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 5,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    marginLeft: 5,
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