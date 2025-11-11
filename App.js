// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import all your screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

// Patient Screens
import PatientDashboardScreen from './screens/PatientDashboardScreen';
import PatientRecordsHistoryScreen from './screens/PatientRecordsHistoryScreen';
import AddRecordScreen from './screens/AddRecordScreen';
import PatientProfileScreen from './screens/PatientProfileScreen'; // NEW: Patient Profile Screen

// Doctor Screens (assuming these exist or will be created)
import DoctorDashboardScreen from './screens/DoctorDashboardScreen'; // NEW: Doctor Dashboard Screen
import ViewPatientProfileScreen from './screens/ViewPatientProfileScreen'; // Assuming this exists or will be created for doctors to view *other* patients
import ViewPatientAddRecordScreen from './screens/ViewPatientAddRecordScreen'; // NEW: Doctors view *their own* patients' records
import DoctorProfileScreen from './screens/DoctorProfileScreen'; // NEW: Doctor Profile Screen

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
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

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}