
// screens/PatientDashboardScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../firebaseConfig';
import { collection, query, where, limit, orderBy, onSnapshot } from 'firebase/firestore';

import { i18n } from '../i18n';

const { width } = Dimensions.get('window');

const PatientDashboardScreen = ({ navigation }) => {
  const [patientName, setPatientName] = useState('Patient');
  const [recentRecords, setRecentRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Force update
  const [, setTick] = useState(0);
  useEffect(() => {
    const unsubscribe = i18n.onChange(() => setTick(t => t + 1));
    return unsubscribe;
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setPatientName(user.displayName || user.email?.split('@')[0]);
    }

    if (!user) {
      navigation.navigate('Login');
      return;
    }

    // Fetch Records
    const recordsQuery = query(
      collection(db, "records"),
      where("patientId", "==", user.uid)
      // orderBy("date", "desc"), // Removed to bypass index
      // limit(3) // Removed limit to allow client-side sort
    );

    const unsubscribeRecords = onSnapshot(recordsQuery, (querySnapshot) => {
      const records = [];
      querySnapshot.forEach((doc) => {
        records.push({ id: doc.id, ...doc.data() });
      });
      // Client-side sort and limit
      records.sort((a, b) => new Date(b.date) - new Date(a.date));
      const recent = records.slice(0, 3);

      setRecentRecords(recent);
      // setLoading(false); 
    }, (error) => {
      console.error("Error fetching records:", error);
      // setLoading(false);
    });

    // Fetch Appointments
    // Assuming appointments have 'patientId' and 'date'
    const appointmentsQuery = query(
      collection(db, "appointments"),
      where("patientId", "==", user.uid)
      // orderBy("date", "asc") // Removed to bypass index
    );

    const unsubscribeAppointments = onSnapshot(appointmentsQuery, (querySnapshot) => {
      const fetchedAppointments = [];
      querySnapshot.forEach((doc) => {
        fetchedAppointments.push({ id: doc.id, ...doc.data() });
      });
      // Client-side sort
      fetchedAppointments.sort((a, b) => new Date(a.date) - new Date(b.date));

      setAppointments(fetchedAppointments);
      setLoading(false); // Set loading to false after both are fetched
    }, (error) => {
      console.error("Error fetching appointments:", error);
      setLoading(false);
    });

    return () => {
      unsubscribeRecords();
      unsubscribeAppointments();
    };
  }, []);

  const handleSignOut = () => {
    auth.signOut()
      .then(() => navigation.replace('Login'))
      .catch(error => alert(error.message));
  };

  const goToAddRecord = () => {
    navigation.navigate('AddRecord', { patientId: auth.currentUser?.uid, patientName: patientName });
  };

  const goToHistory = () => {
    navigation.navigate('PatientRecordsHistory');
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingText}>{i18n.t('welcome') || "Hello"},</Text>
          <Text style={styles.userNameText}>{patientName}!</Text>
        </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.profileIcon}>
          <Ionicons name="log-out-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>

        {/* Quick Actions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={goToAddRecord}>
              <View style={[styles.iconContainer, { backgroundColor: '#E0F7FA' }]}>
                <Ionicons name="add-circle" size={32} color="#00BCD4" />
              </View>
              <Text style={styles.actionText}>{i18n.t('add_record')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={goToHistory}>
              <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="time" size={32} color="#2196F3" />
              </View>
              <Text style={styles.actionText}>{i18n.t('history')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('RequestAppointment')}>
              <View style={[styles.iconContainer, { backgroundColor: '#F3E5F5' }]}>
                <Ionicons name="calendar" size={32} color="#9C27B0" />
              </View>
              <Text style={styles.actionText}>{i18n.t('upcoming_appointments') || 'Appt.'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('PatientDiet')}>
              <View style={[styles.iconContainer, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="nutrition" size={32} color="#FF9800" />
              </View>
              <Text style={styles.actionText}>{i18n.t('diet') || 'Diet'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Appointments */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{i18n.t('upcoming_appointments')}</Text>
            <TouchableOpacity><Text style={styles.seeAllText}>See All</Text></TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#00BCD4" />
          ) : appointments.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={40} color="#CCC" />
              <Text style={styles.emptyStateText}>No upcoming appointments.</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {appointments.map((apt) => (
                <View key={apt.id} style={styles.appointmentCard}>
                  <View style={styles.appointmentDateBox}>
                    <Text style={styles.appointmentDateDay}>{new Date(apt.date).getDate()}</Text>
                    <Text style={styles.appointmentDateMonth}>{new Date(apt.date).toLocaleString('default', { month: 'short' })}</Text>
                  </View>
                  <View style={styles.appointmentDetails}>
                    <Text style={styles.doctorName}>Dr. {apt.doctorName || 'Unknown'}</Text>
                    <Text style={styles.appointmentType}>{apt.type || 'Checkup'}</Text>
                    <View style={styles.timeContainer}>
                      <Ionicons name="time-outline" size={14} color="#666" />
                      <Text style={styles.timeText}>{new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Recent Health Metrics */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{i18n.t('recent_records')}</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#00BCD4" />
          ) : recentRecords.length === 0 ? (
            <Text style={styles.noDataText}>No records added yet.</Text>
          ) : (
            recentRecords.map(record => (
              <View key={record.id} style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <Text style={styles.metricDate}>{formatDate(record.date)}</Text>
                </View>
                <View style={styles.metricRow}>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>{i18n.t('glucose')}</Text>
                    <Text style={styles.metricValue}>{record.glucoseLevel || '--'}</Text>
                    <Text style={styles.metricUnit}>mg/dL</Text>
                  </View>
                  {/* Divider */}
                  <View style={styles.verticalDivider} />
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>{i18n.t('weight')}</Text>
                    <Text style={styles.metricValue}>{record.weight || '--'}</Text>
                    <Text style={styles.metricUnit}>kg</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

      </ScrollView>

      {/* Bottom Tab Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => { /* Already on Home */ }}>
          <Ionicons name="home-outline" size={24} color="#00BCD4" />
          <Text style={styles.tabTextActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={goToHistory}>
          <Ionicons name="stats-chart-outline" size={24} color="#888" />
          <Text style={styles.tabText}>{i18n.t('history')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('PatientProfile')}>
          <Ionicons name="person-outline" size={24} color="#888" />
          <Text style={styles.tabText}>{i18n.t('profile')}</Text>
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
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  greetingText: {
    fontSize: 16,
    color: '#757575',
  },
  userNameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  profileIcon: {
    padding: 5,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAllText: {
    color: '#00BCD4',
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Keeps them spaced out
  },
  actionCard: {
    width: '45%', // Change from 23% to 45% (2 per row) for better tappability and visibility
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  actionText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#FFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#EEE',
    borderStyle: 'dashed',
  },
  emptyStateText: {
    color: '#BBB',
    marginTop: 10,
    fontSize: 14,
  },
  horizontalScroll: {
    paddingBottom: 10,
  },
  appointmentCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginRight: 15,
    width: width * 0.75,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    alignItems: 'center',
  },
  appointmentDateBox: {
    backgroundColor: '#E0F7FA',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    marginRight: 15,
  },
  appointmentDateDay: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00BCD4',
  },
  appointmentDateMonth: {
    fontSize: 12,
    color: '#008BA3',
    textTransform: 'uppercase',
  },
  appointmentDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  appointmentType: {
    fontSize: 13,
    color: '#777',
    marginVertical: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  metricCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  metricDate: {
    fontSize: 12,
    color: '#999',
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  verticalDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#EEE',
  },
  metricLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  metricUnit: {
    fontSize: 12,
    color: '#AAA',
  },
  noDataText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 20,
    fontStyle: 'italic',
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
    fontSize: 10,
    color: '#888',
    marginTop: 4,
  },
  tabTextActive: {
    fontSize: 10,
    color: '#00BCD4',
    fontWeight: 'bold',
    marginTop: 4,
  },
});

export default PatientDashboardScreen;