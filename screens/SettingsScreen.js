import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { i18n } from '../i18n';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = ({ navigation }) => {
    const [currentLocale, setCurrentLocale] = useState(i18n.getLocale());

    useEffect(() => {
        // Listen for changes
        const unsubscribe = i18n.onChange((newLocale) => {
            setCurrentLocale(newLocale);
        });
        return unsubscribe;
    }, []);

    const changeLanguage = async (lang) => {
        await i18n.setLocale(lang);
        Alert.alert(i18n.t('success'), i18n.t('change_language') + ': ' + lang.toUpperCase());
        // Force re-render of this screen immediately if needed, but state change should handle it
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>{i18n.t('settings')}</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.sectionTitle}>{i18n.t('language')}</Text>

                <TouchableOpacity
                    style={[styles.langButton, currentLocale === 'en' && styles.activeLang]}
                    onPress={() => changeLanguage('en')}>
                    <Text style={[styles.langText, currentLocale === 'en' && styles.activeLangText]}>English</Text>
                    {currentLocale === 'en' && <Ionicons name="checkmark" size={20} color="#FFF" />}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.langButton, currentLocale === 'fr' && styles.activeLang]}
                    onPress={() => changeLanguage('fr')}>
                    <Text style={[styles.langText, currentLocale === 'fr' && styles.activeLangText]}>Français</Text>
                    {currentLocale === 'fr' && <Ionicons name="checkmark" size={20} color="#FFF" />}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.langButton, currentLocale === 'ar' && styles.activeLang]}
                    onPress={() => changeLanguage('ar')}>
                    <Text style={[styles.langText, currentLocale === 'ar' && styles.activeLangText]}>العربية</Text>
                    {currentLocale === 'ar' && <Ionicons name="checkmark" size={20} color="#FFF" />}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFF',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    backButton: {
        marginRight: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 20,
        color: '#555',
        textAlign: 'left'
    },
    langButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    activeLang: {
        backgroundColor: '#00BCD4',
        borderColor: '#00BCD4',
    },
    langText: {
        fontSize: 16,
        color: '#333',
    },
    activeLangText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
});

export default SettingsScreen;
