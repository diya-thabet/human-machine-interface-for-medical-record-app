import { useState } from 'react';
import { Medication } from '@/types/medical';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pill, Clock, Check, Bell } from 'lucide-react';
import { toast } from 'sonner';

interface MedicationCardProps {
  medication: Medication;
  onMarkTaken: (id: string, time: string) => void;
}

const MedicationCard = ({ medication, onMarkTaken }: MedicationCardProps) => {
  const [taken, setTaken] = useState(medication.taken);

  const handleMarkTaken = (time: string) => {
    setTaken(prev => ({ ...prev, [time]: true }));
    onMarkTaken(medication.id, time);
    toast.success(`${medication.name} marked as taken for ${time}`, {
      description: medication.dosage,
    });
  };

  const getCurrentTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  const isTimeNear = (scheduledTime: string) => {
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    const now = new Date();
    const scheduled = new Date();
    scheduled.setHours(hours, minutes, 0);
    
    const diff = Math.abs(scheduled.getTime() - now.getTime()) / (1000 * 60);
    return diff <= 30;
  };

  return (
    <Card className="p-4 border-border hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Pill className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{medication.name}</h4>
            <p className="text-sm text-muted-foreground">{medication.dosage}</p>
            {medication.description && (
              <p className="text-xs text-muted-foreground mt-1">{medication.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {medication.schedule.map((time) => {
          const isTaken = taken[time];
          const isNearTime = isTimeNear(time);
          
          return (
            <div
              key={time}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                isTaken 
                  ? 'bg-success-light/20 border-success/30' 
                  : isNearTime 
                  ? 'bg-warning-light/20 border-warning animate-pulse' 
                  : 'bg-muted border-border'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className={`w-4 h-4 ${isTaken ? 'text-success' : isNearTime ? 'text-warning' : 'text-muted-foreground'}`} />
                <span className={`text-sm font-medium ${isTaken ? 'text-success' : 'text-foreground'}`}>
                  {time}
                </span>
                {isNearTime && !isTaken && (
                  <Badge variant="outline" className="bg-warning text-warning-foreground border-warning">
                    <Bell className="w-3 h-3 mr-1" />
                    Due soon
                  </Badge>
                )}
              </div>
              
              {isTaken ? (
                <Badge variant="outline" className="bg-success text-success-foreground border-success">
                  <Check className="w-3 h-3 mr-1" />
                  Taken
                </Badge>
              ) : (
                <Button
                  size="sm"
                  onClick={() => handleMarkTaken(time)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Mark as taken
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default MedicationCard;
