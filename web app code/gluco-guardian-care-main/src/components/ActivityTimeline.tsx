import { Activity } from '@/types/medical';
import { Card } from '@/components/ui/card';
import { Utensils, Pill, Dumbbell, Moon } from 'lucide-react';

interface ActivityTimelineProps {
  activities: Activity[];
}

const ActivityTimeline = ({ activities }: ActivityTimelineProps) => {
  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'meal':
        return <Utensils className="w-4 h-4" />;
      case 'medication':
        return <Pill className="w-4 h-4" />;
      case 'exercise':
        return <Dumbbell className="w-4 h-4" />;
      case 'sleep':
        return <Moon className="w-4 h-4" />;
    }
  };

  const getColor = (type: Activity['type'], impact?: Activity['impact']) => {
    if (impact === 'positive') return 'bg-success text-success-foreground';
    if (impact === 'negative') return 'bg-danger text-danger-foreground';
    
    switch (type) {
      case 'meal':
        return 'bg-primary text-primary-foreground';
      case 'medication':
        return 'bg-primary text-primary-foreground';
      case 'exercise':
        return 'bg-success text-success-foreground';
      case 'sleep':
        return 'bg-muted text-foreground';
    }
  };

  return (
    <Card className="p-6 bg-gradient-card border-border shadow-md">
      <h3 className="text-lg font-semibold text-foreground mb-4">Today's Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="relative">
              <div className={`w-10 h-10 rounded-full ${getColor(activity.type, activity.impact)} flex items-center justify-center shadow-sm`}>
                {getIcon(activity.type)}
              </div>
              {index < activities.length - 1 && (
                <div className="absolute left-1/2 top-10 w-0.5 h-8 bg-border -translate-x-1/2" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-foreground capitalize">{activity.type}</p>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ActivityTimeline;
