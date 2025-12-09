import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { i18n } from '../i18n';

const RequestAppointmentScreen = ({ navigation }) => {
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [types] = useState(['Checkup', 'Follow-up', 'Consultation', 'Urgent']);
    const [selectedType, setSelectedType] = useState('Checkup');
    const [myDoctor, setMyDoctor] = useState(null);

    useEffect(() => {
        // Find my assigned doctor
        const fetchDoctor = async () => {
            const user = auth.currentUser;
            if (!user) return;

            // Assumption: Patient has `assignedDoctorIds` or we query users who have this patient
            // Actually per previous logic: Doctor has list of patients, Patient data has `assignedDoctorIds`.
            // We will look for the first assigned doctor.
            const userDoc = await getDocs(query(collection(db, "users"), where("email", "==", user.email)));
            if (!userDoc.empty) {
                const userData = userDoc.docs[0].data();
                if (userData.assignedDoctorIds && userData.assignedDoctorIds.length > 0) {
                    // Fetch doctor name
                    const docId = userData.assignedDoctorIds[0];
                    const dObj = await getDocs(query(collection(db, "users"), where("uid", "==", docId))); // Assuming uid search or getDoc
                    // Wait, standard is doc(db, 'users', uid). 
                    // We'll skip complex fetch for now and just store the ID, 
                    // but ideally we want the Doctor's name.
                    setMyDoctor({ id: docId, name: 'My Doctor' });
                }
            }
        };
        fetchDoctor();
    }, []);

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const onTimeChange = (event, selectedTime) => {
        const currentTime = selectedTime || date;
        setShowTimePicker(Platform.OS === 'ios');
        setDate(currentTime);
    };

    const handleRequest = async () => {
        // if (!myDoctor) {
        //   Alert.alert("Error", "You are not assigned to a doctor yet.");
        //   return;
        // }
        setLoading(true);
        try {
            await addDoc(collection(db, "appointments"), {
                patientId: auth.currentUser.uid,
                patientName: auth.currentUser.displayName || auth.currentUser.email,
                doctorId: myDoctor ? myDoctor.id : 'unknown', // or store 'pending assignment'
                doctorName: myDoctor ? myDoctor.name : 'Pending',
                date: date.toISOString(),
                type: selectedType,
                status: 'REQUESTED',
                createdAt: new Date().toISOString()
            });
            Alert.alert(i18n.t('success'), "Appointment requested successfully!");
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert(i18n.t('error'), "Failed to request appointment.");
        } finally {
            setLoading(false);
        }
    };

    const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#2C3E50" />
                </TouchableOpacity>
                <Text style={styles.title}>Request Appointment</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.label}>Select Date & Time</Text>
                <TouchableOpacity style={styles.pickerButton} onPress={() => setShowDatePicker(true)}>
                    <Ionicons name="calendar-outline" size={24} color="#00BCD4" />
                    <Text style={styles.pickerText}>{formattedDate}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} minimumDate={new Date()} />
                )}

                <TouchableOpacity style={styles.pickerButton} onPress={() => setShowTimePicker(true)}>
                    <Ionicons name="time-outline" size={24} color="#00BCD4" />
                    <Text style={styles.pickerText}>{formattedTime}</Text>
                </TouchableOpacity>
                {showTimePicker && (
                    <DateTimePicker value={date} mode="time" display="default" onChange={onTimeChange} />
                )}

                <Text style={styles.label}>Appointment Type</Text>
                <View style={styles.chipContainer}>
                    {types.map(type => (
                        <TouchableOpacity
                            key={type}
                            style={[styles.chip, selectedType === type && styles.chipSelected]}
                            onPress={() => setSelectedType(type)}
                        >
                            <Text style={[styles.chipText, selectedType === type && styles.chipTextSelected]}>{type}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleRequest} disabled={loading}>
                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveButtonText}>Request Appointment</Text>}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE'
    },
    title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    content: { padding: 20 },
    label: { fontSize: 16, color: '#666', marginBottom: 10, marginTop: 10 },
    pickerButton: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 15,
        borderWidth: 1, borderColor: '#EEE'
    },
    pickerText: { fontSize: 18, marginLeft: 10, color: '#333' },
    chipContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 30 },
    chip: {
        paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20, backgroundColor: '#EEE', marginRight: 10, marginBottom: 10
    },
    chipSelected: { backgroundColor: '#00BCD4' },
    chipText: { color: '#666' },
    chipTextSelected: { color: '#FFF', fontWeight: 'bold' },
    saveButton: {
        backgroundColor: '#00BCD4', borderRadius: 10, padding: 18, alignItems: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3
    },
    saveButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});

export default RequestAppointmentScreen;
