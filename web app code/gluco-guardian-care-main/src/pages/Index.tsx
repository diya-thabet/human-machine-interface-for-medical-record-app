import { useState } from 'react';
import GlucoseChart from '@/components/GlucoseChart';
import MedicationCard from '@/components/MedicationCard';
import PatientProfile from '@/components/PatientProfile';
import AlertsPanel from '@/components/AlertsPanel';
import ActivityTimeline from '@/components/ActivityTimeline';
import StatsCard from '@/components/StatsCard';
import { glucoseData, medications, patientProfile, alerts, activities } from '@/data/sampleData';
import { Activity, TrendingDown, TrendingUp, Heart } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [meds, setMeds] = useState(medications);

  const handleMarkTaken = (id: string, time: string) => {
    setMeds(prevMeds =>
      prevMeds.map(med =>
        med.id === id
          ? { ...med, taken: { ...med.taken, [time]: true } }
          : med
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">GlucoTrack</h1>
                <p className="text-sm text-primary-foreground/80">Diabetes Management Platform</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-primary-foreground/80">Welcome back,</p>
              <p className="text-lg font-semibold">{patientProfile.name}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Average Glucose"
            value="115"
            subtitle="mg/dL today"
            icon={Activity}
            trend="down"
            trendValue="↓ 5% from yesterday"
          />
          <StatsCard
            title="Time in Range"
            value="82%"
            subtitle="Target: 70-140 mg/dL"
            icon={TrendingUp}
            trend="up"
            trendValue="↑ 3% improvement"
          />
          <StatsCard
            title="Medications"
            value={`${Object.values(meds.flatMap(m => Object.values(m.taken))).filter(Boolean).length}/${meds.flatMap(m => m.schedule).length}`}
            subtitle="Taken today"
            icon={Heart}
            trend="neutral"
          />
          <StatsCard
            title="Last Reading"
            value="98"
            subtitle="mg/dL (Normal)"
            icon={TrendingDown}
            trend="neutral"
            trendValue="15 minutes ago"
          />
        </div>

        {/* Alerts */}
        <div className="mb-8">
          <AlertsPanel alerts={alerts} />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Chart and Medications */}
          <div className="lg:col-span-2 space-y-8">
            <GlucoseChart data={glucoseData} />
            
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Medication Schedule</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {meds.map((medication) => (
                  <MedicationCard
                    key={medication.id}
                    medication={medication}
                    onMarkTaken={handleMarkTaken}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Timeline */}
          <div className="space-y-8">
            <ActivityTimeline activities={activities} />
          </div>
        </div>

        {/* Patient Profile */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Patient Profile</h2>
          <PatientProfile profile={patientProfile} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 GlucoTrack - Diabetes Management Platform</p>
            <p className="mt-1">For informational purposes only. Always consult your healthcare provider.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
