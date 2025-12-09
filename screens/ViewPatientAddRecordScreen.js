// screens/ViewPatientAddRecordScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { LineChart } from "react-native-chart-kit";
import { i18n } from '../i18n';

const { width } = Dimensions.get('window');

const ViewPatientAddRecordScreen = ({ navigation, route }) => {
  const { patientId, patientName } = route.params || { patientId: 'unknown', patientName: 'Patient Details' };
  const [patientRecords, setPatientRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Force update
  const [, setTick] = useState(0);
  useEffect(() => {
    const unsubscribe = i18n.onChange(() => setTick(t => t + 1));
    return unsubscribe;
  }, []);

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

  const handleScheduleAppointment = () => {
    navigation.navigate('DoctorAppointment', { patientId: patientId, patientName: patientName });
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
        <Text style={styles.title}>{i18n.t('records')}: {patientName}</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>

        {loading ? (
          <ActivityIndicator size="large" color="#00BCD4" />
        ) : patientRecords.length === 0 ? (
          <Text style={styles.noDataText}>{i18n.t('no_records') || "No records found for this patient."}</Text>
        ) : (
          <>
            {/* Premium Linear Chart */}
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>{i18n.t('glucose')} History</Text>
              {chartData.length > 0 ? (
                <LineChart
                  data={{
                    labels: patientRecords.slice(0, 5).reverse().map(r => new Date(r.date).getDate().toString()), // Last 5 days for labels
                    datasets: [
                      {
                        data: chartData.length > 0 ? chartData : [0],
                        color: (opacity = 1) => `rgba(0, 188, 212, ${opacity})`, // optional
                        strokeWidth: 3 // optional
                      }
                    ]
                  }}
                  width={width - 40} // from react-native
                  height={220}
                  yAxisSuffix=""
                  yAxisInterval={1} // optional, defaults to 1
                  chartConfig={{
                    backgroundColor: "#ffffff",
                    backgroundGradientFrom: "#ffffff",
                    backgroundGradientTo: "#ffffff",
                    decimalPlaces: 0, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(0, 188, 212, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16
                    },
                    propsForDots: {
                      r: "6",
                      strokeWidth: "2",
                      stroke: "#00BCD4"
                    }
                  }}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 16
                  }}
                  withDots={true}
                  withInnerLines={true}
                  withOuterLines={false}
                  withVerticalLines={false}
                />
              ) : (
                <Text style={styles.noDataText}>Not enough data for chart</Text>
              )}
              <Text style={styles.chartLabel}>Recent Glucose Levels (mg/dL)</Text>
            </View>

            {/* Records List */}
            <View style={styles.recordsList}>
              {patientRecords.map(record => (
                <View key={record.id} style={styles.recordItem}>
                  <Text style={styles.recordDate}>{formatDate(record.date)}</Text>
                  <View style={styles.recordDetails}>
                    {record.glucoseLevel && <Text style={styles.recordDetailText}>{i18n.t('glucose')}: <Text style={{ fontWeight: 'bold', color: '#00BCD4' }}>{record.glucoseLevel}</Text></Text>}
                    {record.bloodPressure && <Text style={styles.recordDetailText}>{i18n.t('blood_pressure')}: {record.bloodPressure}</Text>}
                    {record.weight && <Text style={styles.recordDetailText}>{i18n.t('weight')}: {record.weight} kg</Text>}
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
          <Text style={styles.tabTextActive}>{i18n.t('my_patients')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={goToMyProfile}>
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
  fabSecondary: {
    bottom: Platform.OS === 'ios' ? 170 : 190, // Above the Add Record FAB
    backgroundColor: '#9C27B0', // different color for distinction
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
  noDataText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 20,
  },
});

export default ViewPatientAddRecordScreen;