import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { i18n } from '../i18n';

const DoctorAppointmentsScreen = ({ navigation }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        // Listen for requests (status: 'REQUESTED') assigned to me
        // OR CONFIRMED ones too if we want to show schedule. 
        // Let's show both but separate visually or sort.
        const q = query(
            collection(db, "appointments"),
            where("doctorId", "==", user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Sort: Pending first, then by date
            apps.sort((a, b) => {
                if (a.status === 'REQUESTED' && b.status !== 'REQUESTED') return -1;
                if (a.status !== 'REQUESTED' && b.status === 'REQUESTED') return 1;
                return new Date(a.date) - new Date(b.date);
            });
            setAppointments(apps);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await updateDoc(doc(db, "appointments", id), {
                status: newStatus
            });
            Alert.alert("Success", `Appointment ${newStatus.toLowerCase()}.`);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to update status.");
        }
    };

    const renderItem = ({ item }) => {
        const isPending = item.status === 'REQUESTED';
        return (
            <View style={[styles.card, isPending ? styles.cardPending : styles.cardConfirmed]}>
                <View style={styles.cardHeader}>
                    <View style={styles.dateBox}>
                        <Text style={styles.dateDay}>{new Date(item.date).getDate()}</Text>
                        <Text style={styles.dateMonth}>{new Date(item.date).toLocaleString('default', { month: 'short' })}</Text>
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.patientName}>{item.patientName}</Text>
                        <Text style={styles.type}>{item.type}</Text>
                        <Text style={styles.time}>{new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    </View>
                    <View style={styles.statusBadge}>
                        <Text style={[styles.statusText, isPending ? { color: '#FF9800' } : { color: '#4CAF50' }]}>
                            {item.status}
                        </Text>
                    </View>
                </View>

                {isPending && (
                    <View style={styles.actions}>
                        <TouchableOpacity style={[styles.btn, styles.btnDecline]} onPress={() => handleUpdateStatus(item.id, 'CANCELLED')}>
                            <Text style={styles.btnText}>Decline</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btn, styles.btnConfirm]} onPress={() => handleUpdateStatus(item.id, 'CONFIRMED')}>
                            <Text style={styles.btnText}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#2C3E50" />
                </TouchableOpacity>
                <Text style={styles.title}>All Appointments</Text>
                <View style={{ width: 28 }} />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#00BCD4" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={appointments}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={styles.empty}>No appointments found.</Text>}
                />
            )}
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
    list: { padding: 20 },
    card: {
        backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 15,
        elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3
    },
    cardPending: { borderLeftWidth: 5, borderLeftColor: '#FF9800' },
    cardConfirmed: { borderLeftWidth: 5, borderLeftColor: '#4CAF50' },
    cardHeader: { flexDirection: 'row', alignItems: 'center' },
    dateBox: {
        backgroundColor: '#F0F0F0', borderRadius: 10, padding: 8, alignItems: 'center', marginRight: 15, width: 50
    },
    dateDay: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    dateMonth: { fontSize: 12, color: '#666' },
    info: { flex: 1 },
    patientName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    type: { fontSize: 14, color: '#666' },
    time: { fontSize: 12, color: '#888', marginTop: 2 },
    statusBadge: {},
    statusText: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
    actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15, borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 10 },
    btn: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 5, marginLeft: 10 },
    btnDecline: { backgroundColor: '#FFEBEE' },
    btnConfirm: { backgroundColor: '#E8F5E9' },
    btnText: { fontWeight: 'bold', fontSize: 14, color: '#333' }, // Default
    empty: { textAlign: 'center', marginTop: 50, color: '#999' }
});

export default DoctorAppointmentsScreen;
