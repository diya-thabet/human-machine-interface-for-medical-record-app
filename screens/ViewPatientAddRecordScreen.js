// screens/ViewPatientAddRecordScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

const { width } = Dimensions.get('window');

const ViewPatientAddRecordScreen = ({ navigation, route }) => {
  const { patientId, patientName } = route.params || { patientId: 'unknown', patientName: 'Patient Details' };
  const [patientRecords, setPatientRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;

    const q = query(
      collection(db, "records"),
      where("patientId", "==", patientId)
      // orderBy("date", "desc") // Removed to bypass index
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedRecords = [];
      querySnapshot.forEach((doc) => {
        fetchedRecords.push({ id: doc.id, ...doc.data() });
      });
      // Client-side sort
      fetchedRecords.sort((a, b) => new Date(b.date) - new Date(a.date));

      setPatientRecords(fetchedRecords);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching patient records:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [patientId]);


  const getChartData = () => {
    if (patientRecords.length === 0) return [];
    // improved chart data to be chronological
    const chronologicalRecords = [...patientRecords].reverse();
    return chronologicalRecords.map(record => parseFloat(record.glucoseLevel) || 0);
  };

  const chartData = getChartData();

  const handleAddRecord = () => {
    navigation.navigate('AddRecord', { patientId: patientId, patientName: patientName });
  };

  const goToPatients = () => { navigation.navigate('DoctorDashboard'); };
  const goToMyProfile = () => navigation.navigate('DoctorProfile');

  // Format date helper
  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

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

        {loading ? (
          <ActivityIndicator size="large" color="#00BCD4" />
        ) : patientRecords.length === 0 ? (
          <Text style={styles.noDataText}>No records found for this patient.</Text>
        ) : (
          <>
            {/* Simple Chart */}
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Glucose Level Trend</Text>
              <View style={styles.chartArea}>
                {chartData.map((value, index) => {
                  const prevValue = index > 0 ? chartData[index - 1] : value;
                  // Normalizing for chart height (assuming max 200 for simple viz)
                  const height1 = Math.min((prevValue / 200) * 100, 100);
                  const height2 = Math.min((value / 200) * 100, 100);

                  return (
                    <View key={index} style={styles.chartPointWrapper}>
                      {index > 0 && (
                        <View style={[styles.chartLine, {
                          height: Math.abs(height2 - height1),
                          transform: [{ translateY: Math.min(height1, height2) - 50 }], // Approximate positioning
                          left: -20, // Approximate spacing
                          backgroundColor: '#00BCD4',
                        }]} />
                      )}
                      <View style={[styles.chartPoint, { bottom: height2 - 5 }]} />
                    </View>
                  );
                })}
              </View>
              <Text style={styles.chartLabel}>Past {patientRecords.length} Entries</Text>
            </View>

            {/* Records List */}
            <View style={styles.recordsList}>
              {patientRecords.map(record => (
                <View key={record.id} style={styles.recordItem}>
                  <Text style={styles.recordDate}>{formatDate(record.date)}</Text>
                  <View style={styles.recordDetails}>
                    {record.glucoseLevel && <Text style={styles.recordDetailText}>Glucose: <Text style={{ fontWeight: 'bold', color: '#00BCD4' }}>{record.glucoseLevel}</Text></Text>}
                    {record.bloodPressure && <Text style={styles.recordDetailText}>BP: {record.bloodPressure}</Text>}
                    {record.weight && <Text style={styles.recordDetailText}>Weight: {record.weight} kg</Text>}
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
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
    width: (width - 100) / 7, // Defaulting to 7 items for styling base
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
    width: (width - 100) / 7 + 10, // Defaulting to 7 items
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