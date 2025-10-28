// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import PatientDashboardScreen from './screens/PatientDashboardScreen';
import PatientRecordsHistoryScreen from './screens/PatientRecordsHistoryScreen';
import AddRecordScreen from './screens/AddRecordScreen'; // <-- IMPORT THIS

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
          <Stack.Screen // <-- ADD THIS BLOCK
            name="AddRecord"
            component={AddRecordScreen}
            options={{ headerShown: false }}
          />
          {/* Add DoctorDashboard and other doctor screens here later */}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}