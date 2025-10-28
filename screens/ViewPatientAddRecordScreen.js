// screens/ViewPatientAddRecordScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Ensure correct import for SafeAreaView if it causes issues
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Dummy data for health records (for the selected patient)
const DUMMY_PATIENT_RECORDS = [
  { id: 'p1r1', glucoseLevel: 110.0, bloodPressure: "115/75", weight: 70.0, date: "Aug 28, 2025 - 08:30 AM" },
  { id: 'p1r2', glucoseLevel: 118.5, bloodPressure: "119/78", weight: 70.2, date: "Aug 27, 2025 - 09:15 AM" },
  { id: 'p1r3', glucoseLevel: 105.7, bloodPressure: "110/70", weight: 69.5, date: "Aug 26, 2025 - 07:00 AM" },
  { id: 'p1r4', glucoseLevel: 122.3, bloodPressure: "125/80", weight: 71.0, date: "Aug 25, 2025 - 08:45 AM" },
];

const ViewPatientAddRecordScreen = ({ navigation, route }) => {
  const { patientId, patientName } = route.params || { patientId: 'unknown', patientName: 'Patient Details' };

  const patientRecords = DUMMY_PATIENT_RECORDS;

  const getChartData = () => patientRecords.map(record => record.glucoseLevel);
  const chartData = getChartData();

  const handleAddRecord = () => {
    navigation.navigate('AddRecord', { patientId: patientId, patientName: patientName });
  };

  const goToPatients = () => { navigation.navigate('DoctorDashboard'); };
  const goToMyProfile = () => console.log('Go to My Profile (Doctor)');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.title}>Records: {patientName}</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Glucose Level Trend</Text>
          <View style={styles.chartArea}>
            {chartData.map((value, index) => {
              const prevValue = index > 0 ? chartData[index - 1] : value;
              const height1 = (prevValue / 200) * 100;
              const height2 = (value / 200) * 100;

              return (
                <View key={index} style={styles.chartPointWrapper}>
                  {index > 0 && (
                    <View style={[styles.chartLine, {
                      height: Math.abs(height2 - height1),
                      transform: [{ translateY: Math.min(height1, height2) - 50 }],
                      left: -20,
                      backgroundColor: '#00BCD4',
                    }]} />
                  )}
                  <View style={[styles.chartPoint, { bottom: height2 - 5 }]} />
                </View>
              );
            })}
          </View>
          <Text style={styles.chartLabel}>Past {patientRecords.length} Days</Text>
        </View>

        <View style={styles.recordsList}>
          {patientRecords.map(record => (
            <View key={record.id} style={styles.recordItem}>
              <Text style={styles.recordDate}>{record.date}</Text>
              <View style={styles.recordDetails}>
                <Text style={styles.recordDetailText}>Glucose: <Text style={{fontWeight: 'bold', color: '#00BCD4'}}>{record.glucoseLevel}</Text></Text>
                <Text style={styles.recordDetailText}>BP: {record.bloodPressure}</Text>
                <Text style={styles.recordDetailText}>Weight: {record.weight} kg</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button for adding new record */}
      <TouchableOpacity style={styles.fab} onPress={handleAddRecord}>
        <Ionicons name="add-outline" size={35} color="#FFFFFF" />
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
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
    textAlign: 'center',
    marginLeft: -28,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  chartContainer: {
    width: '100%',
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
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  chartArea: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    paddingHorizontal: 10,
    marginBottom: 10,
    position: 'relative',
  },
  chartPointWrapper: {
    width: (width - 100) / DUMMY_PATIENT_RECORDS.length,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  },
  chartPoint: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00BCD4',
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  chartLine: {
    position: 'absolute',
    width: (width - 100) / DUMMY_PATIENT_RECORDS.length + 10,
    backgroundColor: '#00BCD4',
  },
  chartLabel: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
  recordsList: {
    width: '100%',
  },
  recordItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#A7DBD8',
  },
  recordDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  recordDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  recordDetailText: {
    fontSize: 15,
    color: '#555',
    marginBottom: 4,
    width: '48%',
  },
  // FURTHER ADJUSTED FAB Style (Increased bottom padding again for Android)
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 25,
    bottom: Platform.OS === 'ios' ? 100 : 120, // Adjusted: Increased from 105 to 120 for Android
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

export default ViewPatientAddRecordScreen;