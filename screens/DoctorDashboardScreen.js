
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, TextInput, ActivityIndicator, Platform, KeyboardAvoidingView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot, getDocs, updateDoc, arrayUnion, arrayRemove, doc } from 'firebase/firestore'; // Added arrayRemove
import { i18n } from '../i18n';

const { width } = Dimensions.get('window');

const DoctorDashboardScreen = ({ navigation }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorName, setDoctorName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchText, setSearchText] = useState(''); // Added missing state
  const [assigning, setAssigning] = useState(false);

  // Force update
  const [, setTick] = useState(0);
  useEffect(() => {
    const unsubscribe = i18n.onChange(() => setTick(t => t + 1));
    return unsubscribe;
  }, []);

  const filteredPatients = patients.filter(p =>
    (p.fullName && p.fullName.toLowerCase().includes(searchText.toLowerCase())) ||
    (p.email && p.email.toLowerCase().includes(searchText.toLowerCase()))
  );

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
      const userRef = doc(db, "users", patientId);

      // Strict Single Doctor Rule: Check if already assigned to *any* doctor
      if (patientData.assignedDoctorIds && patientData.assignedDoctorIds.length > 0) {
        Alert.alert(i18n.t('error'), "This patient is already assigned to a doctor. They must be removed from their current doctor first.");
        setAssigning(false);
        return;
      }

      await updateDoc(userRef, {
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

  const handleSignOut = async () => {
    Alert.alert(
      i18n.t('logout'),
      i18n.t('confirm_logout'),
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        {
          text: i18n.t('logout'),
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              navigation.replace('Login');
            } catch (error) {
              console.error("Error signing out:", error);
              Alert.alert(i18n.t('error'), i18n.t('logout_failed'));
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderPatientItem = ({ item }) => (
    <View style={styles.patientCard}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.fullName ? item.fullName.charAt(0).toUpperCase() : '?'}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.patientName}>{item.fullName || item.email}</Text>
          <Text style={styles.patientDetail}>{item.email}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleViewPatientRecords(item.id, item.fullName)}>
          <Ionicons name="document-text-outline" size={20} color="#00BCD4" />
          <Text style={styles.actionLabel}>{i18n.t('view_records')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Chat', { recipientId: item.id, recipientName: item.fullName })}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color="#FF9800" />
          <Text style={styles.actionLabel}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleAssignDiet(item)}>
          <Ionicons name="nutrition-outline" size={20} color="#4CAF50" />
          <Text style={styles.actionLabel}>{i18n.t('assign_diet')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleRemovePatient(item.id, item.fullName)}>
          <Ionicons name="person-remove-outline" size={20} color="#FF6347" />
          <Text style={styles.actionLabel}>{i18n.t('remove')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{i18n.t('welcome')}, Dr. {doctorName}</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('DoctorProfile')} style={styles.iconButton}>
            <Ionicons name="person-circle-outline" size={30} color="#00BCD4" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignOut} style={styles.iconButton}>
            <Ionicons name="log-out-outline" size={26} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar - Fixed at top */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search patients..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />
      </View>

      {/* Divider / Section Title */}
      <Text style={styles.sectionTitle}>{i18n.t('my_patients')}</Text>

      {/* Main Content */}
      {loading ? (
        <ActivityIndicator size="large" color="#00BCD4" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredPatients}
          renderItem={renderPatientItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={50} color="#DDD" />
              <Text style={styles.noDataText}>
                {searchText ? "No patients match your search." : i18n.t('no_patients') || "No patients assigned yet."}
              </Text>
              {!searchText && <Text style={styles.subText}>{i18n.t('tap_plus_assign') || "Tap the + button to assign a patient by email."}</Text>}
            </View>
          }
        />
      )}

      {/* Floating Action Buttons */}
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

      {/* Bottom Tab Navigation */}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
    elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, height: 45, fontSize: 16 },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { marginLeft: 15 },
  patientList: {
    width: '100%',
  },
  patientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 4, // for shadow visibility
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: 'hidden'
  },
  cardHeader: {
    flexDirection: 'row', // Enforce LTR structure
    padding: 15,
    alignItems: 'center',
    direction: 'ltr',
  },
  avatar: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#E0F7FA',
    justifyContent: 'center', alignItems: 'center', marginRight: 15
  },
  avatarText: { fontSize: 20, fontWeight: 'bold', color: '#00BCD4' },
  headerText: { flex: 1 },
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
  },
  patientDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2
  },
  divider: { height: 1, backgroundColor: '#EEE', width: '100%' },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#F9FAFB'
  },
  actionBtn: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 8, // Reduced padding
    justifyContent: 'center',
    flex: 1, // Distribute space evenly
  },
  actionLabel: {
    marginLeft: 4,
    fontSize: 13, // Slightly smaller font
    color: '#555',
    fontWeight: '500',
    flexShrink: 1, // Allow text to shrink/wrap if needed
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  fabContainer: {
    position: 'absolute',
    right: 25,
    bottom: Platform.OS === 'ios' ? 140 : 160, // Lifted up to avoid bottom menu interference
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