import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
// import * as Updates from 'expo-updates';

const translations = {
    en: {
        login: 'Login',
        email: 'Email',
        password: 'Password',
        enter: 'ENTER',
        register_link: "Don't have an account? Register now",
        register: 'Register',
        full_name: 'Full Name',
        role: 'Role',
        patient: 'Patient',
        doctor: 'Doctor',
        already_account: 'Already have an account? Login',
        welcome: 'Welcome',
        dashboard: 'Dashboard',
        upcoming_appointments: 'Upcoming Appointments',
        recent_records: 'Recent Records',
        add_record: 'Add Record',
        history: 'History',
        profile: 'Profile',
        glucose: 'Glucose',
        blood_pressure: 'Blood Pressure',
        weight: 'Weight',
        date: 'Date',
        save: 'Save',
        logout: 'Logout',
        my_patients: 'My Patients',
        add_patient: 'Add Patient',
        search_email: 'Search by Email',
        assign: 'Assign',
        cancel: 'Cancel',
        success: 'Success',
        error: 'Error',
        settings: 'Settings',
        language: 'Language',
        change_language: 'Change Language',
        highest_glucose: 'Highest Glucose',
        loading: 'Loading...',
        remove_patient: 'Remove Patient',
        confirm_remove_patient: 'Are you sure you want to remove this patient?',
        remove: 'Remove',
        spike_analysis: 'Spike Analysis',
        normal: 'Normal',
        high: 'High',
        low: 'Low'
    },
    fr: {
        login: 'Connexion',
        email: 'Email',
        password: 'Mot de passe',
        enter: 'ENTRER',
        register_link: "Pas encore de compte ? S'inscrire",
        register: 'Inscription',
        full_name: 'Nom complet',
        role: 'Rôle',
        patient: 'Patient',
        doctor: 'Docteur',
        already_account: 'Déjà un compte ? Connexion',
        welcome: 'Bienvenue',
        dashboard: 'Tableau de bord',
        upcoming_appointments: 'Rendez-vous à venir',
        recent_records: 'Dossiers récents',
        add_record: 'Ajouter un dossier',
        history: 'Historique',
        profile: 'Profil',
        glucose: 'Glucose',
        blood_pressure: 'Tension artérielle',
        weight: 'Poids',
        date: 'Date',
        save: 'Enregistrer',
        logout: 'Déconnexion',
        my_patients: 'Mes patients',
        add_patient: 'Ajouter un patient',
        search_email: 'Chercher par email',
        assign: 'Assigner',
        cancel: 'Annuler',
        success: 'Succès',
        error: 'Erreur',
        settings: 'Paramètres',
        language: 'Langue',
        change_language: 'Changer la langue',
        highest_glucose: 'Glucose le plus élevé',
        loading: 'Chargement...',
        remove_patient: 'Supprimer le patient',
        confirm_remove_patient: 'Êtes-vous sûr de vouloir supprimer ce patient ?',
        remove: 'Supprimer',
        spike_analysis: 'Analyse des pics',
        normal: 'Normal',
        high: 'Élevé',
        low: 'Bas'
    },
    ar: {
        login: 'تسجيل الدخول',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        enter: 'دخول',
        register_link: 'ليس لديك حساب؟ سجل الآن',
        register: 'تسجيل',
        full_name: 'الاسم الكامل',
        role: 'الدور',
        patient: 'مريض',
        doctor: 'طبيب',
        already_account: 'لديك حساب بالفعل؟ تسجيل الدخول',
        welcome: 'مرحبًا',
        dashboard: 'لوحة التحكم',
        upcoming_appointments: 'المواعيد القادمة',
        recent_records: 'السجلات الحديثة',
        add_record: 'إضافة سجل',
        history: 'التاريخ',
        profile: 'الملف الشخصي',
        glucose: 'الجلوكوز',
        blood_pressure: 'ضغط الدم',
        weight: 'الوزن',
        date: 'التاريخ',
        save: 'حفظ',
        logout: 'تسجيل الخروج',
        my_patients: 'مرضاي',
        add_patient: 'إضافة مريض',
        search_email: 'بحث بالبريد الإلكتروني',
        assign: 'تعيين',
        cancel: 'إلغاء',
        success: 'نجاح',
        error: 'خطأ',
        settings: 'الإعدادات',
        language: 'اللغة',
        change_language: 'تغيير اللغة',
        highest_glucose: 'أعلى نسبة جلوكوز',
        loading: 'جار التحميل...',
        remove_patient: 'إزالة المريض',
        confirm_remove_patient: 'هل أنت متأكد من رغبتك في إزالة هذا المريض؟',
        remove: 'إزالة',
        spike_analysis: 'تحليل الارتفاعات',
        normal: 'طبيعي',
        high: 'مرتفع',
        low: 'منخفض'
    }
};

class I18n {
    constructor() {
        this.locale = 'en';
        this.listeners = [];
    }

    async init() {
        try {
            const savedLocale = await AsyncStorage.getItem('user-language');
            if (savedLocale) {
                this.locale = savedLocale;
            }
        } catch (e) {
            console.log('Failed to load locale', e);
        }
    }

    t(key) {
        if (!translations[this.locale][key]) {
            console.warn(`Missing translation for key: ${key}`);
            return key;
        }
        return translations[this.locale][key];
    }

    getLocale() {
        return this.locale;
    }

    async setLocale(locale) {
        this.locale = locale;
        await AsyncStorage.setItem('user-language', locale);

        // Notify listeners
        this.listeners.forEach(listener => listener(locale));

        // Handle RTL for Arabic
        const isRTL = locale === 'ar';
        if (I18nManager.isRTL !== isRTL) {
            I18nManager.allowRTL(isRTL);
            I18nManager.forceRTL(isRTL);
            // We might need to restart the app for RTL changes to strictly take effect in some UI components
            // Updates.reloadAsync(); // Optional: force reload
        }
    }

    onChange(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }
}

export const i18n = new I18n();
