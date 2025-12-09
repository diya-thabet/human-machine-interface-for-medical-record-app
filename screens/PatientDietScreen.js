import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { i18n } from '../i18n';

const PatientDietScreen = ({ navigation }) => {
    const [adviceList, setAdviceList] = useState([]);
    const [loading, setLoading] = useState(true);

    // Force update
    const [, setTick] = useState(0);
    useEffect(() => {
        const unsubscribe = i18n.onChange(() => setTick(t => t + 1));
        return unsubscribe;
    }, []);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
            collection(db, "diet_plans"),
            where("patientId", "==", user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const plans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Client side sort
            plans.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setAdviceList(plans);
            setLoading(false);
        }, (err) => {
            console.error(err);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const formatDate = (isoString) => {
        return new Date(isoString).toLocaleDateString() + ' ' + new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#2C3E50" />
                </TouchableOpacity>
                <Text style={styles.title}>Diet Advice</Text>
                <View style={{ width: 28 }} />
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#00BCD4" />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.banner}>
                        <Ionicons name="nutrition" size={50} color="#FFF" />
                        <Text style={styles.bannerText}>Stay healthy with your doctor's advice!</Text>
                    </View>

                    {adviceList.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="leaf-outline" size={60} color="#CCC" />
                            <Text style={styles.emptyText}>No diet advice received yet.</Text>
                        </View>
                    ) : (
                        adviceList.map(item => (
                            <View key={item.id} style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <Ionicons name="medical" size={20} color="#00BCD4" />
                                    <Text style={styles.doctorName}>{item.doctorName}</Text>
                                    <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
                                </View>
                                <Text style={styles.adviceText}>{item.advice}</Text>
                            </View>
                        ))
                    )}
                </ScrollView>
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
    content: { padding: 20 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    banner: {
        backgroundColor: '#00BCD4', borderRadius: 15, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 20,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5
    },
    bannerText: { fontSize: 18, color: '#FFF', fontWeight: 'bold', marginLeft: 15, flex: 1 },
    emptyContainer: { alignItems: 'center', marginTop: 50 },
    emptyText: { marginTop: 10, fontSize: 16, color: '#888' },
    card: {
        backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 15,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    doctorName: { fontSize: 16, fontWeight: 'bold', color: '#333', marginLeft: 10, flex: 1 },
    date: { fontSize: 12, color: '#999' },
    adviceText: { fontSize: 16, color: '#555', lineHeight: 24 }
});

export default PatientDietScreen;
