import React from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { Heart, Activity, Wind, Droplet } from 'lucide-react';

interface HealthMetricProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  trend?: string;
  trendColor?: string;
}

const HealthMetric: React.FC<HealthMetricProps> = ({
  icon,
  value,
  label,
  trend,
  trendColor = '#60a5fa'
}) => {
  return (
    <GlassCard 
      variant="default" 
      size="md" 
      className="w-full h-32"
      interactive
      animate
      whileHover={{ 
        scale: 1.02, 
        y: -2,
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="mb-3 p-2 rounded-full bg-white/10">
          <div className="text-primary-cyan-400">{icon}</div>
        </div>
        <div className="text-2xl font-bold text-white mb-1">{value}</div>
        <div className="text-sm text-white/60 font-medium">{label}</div>
        {trend && (
          <div className="mt-2 text-xs font-medium" style={{ color: trendColor }}>
            {trend}
          </div>
        )}
      </div>
    </GlassCard>
  );
};

const HealthMetricsGrid: React.FC = () => {
  const metrics = [
    {
      icon: <Heart size={20} />,
      value: "68bpm",
      label: "Heart Rate",
      trend: "→ Stable",
      trendColor: "#60a5fa"
    },
    {
      icon: <Activity size={20} />,
      value: "65ms",
      label: "HRV",
      trend: "↑ Improving",
      trendColor: "#4ade80"
    },
    {
      icon: <Wind size={20} />,
      value: "14bpm",
      label: "Respiration",
      trend: "→ Stable",
      trendColor: "#60a5fa"
    },
    {
      icon: <Droplet size={20} />,
      value: "Good",
      label: "Hydration",
      trend: "→ Stable",
      trendColor: "#60a5fa"
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {metrics.map((metric, index) => (
        <HealthMetric
          key={index}
          icon={metric.icon}
          value={metric.value}
          label={metric.label}
          trend={metric.trend}
          trendColor={metric.trendColor}
        />
      ))}
    </div>
  );
};

export default HealthMetricsGrid;
