// screens/AddRecordScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddRecordScreen = ({ navigation, route }) => {
  const { patientId, patientName } = route.params || { patientId: 'unknown', patientName: 'Unknown Patient' };

  const [glucoseLevel, setGlucoseLevel] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

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

  const handleSaveRecord = () => {
    console.log('Saving record for:', patientName, {
      patientId,
      glucoseLevel,
      bloodPressure,
      weight,
      date: date.toISOString(),
    });
    navigation.goBack();
  };

  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#2C3E50" />
          </TouchableOpacity>
          <Text style={styles.title}>Add New Record for {patientName}</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <TextInput
            style={styles.input}
            placeholder="Glucose Level (e.g., 120.5)"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={glucoseLevel}
            onChangeText={setGlucoseLevel}
          />

          <TextInput
            style={styles.input}
            placeholder="Blood Pressure (e.g., 120/80)"
            placeholderTextColor="#888"
            keyboardType="default"
            autoCapitalize="none"
            value={bloodPressure}
            onChangeText={setBloodPressure}
          />

          <TextInput
            style={styles.input}
            placeholder="Weight (kg)"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />

          <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar-outline" size={24} color="#00BCD4" />
            <Text style={styles.datePickerButtonText}>Date: {formattedDate}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              testID="datePicker"
              value={date}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onDateChange}
            />
          )}

          <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowTimePicker(true)}>
            <Ionicons name="time-outline" size={24} color="#00BCD4" />
            <Text style={styles.datePickerButtonText}>Time: {formattedTime}</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              testID="timePicker"
              value={date}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={onTimeChange}
            />
          )}

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveRecord}>
            <Text style={styles.saveButtonText}>SAVE RECORD</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    // ADJUSTED PADDING FOR HEADER
    paddingTop: Platform.OS === 'ios' ? 10 : 20, // More top padding for Android
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
    textAlign: 'center',
    // Removed fixed negative margin-left, let flexbox handle it
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 55,
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 1,
    fontSize: 18,
    color: '#333',
    paddingHorizontal: 10,
    marginBottom: 25,
    borderRadius: 5,
    backgroundColor: '#FFF',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 55,
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  datePickerButtonText: {
    fontSize: 18,
    color: '#333',
    marginLeft: 10,
  },
  saveButton: {
    width: '100%',
    height: 60,
    backgroundColor: '#00BCD4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default AddRecordScreen;