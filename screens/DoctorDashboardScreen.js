
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions, ActivityIndicator, Modal, TextInput, Alert, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, onSnapshot, getDocs, updateDoc, arrayUnion, arrayRemove, doc } from 'firebase/firestore'; // Added arrayRemove
import { i18n } from '../i18n';

const { width } = Dimensions.get('window');

const DoctorDashboardScreen = ({ navigation }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorName, setDoctorName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [assigning, setAssigning] = useState(false);

  // Force update
  const [, setTick] = useState(0);
  useEffect(() => {
    const unsubscribe = i18n.onChange(() => setTick(t => t + 1));
    return unsubscribe;
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setDoctorName(user.displayName || user.email?.split('@')[0] || 'Doctor');
    } else {
      // Handle case where user might not be logged in or auth is initializing
      return;
    }

    // Query patients assigned to this doctor
    // We assume patients have an 'assignedDoctorIds' array field
    const q = query(
      collection(db, "users"),
      where("role", "==", "PATIENT"),
      where("assignedDoctorIds", "array-contains", user.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedPatients = [];
      querySnapshot.forEach((doc) => {
        fetchedPatients.push({ id: doc.id, ...doc.data() });
      });
      setPatients(fetchedPatients);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching patients: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const goToPatients = () => { /* Already on Patients tab */ };
  const goToMyProfile = () => navigation.navigate('DoctorProfile');

  const handleViewPatientRecords = (patientId, patientName) => {
    navigation.navigate('ViewPatientAddRecord', { patientId, patientName });
  };

  const handleAssignDiet = (patient) => {
    navigation.navigate('DoctorDiet', { patientId: patient.id, patientName: patient.fullName });
  };

  const handleRemovePatient = (patientId, name) => {
    Alert.alert(
      i18n.t('remove_patient'),
      i18n.t('confirm_remove_patient'),
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        {
          text: i18n.t('remove'),
          style: 'destructive',
          onPress: async () => {
            try {
              await updateDoc(doc(db, "users", patientId), {
                assignedDoctorIds: arrayRemove(auth.currentUser.uid)
              });
              Alert.alert(i18n.t('success'), "Patient removed.");
            } catch (error) {
              console.error("Error removing patient:", error);
              Alert.alert(i18n.t('error'), "Failed to remove patient.");
            }
          }
        }
      ]
    );
  };

  const handleAddPatient = () => {
    setModalVisible(true);
  };

  const assignPatient = async () => {
    if (!searchEmail) {
      Alert.alert(i18n.t('error'), "Please enter an email address.");
      return;
    }

    setAssigning(true);
    try {
      // 1. Find the patient by email
      const q = query(
        collection(db, "users"),
        where("email", "==", searchEmail.trim().toLowerCase()),
        where("role", "==", "PATIENT")
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert(i18n.t('error'), "No patient found with this email.");
        setAssigning(false);
        return;
      }

      const patientDoc = querySnapshot.docs[0];
      const patientId = patientDoc.id;
      const patientData = patientDoc.data();

      // 2. Check if already assigned
      if (patientData.assignedDoctorIds && patientData.assignedDoctorIds.includes(auth.currentUser.uid)) {
        Alert.alert("Info", "This patient is already assigned to you.");
        setAssigning(false);
        setModalVisible(false);
        setSearchEmail('');
        return;
      }

      // 3. Assign doctor to patient
      await updateDoc(doc(db, "users", patientId), {
        assignedDoctorIds: arrayUnion(auth.currentUser.uid)
      });

      Alert.alert(i18n.t('success'), "Patient " + (patientData.fullName || searchEmail) + " assigned successfully!");
      setModalVisible(false);
      setSearchEmail('');

    } catch (error) {
      console.error("Error assigning patient:", error);
      Alert.alert(i18n.t('error'), "Failed to assign patient. " + error.message);
    } finally {
      setAssigning(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{i18n.t('welcome')}, Dr. {doctorName}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={28} color="#2C3E50" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.sectionTitle}>{i18n.t('my_patients')}</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#00BCD4" />
        ) : patients.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="people-outline" size={60} color="#DDD" />
            <Text style={styles.noDataText}>{i18n.t('no_patients') || "No patients assigned yet."}</Text>
            <Text style={styles.subText}>{i18n.t('tap_plus_assign') || "Tap the + button to assign a patient by email."}</Text>
          </View>
        ) : (
          <View style={styles.patientList}>
            {patients.map(patient => (
              <View key={patient.id} style={styles.patientCard}>
                <TouchableOpacity
                  style={styles.patientInfo}
                  onPress={() => handleViewPatientRecords(patient.id, patient.fullName || patient.email)}
                >
                  <Ionicons name="person-circle-outline" size={40} color="#00BCD4" />
                  <View style={styles.patientTextContainer}>
                    <Text style={styles.patientName}>{patient.fullName || patient.email}</Text>
                    <Text style={styles.patientDetail}>Email: {patient.email}</Text>
                    <Text style={styles.patientDetail}>Status: Active</Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('Chat', { recipientId: patient.id, recipientName: patient.fullName || patient.email })}
                  >
                    <Ionicons name="chatbubble-ellipses-outline" size={24} color="#4CAF50" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleAssignDiet(patient)}
                  >
                    <Ionicons name="nutrition-outline" size={24} color="#00BCD4" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleRemovePatient(patient.id, patient.fullName)}
                  >
                    <Ionicons name="trash-outline" size={24} color="#F44336" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button for adding new patient */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fabSecondary} onPress={() => navigation.navigate('DoctorAppointments')}>
          <Ionicons name="calendar-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.fab} onPress={handleAddPatient}>
          <Ionicons name="person-add-outline" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Assign Patient Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.centeredView}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{i18n.t('assign')} {i18n.t('patient')}</Text>
            <Text style={styles.modalSubText}>Enter the patient's email address to add them to your list.</Text>

            <TextInput
              style={styles.modalInput}
              placeholder={i18n.t('search_email')}
              placeholderTextColor="#999"
              value={searchEmail}
              onChangeText={setSearchEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textStyle}>{i18n.t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonAssign]}
                onPress={assignPatient}
                disabled={assigning}
              >
                {assigning ? <ActivityIndicator color="#FFF" /> : <Text style={styles.textStyle}>{i18n.t('assign')}</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

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
  title: {
    fontSize: 22, // Slightly reduced to fit longer names
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
  fabContainer: {
    position: 'absolute',
    right: 25,
    bottom: Platform.OS === 'ios' ? 100 : 120,
    alignItems: 'center',
    zIndex: 10,
  },
  fab: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00BCD4',
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginTop: 15,
  },
  fabSecondary: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9C27B0',
    borderRadius: 25,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
  // Modal Styles
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '85%',
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  modalSubText: {
    marginBottom: 20,
    textAlign: "center",
    color: '#666',
  },
  modalInput: {
    width: '100%',
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    width: '45%',
    alignItems: 'center',
  },
  buttonClose: {
    backgroundColor: "#FF5252",
  },
  buttonAssign: {
    backgroundColor: "#00BCD4",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  emptyStateContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  noDataText: {
    textAlign: 'center',
    color: '#555',
    fontSize: 18,
    marginTop: 10,
    fontWeight: 'bold',
  },
  subText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    marginTop: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 10,
    marginLeft: 5,
  }
});

export default DoctorDashboardScreen;