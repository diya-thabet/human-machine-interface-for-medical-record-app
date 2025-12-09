// screens/DoctorProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { i18n } from '../i18n';

const DoctorProfileScreen = ({ navigation }) => {
  const [doctorName, setDoctorName] = useState('');
  const [doctorSpecialty, setDoctorSpecialty] = useState('');
  const [doctorEmail, setDoctorEmail] = useState('');
  const [doctorPhone, setDoctorPhone] = useState('');
  const [doctorClinic, setDoctorClinic] = useState('');
  const [doctorLicense, setDoctorLicense] = useState('');
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);

  // Force update
  const [, setTick] = useState(0);
  useEffect(() => {
    const unsubscribe = i18n.onChange(() => setTick(t => t + 1));
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigation.replace('Login');
          return;
        }

        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setDoctorName(userData.fullName || '');
          setDoctorSpecialty(userData.specialty || '');
          setDoctorEmail(userData.email || '');
          setDoctorPhone(userData.phone || '');
          setDoctorClinic(userData.clinic || '');
          setDoctorLicense(userData.license || '');
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert(i18n.t('error'), "Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await updateDoc(doc(db, "users", user.uid), {
        fullName: doctorName,
        specialty: doctorSpecialty,
        phone: doctorPhone,
        clinic: doctorClinic,
        license: doctorLicense
      });

      Alert.alert(i18n.t('success'), "Your profile has been updated!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert(i18n.t('error'), "Failed to update profile.");
    }
  };

  const handleLogout = () => {
    Alert.alert(
      i18n.t('logout'),
      i18n.t('confirm_logout'),
      [
        {
          text: i18n.t('cancel'),
          style: "cancel"
        },
        {
          text: i18n.t('logout'),
          onPress: () => {
            console.log("Doctor logged out");
            navigation.replace('Login');
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.title}>{i18n.t('profile')}</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.editButton}>
          <Ionicons name={isEditing ? "checkmark-circle-outline" : "create-outline"} size={28} color="#00BCD4" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#00BCD4" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.profileCard}>
            <Ionicons name="medkit-outline" size={100} color="#00BCD4" style={styles.profileIcon} />
            {isEditing ? (
              <TextInput
                style={styles.editableNameInput}
                value={doctorName}
                onChangeText={setDoctorName}
                placeholder="Full Name"
              />
            ) : (
              <Text style={styles.profileName}>{doctorName}</Text>
            )}
            <Text style={styles.profileRole}>{doctorSpecialty}</Text>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={24} color="#00BCD4" style={styles.infoIcon} />
              <View>
                <Text style={styles.infoLabel}>{i18n.t('email')}</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.editableInput}
                    value={doctorEmail}
                    onChangeText={setDoctorEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                ) : (
                  <Text style={styles.infoText}>{doctorEmail}</Text>
                )}
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="call-outline" size={24} color="#00BCD4" style={styles.infoIcon} />
              <View>
                <Text style={styles.infoLabel}>{i18n.t('phone_number')}</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.editableInput}
                    value={doctorPhone}
                    onChangeText={setDoctorPhone}
                    keyboardType="phone-pad"
                  />
                ) : (
                  <Text style={styles.infoText}>{doctorPhone}</Text>
                )}
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="business-outline" size={24} color="#00BCD4" style={styles.infoIcon} />
              <View>
                <Text style={styles.infoLabel}>{i18n.t('clinic')}</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.editableInput}
                    value={doctorClinic}
                    onChangeText={setDoctorClinic}
                  />
                ) : (
                  <Text style={styles.infoText}>{doctorClinic}</Text>
                )}
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="id-card-outline" size={24} color="#00BCD4" style={styles.infoIcon} />
              <View>
                <Text style={styles.infoLabel}>{i18n.t('license')}</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.editableInput}
                    value={doctorLicense}
                    onChangeText={setDoctorLicense}
                    autoCapitalize="characters"
                  />
                ) : (
                  <Text style={styles.infoText}>{doctorLicense}</Text>
                )}
              </View>
            </View>
          </View>

          {isEditing && (
            <TouchableOpacity style={styles.actionButton} onPress={handleSaveProfile}>
              <Text style={styles.actionButtonText}>{i18n.t('save')}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.actionButtonText}>{i18n.t('change_language')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
            <Text style={styles.actionButtonText}>{i18n.t('logout')}</Text>
          </TouchableOpacity>

        </ScrollView>
      )}
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
  },
  editButton: {
    padding: 5,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  profileCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  profileIcon: {
    marginBottom: 10,
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  editableNameInput: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderColor: '#00BCD4',
    textAlign: 'center',
    paddingVertical: 2,
    width: '80%',
  },
  profileRole: {
    fontSize: 18,
    color: '#888',
  },
  infoSection: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    padding: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  // Ensure the last item has no border
  'infoItem:last-child': {
    borderBottomWidth: 0,
  },
  infoIcon: {
    marginRight: 15,
    width: 24, // Fixed width for consistent alignment
  },
  infoLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  editableInput: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
    borderBottomWidth: 1,
    borderColor: '#00BCD4',
    paddingVertical: 0,
    minWidth: '70%',
  },
  actionButton: {
    width: '100%',
    backgroundColor: '#00BCD4',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#E74C3C', // A distinct color for logout
  },
});

export default DoctorProfileScreen;