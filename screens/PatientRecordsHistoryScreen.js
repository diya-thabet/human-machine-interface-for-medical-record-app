// screens/PatientRecordsHistoryScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Dummy data for health records
const DUMMY_RECORDS = [
  { id: '1', glucoseLevel: 120.5, bloodPressure: "120/80", weight: 75.0, date: "Aug 26, 2025 - 10:00 AM" },
  { id: '2', glucoseLevel: 130.0, bloodPressure: "118/78", weight: 74.5, date: "Aug 25, 2025 - 09:00 AM" },
  { id: '3', glucoseLevel: 125.2, bloodPressure: "122/81", weight: 75.3, date: "Aug 24, 2025 - 11:30 AM" },
  { id: '4', glucoseLevel: 140.8, bloodPressure: "125/82", weight: 76.0, date: "Aug 23, 2025 - 08:00 AM" },
  { id: '5', glucoseLevel: 115.0, bloodPressure: "115/75", weight: 74.8, date: "Aug 22, 2025 - 07:45 AM" },
  { id: '6', glucoseLevel: 128.1, bloodPressure: "121/79", weight: 75.1, date: "Aug 21, 2025 - 06:15 PM" },
];

const PatientRecordsHistoryScreen = ({ navigation }) => {

  const getChartData = () => DUMMY_RECORDS.map(record => record.glucoseLevel);
  const chartData = getChartData();

  const goToHome = () => navigation.navigate('PatientDashboard');
  const goToMyRecords = () => { /* Already on My Records */ };
  const goToMyProfile = () => console.log('Go to My Profile (Patient)');

  const handleAddRecord = () => {
    navigation.navigate('AddRecord', { patientId: 'patient123', patientName: 'John Doe' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.title}>My Health Records</Text>
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
          <Text style={styles.chartLabel}>Past {DUMMY_RECORDS.length} Days</Text>
        </View>

        <View style={styles.recordsList}>
          {DUMMY_RECORDS.map(record => (
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

      {/* Bottom Tab Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={goToHome}>
          <Ionicons name="home-outline" size={24} color="#888" />
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={goToMyRecords}>
          <Ionicons name="stats-chart-outline" size={24} color="#00BCD4" />
          <Text style={styles.tabTextActive}>My Records</Text>
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
    width: (width - 100) / DUMMY_RECORDS.length,
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
    width: (width - 100) / DUMMY_RECORDS.length + 10,
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

export default PatientRecordsHistoryScreen;