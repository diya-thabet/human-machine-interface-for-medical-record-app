
// App.js
import React, { useEffect, useState } from 'react'; // Added useState, useEffect
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth'; // Import auth listener
import { auth, db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { ActivityIndicator, View } from 'react-native'; // Import loading UI
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { i18n } from './i18n'; // Import i18n

// Import all your screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

// Patient Screens
import PatientDashboardScreen from './screens/PatientDashboardScreen';
import PatientRecordsHistoryScreen from './screens/PatientRecordsHistoryScreen';
import AddRecordScreen from './screens/AddRecordScreen';
import PatientProfileScreen from './screens/PatientProfileScreen'; // NEW: Patient Profile Screen
import SettingsScreen from './screens/SettingsScreen'; // NEW: Settings Screen

// Doctor Screens (assuming these exist or will be created)
import DoctorDashboardScreen from './screens/DoctorDashboardScreen'; // NEW: Doctor Dashboard Screen
import ViewPatientProfileScreen from './screens/ViewPatientProfileScreen'; // Assuming this exists or will be created for doctors to view *other* patients
import ViewPatientAddRecordScreen from './screens/ViewPatientAddRecordScreen'; // NEW: Doctors view *their own* patients' records
import DoctorProfileScreen from './screens/DoctorProfileScreen'; // NEW: Doctor Profile Screen
import DoctorDietScreen from './screens/DoctorDietScreen';
import PatientDietScreen from './screens/PatientDietScreen';
import RequestAppointmentScreen from './screens/RequestAppointmentScreen';
import DoctorAppointmentScreen from './screens/DoctorAppointmentScreen';
import ChatScreen from './screens/ChatScreen';
import DoctorAppointmentsScreen from './screens/DoctorAppointmentsScreen';
import PatientAppointmentsScreen from './screens/PatientAppointmentsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isI18nInitialized, setIsI18nInitialized] = React.useState(false);
  const [initialRoute, setInitialRoute] = useState('Login');
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const loadLanguage = async () => {
      await i18n.init();
      setIsI18nInitialized(true);
    };
    loadLanguage();
  }, []);

  React.useEffect(() => {
    if (!isI18nInitialized) return; // Wait for i18n to initialize

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const role = userDoc.data().role;
            setInitialRoute(role === 'DOCTOR' ? 'DoctorDashboard' : 'PatientDashboard');
          } else {
            setInitialRoute('PatientDashboard'); // Default
          }
        } catch (e) {
          console.error("Error fetching user role:", e);
          setInitialRoute('Login');
        }
      } else {
        setInitialRoute('Login');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [isI18nInitialized]); // Re-run when i18n is initialized

  if (loading || !isI18nInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00BCD4" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />

          {/* Patient Flow Screens */}
          <Stack.Screen
            name="PatientDashboard"
            component={PatientDashboardScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PatientRecordsHistory"
            component={PatientRecordsHistoryScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddRecord"
            component={AddRecordScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen // NEW: PatientProfileScreen route
            name="PatientProfile"
            component={PatientProfileScreen}
            options={{ headerShown: false }}
          />

          {/* Doctor Flow Screens */}
          <Stack.Screen // NEW: DoctorDashboardScreen route
            name="DoctorDashboard"
            component={DoctorDashboardScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen // Assuming this is for doctors viewing *other* patient profiles
            name="ViewPatientProfile"
            component={ViewPatientProfileScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen // NEW: ViewPatientAddRecordScreen route
            name="ViewPatientAddRecord"
            component={ViewPatientAddRecordScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen // NEW: DoctorProfileScreen route
            name="DoctorProfile"
            component={DoctorProfileScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen // NEW
            name="DoctorDiet"
            component={DoctorDietScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen // NEW
            name="PatientDiet"
            component={PatientDietScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen // NEW
            name="RequestAppointment"
            component={RequestAppointmentScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen // NEW
            name="DoctorAppointment"
            component={DoctorAppointmentScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen // NEW
            name="Chat"
            component={ChatScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen // NEW
            name="DoctorAppointments"
            component={DoctorAppointmentsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen // NEW
            name="PatientAppointments"
            component={PatientAppointmentsScreen}
            options={{ headerShown: false }}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}