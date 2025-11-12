export interface GlucoseReading {
  time: string;
  glucose: number;
  status: 'normal' | 'high' | 'low';
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  schedule: string[];
  taken: { [key: string]: boolean };
  description?: string;
}

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  weight: number;
  height: number;
  diabetesType: 'Type 1' | 'Type 2';
  diagnosisDate: string;
  lastCheckup: string;
  hba1c: number;
}

export interface Alert {
  id: string;
  type: 'danger' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
}

export interface Activity {
  time: string;
  type: 'meal' | 'exercise' | 'sleep' | 'medication';
  description: string;
  impact?: 'positive' | 'negative' | 'neutral';
}
