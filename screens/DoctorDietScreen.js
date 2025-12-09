import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { i18n } from '../i18n';

const DoctorDietScreen = ({ navigation, route }) => {
    const { patientId, patientName } = route.params;
    const [advice, setAdvice] = useState('');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);

    // Force update for i18n
    const [, setTick] = useState(0);
    useEffect(() => {
        const unsubscribe = i18n.onChange(() => setTick(t => t + 1));
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!patientId) return;
        const q = query(
            collection(db, "diet_plans"),
            where("patientId", "==", patientId),
            // orderBy("createdAt", "desc") // Client-side sort if index missing
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const plans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            plans.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setHistory(plans);
        });

        return unsubscribe;
    }, [patientId]);

    const handleSave = async () => {
        if (!advice.trim()) {
            Alert.alert(i18n.t('error'), "Please enter some advice.");
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, "diet_plans"), {
                patientId,
                patientName,
                doctorId: auth.currentUser?.uid,
                doctorName: auth.currentUser?.displayName || "Dr. " + (auth.currentUser?.email?.split('@')[0] || ""),
                advice: advice.trim(),
                createdAt: new Date().toISOString()
            });
            setAdvice('');
            Alert.alert(i18n.t('success'), "Diet advice sent to patient!");
        } catch (error) {
            console.error("Error saving diet advice:", error);
            Alert.alert(i18n.t('error'), "Failed to save advice.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (isoString) => {
        return new Date(isoString).toLocaleDateString() + ' ' + new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#2C3E50" />
                </TouchableOpacity>
                <Text style={styles.title}>Diet Plan: {patientName}</Text>
                <View style={{ width: 28 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.sectionTitle}>New Advice</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            multiline
                            placeholder="Write diet advice here..."
                            value={advice}
                            onChangeText={setAdvice}
                            textAlignVertical="top"
                        />
                    </View>
                    <TouchableOpacity style={styles.sendButton} onPress={handleSave} disabled={loading}>
                        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.sendButtonText}>Send Advice</Text>}
                    </TouchableOpacity>

                    <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Previous Advice</Text>
                    {history.length === 0 ? (
                        <Text style={styles.emptyText}>No previous advice found.</Text>
                    ) : (
                        history.map(item => (
                            <View key={item.id} style={styles.historyItem}>
                                <Text style={styles.historyDate}>{formatDate(item.createdAt)}</Text>
                                <Text style={styles.historyText}>{item.advice}</Text>
                                <Text style={styles.doctorName}>- {item.doctorName}</Text>
                            </View>
                        ))
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE'
    },
    title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    content: { padding: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#2C3E50', marginBottom: 10 },
    inputContainer: {
        backgroundColor: '#FFF', borderRadius: 12, padding: 5,
        borderWidth: 1, borderColor: '#E0E0E0', minHeight: 150
    },
    input: { flex: 1, padding: 10, fontSize: 16, minHeight: 150 },
    sendButton: {
        backgroundColor: '#00BCD4', borderRadius: 10, padding: 15, alignItems: 'center', marginTop: 15,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3
    },
    sendButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    historyItem: {
        backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 15,
        borderLeftWidth: 4, borderLeftColor: '#00BCD4',
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1
    },
    historyDate: { fontSize: 12, color: '#888', marginBottom: 5 },
    historyText: { fontSize: 16, color: '#333', marginBottom: 10, lineHeight: 22 },
    doctorName: { fontSize: 14, color: '#00BCD4', fontStyle: 'italic', textAlign: 'right' },
    emptyText: { textAlign: 'center', color: '#999', marginTop: 20 }
});

export default DoctorDietScreen;
