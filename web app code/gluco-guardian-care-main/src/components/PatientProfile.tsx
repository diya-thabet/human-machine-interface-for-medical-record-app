import { PatientProfile as PatientProfileType } from '@/types/medical';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Calendar, Activity, TrendingUp, Upload, FileText } from 'lucide-react';

interface PatientProfileProps {
  profile: PatientProfileType;
}

const PatientProfile = ({ profile }: PatientProfileProps) => {
  const bmi = (profile.weight / ((profile.height / 100) ** 2)).toFixed(1);

  const handleUploadReport = () => {
    // Placeholder for file upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.csv';
    input.onchange = () => {
      console.log('File upload triggered');
    };
    input.click();
  };

  return (
    <Card className="p-6 bg-gradient-card border-border shadow-md">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{profile.name}</h2>
            <Badge variant="outline" className="mt-1 bg-primary/10 text-primary border-primary">
              ID: {profile.id}
            </Badge>
          </div>
        </div>
        <Button
          onClick={handleUploadReport}
          variant="outline"
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Report
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-muted">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground">Age</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{profile.age}</p>
          <p className="text-xs text-muted-foreground">years</p>
        </div>

        <div className="p-4 rounded-lg bg-muted">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground">Weight</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{profile.weight}</p>
          <p className="text-xs text-muted-foreground">kg</p>
        </div>

        <div className="p-4 rounded-lg bg-muted">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground">Height</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{profile.height}</p>
          <p className="text-xs text-muted-foreground">cm</p>
        </div>

        <div className="p-4 rounded-lg bg-muted">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground">BMI</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{bmi}</p>
          <p className="text-xs text-muted-foreground">kg/m²</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border border-border bg-background/50">
          <h4 className="font-semibold text-foreground mb-2">Medical Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Diabetes Type:</span>
              <Badge className="bg-primary text-primary-foreground">{profile.diabetesType}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Diagnosed:</span>
              <span className="text-foreground">{new Date(profile.diagnosisDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Checkup:</span>
              <span className="text-foreground">{new Date(profile.lastCheckup).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">HbA1c Level:</span>
              <span className={`font-semibold ${profile.hba1c > 7 ? 'text-warning' : 'text-success'}`}>
                {profile.hba1c}%
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-border bg-background/50">
          <h4 className="font-semibold text-foreground mb-2">Recent Reports</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer transition-colors">
              <FileText className="w-4 h-4 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Blood Test Results</p>
                <p className="text-xs text-muted-foreground">Oct 1, 2025</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer transition-colors">
              <FileText className="w-4 h-4 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Quarterly Checkup</p>
                <p className="text-xs text-muted-foreground">Jul 15, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PatientProfile;
