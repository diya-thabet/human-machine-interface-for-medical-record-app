import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { GlucoseReading } from '@/types/medical';
import { Card } from '@/components/ui/card';
import { Activity } from 'lucide-react';

interface GlucoseChartProps {
  data: GlucoseReading[];
}

const GlucoseChart = ({ data }: GlucoseChartProps) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const reading = payload[0].payload as GlucoseReading;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold text-foreground">{reading.time}</p>
          <p className={`text-lg font-bold ${
            reading.status === 'high' ? 'text-danger' : 
            reading.status === 'low' ? 'text-warning' : 
            'text-success'
          }`}>
            {reading.glucose} mg/dL
          </p>
          <p className="text-xs text-muted-foreground capitalize">{reading.status}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 bg-gradient-card border-border shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">24-Hour Glucose Monitor</h3>
      </div>
      
      <div className="flex gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-muted-foreground">Normal (70-140)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-danger" />
          <span className="text-muted-foreground">High (&gt;140)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-warning" />
          <span className="text-muted-foreground">Low (&lt;70)</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="glucoseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="time" 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
            tickFormatter={(value, index) => index % 4 === 0 ? value : ''}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 12 }}
            domain={[50, 200]}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Reference lines for healthy range */}
          <ReferenceLine y={140} stroke="hsl(var(--danger))" strokeDasharray="3 3" opacity={0.5} />
          <ReferenceLine y={70} stroke="hsl(var(--warning))" strokeDasharray="3 3" opacity={0.5} />
          
          <Area
            type="monotone"
            dataKey="glucose"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            fill="url(#glucoseGradient)"
          />
          <Line
            type="monotone"
            dataKey="glucose"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={(props: any) => {
              const { cx, cy, payload } = props;
              const color = payload.status === 'high' ? 'hsl(var(--danger))' : 
                           payload.status === 'low' ? 'hsl(var(--warning))' : 
                           'hsl(var(--success))';
              return <circle cx={cx} cy={cy} r={4} fill={color} stroke="white" strokeWidth={2} />;
            }}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-2xl font-bold text-success">98</p>
          <p className="text-xs text-muted-foreground">Current mg/dL</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">115</p>
          <p className="text-xs text-muted-foreground">Average Today</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">7.2%</p>
          <p className="text-xs text-muted-foreground">HbA1c</p>
        </div>
      </div>
    </Card>
  );
};

export default GlucoseChart;
