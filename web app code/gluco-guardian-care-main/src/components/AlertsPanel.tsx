import { Alert } from '@/types/medical';
import { Card } from '@/components/ui/card';
import { AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface AlertsPanelProps {
  alerts: Alert[];
}

const AlertsPanel = ({ alerts: initialAlerts }: AlertsPanelProps) => {
  const [alerts, setAlerts] = useState(initialAlerts);

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const getIcon = (type: Alert['type']) => {
    switch (type) {
      case 'danger':
        return <AlertTriangle className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = (type: Alert['type']) => {
    switch (type) {
      case 'danger':
        return 'bg-danger-light/30 border-danger text-danger-foreground';
      case 'warning':
        return 'bg-warning-light/30 border-warning text-warning-foreground';
      case 'info':
        return 'bg-primary-light/20 border-primary text-primary-foreground';
    }
  };

  if (alerts.length === 0) {
    return (
      <Card className="p-6 bg-gradient-card border-border shadow-md text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
            <Info className="w-6 h-6 text-success" />
          </div>
          <h3 className="font-semibold text-foreground">All Clear!</h3>
          <p className="text-sm text-muted-foreground">No active alerts at this time</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card border-border shadow-md">
      <h3 className="text-lg font-semibold text-foreground mb-4">Active Alerts</h3>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg border-2 ${getStyles(alert.type)} transition-all`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className={`mt-0.5 ${
                  alert.type === 'danger' ? 'text-danger' :
                  alert.type === 'warning' ? 'text-warning' :
                  'text-primary'
                }`}>
                  {getIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold mb-1 ${
                    alert.type === 'danger' ? 'text-danger' :
                    alert.type === 'warning' ? 'text-warning' :
                    'text-primary'
                  }`}>
                    {alert.title}
                  </h4>
                  <p className="text-sm text-foreground/90">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{alert.timestamp}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissAlert(alert.id)}
                className="hover:bg-background/50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AlertsPanel;
