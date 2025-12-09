import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { i18n } from '../i18n';

const PatientAppointmentsScreen = ({ navigation }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
            collection(db, "appointments"),
            where("patientId", "==", user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            apps.sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest first
            setAppointments(apps);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const renderItem = ({ item }) => {
        const isPast = new Date(item.date) < new Date();
        const statusColor = item.status === 'CONFIRMED' ? '#4CAF50' : item.status === 'CANCELLED' ? '#F44336' : '#FF9800';

        return (
            <View style={[styles.card, { opacity: isPast ? 0.7 : 1 }]}>
                <View style={styles.cardHeader}>
                    <View style={styles.dateBox}>
                        <Text style={styles.dateDay}>{new Date(item.date).getDate()}</Text>
                        <Text style={styles.dateMonth}>{new Date(item.date).toLocaleString('default', { month: 'short' })}</Text>
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.doctorName}>Dr. {item.doctorName}</Text>
                        <Text style={styles.type}>{item.type}</Text>
                        <Text style={styles.time}>{new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                        <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#2C3E50" />
                </TouchableOpacity>
                <Text style={styles.title}>{i18n.t('upcoming_appointments')}</Text>
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
                    ListEmptyComponent={<Text style={styles.empty}>No appointments history.</Text>}
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
    cardHeader: { flexDirection: 'row', alignItems: 'center' },
    dateBox: {
        backgroundColor: '#F0F0F0', borderRadius: 10, padding: 8, alignItems: 'center', marginRight: 15, width: 50
    },
    dateDay: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    dateMonth: { fontSize: 12, color: '#666' },
    info: { flex: 1 },
    doctorName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    type: { fontSize: 14, color: '#666' },
    time: { fontSize: 12, color: '#888', marginTop: 2 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5 },
    statusText: { color: '#FFF', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
    empty: { textAlign: 'center', marginTop: 50, color: '#999' }
});

export default PatientAppointmentsScreen;
